import { NextRequest, NextResponse } from "next/server";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { storage, db } from "@/lib/firebase";

const BLOG_API = "https://api.foxflat.com.ua";

interface SearchResult {
    title:   string;

    url:     string;
    snippet: string;
}

async function searchGoogle(query: string, count = 5): Promise<SearchResult[]> {
    const key = process.env.GOOGLE_SEARCH_API_KEY;
    const cx  = process.env.GOOGLE_SEARCH_CX;
    if (!key || !cx) return [];
    try {
        const params = new URLSearchParams({
            key,
            cx,
            q:          query,
            num:        String(Math.min(count, 10)),
            lr:         "lang_uk",
            dateRestrict: "m3",
        });
        const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.items ?? []).map((r: { title: string; link: string; snippet: string }) => ({
            title:   r.title,
            url:     r.link,
            snippet: r.snippet,
        }));
    } catch {
        return [];
    }
}

function formatSearchResults(results: SearchResult[], label: string): string {
    if (!results.length) return "";
    return `\n─── ${label} ───\n` +
        results.map((r, i) =>
            `${i + 1}. ${r.title}\n   ${r.snippet}\n   ${r.url}`
        ).join("\n\n");
}

const CITIES = [
    "Київ", "Львів", "Одеса", "Харків", "Дніпро", "Запоріжжя",
    "Вінниця", "Миколаїв", "Херсон", "Чернігів", "Полтава", "Черкаси",
    "Суми", "Житомир", "Рівне", "Луцьк", "Тернопіль", "Хмельницький",
    "Кропивницький", "Ужгород", "Івано-Франківськ", "Чернівці",
];

interface PlanItem {
    topic:    string;
    status:   "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason:   string;
}

interface ContentPlan {
    items:     PlanItem[];
    updatedAt: string;
}

async function getContentPlan(): Promise<ContentPlan> {
    const snap = await getDoc(doc(db, "config", "content_plan"));
    return snap.exists() ? (snap.data() as ContentPlan) : { items: [], updatedAt: "" };
}

async function saveContentPlan(plan: ContentPlan) {
    await setDoc(doc(db, "config", "content_plan"), {
        ...plan,
        updatedAt: new Date().toISOString(),
    });
}

async function getExistingPosts() {
    try {
        const res = await fetch(`${BLOG_API}/blog/posts`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

const SYSTEM_PROMPT = `Ти — SEO-контент-менеджер foxflat.com.ua (оренда квартир по Україні).
Міста (22): ${CITIES.join(", ")}.
SEO-ціль: топ-10 за "оренда квартир [місто]".

Категорії: news 25% | guide 35% | tips 40%
news — новини ринку/законодавства; guide — інструкції (орендувати, перевірити, договір); tips — поради, лайфхаки, чек-листи.

Достовірність (критично): тільки факти з пошукових результатів або загальновідомі. Не вигадуй ціни/статистику без джерела. news лише за наявності свіжих пошукових даних — інакше guide/tips.

Відповідай ТІЛЬКИ JSON без markdown. В content — HTML теги, \n-escape замість реальних переносів:
{"plan_updates":[{"topic":"","status":"planned","priority":"high","reason":""}],"selected_topic":"","selection_reason":"","post":{"title":"","excerpt":"","content":"","category":"","slug":"","seo_keywords":[]}}`;

async function analyzeAndGenerate(posts: {
    title: string;
    category: string;
}[], plan: ContentPlan) {
    const today = new Date().toLocaleDateString("uk-UA", {
        day: "numeric", month: "long", year: "numeric",
    });

    const c = posts.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
    }, {});

    // Показуємо лише останні 25 статей і тільки заплановані теми — решта шум
    const recentPosts = posts.slice(-25);
    const postsCtx = recentPosts.length
        ? recentPosts.map((p) => `[${p.category}] ${p.title}`).join("\n")
        : "Статей ще немає";

    const plannedItems = plan.items.filter((i) => i.status === "planned");
    const publishedCount = plan.items.filter((i) => i.status === "published").length;
    const planCtx = plannedItems.length
        ? plannedItems.map((i) => `(${i.priority}) ${i.topic} — ${i.reason}`).join("\n")
        : "Немає запланованих тем";

    // 8 результатів замість 12 — достатньо для актуального контексту
    const [newsResults, lawResults, priceResults] = await Promise.all([
        searchGoogle("ринок нерухомості України оренда квартир новини", 3),
        searchGoogle("закон оренда житло Україна зміни 2025", 2),
        searchGoogle("ціни оренди квартир Київ Львів Одеса Харків", 3),
    ]);

    const searchCtx = [
        formatSearchResults(newsResults,  "НОВИНИ РИНКУ"),
        formatSearchResults(lawResults,   "ЗАКОНОДАВСТВО"),
        formatSearchResults(priceResults, "ЦІНИ"),
    ].filter(Boolean).join("\n") || "Пошукові дані недоступні.";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key":         process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type":      "application/json",
        },
        body: JSON.stringify({
            model:      "claude-sonnet-4-6",
            max_tokens: 4000,
            system:     SYSTEM_PROMPT,
            messages: [{
                role:    "user",
                content: `Сьогодні: ${today} | Розподіл: tips ${c.tips ?? 0}, news ${c.news ?? 0}, guide ${c.guide ?? 0}

СТАТТІ (${posts.length} всього, останні ${recentPosts.length}):
${postsCtx}

ПЛАН (${plannedItems.length} заплановано, ${publishedCount} опубліковано):
${planCtx}

${searchCtx}

1. Онови план: додай нові теми (баланс категорій + міст, великі міста частіше).
2. Обери найкращу тему (SEO + актуальність + баланс). Місто з найбільшим потенціалом і малим покриттям.
3. Напиши 700-900 слів: вступ → 3-4×H2 → висновок. LSI природно. Місто → райони/ціни/особливості.`,
            }],
        }),
    });

    if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);

    const data = await res.json();
    const raw: string = data.content[0].text.trim()
        .replace(/^```json?\s*/i, "")
        .replace(/\s*```$/, "");

    try {
        return JSON.parse(raw);
    } catch {
        const fixed = raw.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
            m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
        );
        return JSON.parse(fixed);
    }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function buildImagePrompt(title: string, category: string, keywords: string[]): string {
    const cityMatch = title.match(/(Київ|Львів|Одеса|Харків|Дніпро|Запоріжжя|Вінниця|Миколаїв|Херсон|Чернігів|Полтава|Черкаси|Суми|Житомир|Рівне|Луцьк|Тернопіль|Хмельницький|Кропивницький|Ужгород|Івано-Франківськ|Чернівці)/i);
    const city = cityMatch ? cityMatch[1] : null;

    const categoryStyles: Record<string, string> = {
        news:  "abstract infographic illustration, real estate market data visualization, bar charts and trend arrows, Ukrainian city silhouette in background, flat design",
        guide: "modern flat design infographic, step-by-step process icons, document and key and contract symbols, clean minimal style",
        tips:  "flat design illustration, checklist and lightbulb and home icons, practical tips concept, modern minimal style",
    };

    const style = categoryStyles[category] ?? categoryStyles.tips;
    const cityCtx = city ? `, ${city} Ukraine minimal city silhouette accent` : "";
    const keyword = keywords[0] ?? title;

    return `${style}${cityCtx}, topic: ${keyword}. Color palette: orange and white and dark grey. Wide banner 16:9. No text, no letters, no words. Clean vector art style.`;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
async function generateCoverImage(title: string, category: string, keywords: string[]): Promise<string | null> {
    try {
        const prompt = buildImagePrompt(title, category, keywords);
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-fast-generate-001:predict?key=${process.env.GEMINI_API_KEY}`,
            {
                method:  "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    instances:  [{ prompt }],
                    parameters: { sampleCount: 1, aspectRatio: "16:9" },
                }),
            }
        );

        if (!res.ok) {
            console.error("Gemini image error:", await res.text());
            return null;
        }

        const data   = await res.json();
        const base64 = data.predictions?.[0]?.bytesBase64Encoded;

        if (!base64) return null;

        const buffer     = Buffer.from(base64, "base64");
        const storageRef = ref(storage, `blog/auto-${Date.now()}.jpg`);
        await uploadBytes(storageRef, buffer, { contentType: "image/jpeg" });
        return await getDownloadURL(storageRef);
    } catch (e) {
        console.error("Image generation failed:", e);
        return null;
    }
}

async function sendDraftNotification(params: {
    title:           string;
    excerpt:         string;
    slug:            string;
    selectionReason: string;
    seoKeywords:     string[];
    planUpdated:     number;
}) {
    const token   = process.env.TELEGRAM_BOT_TOKEN!;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foxflat.com.ua";

    const recipients = (process.env.TELEGRAM_NOTIFY_IDS ?? process.env.ADMIN_TELEGRAM_ID ?? "")
        .split(",")
        .map((id) => id.trim())
        .filter(Boolean);

    const text = [
        `🤖 *Нова чернетка в блозі*`,
        ``,
        `📝 *${params.title}*`,
        ``,
        params.excerpt,
        ``,
        `🎯 *Чому ця тема:*`,
        params.selectionReason,
        ``,
        `🔑 ${params.seoKeywords.join(" · ")}`,
        `📋 Контент-план оновлено: +${params.planUpdated} тем`,
        ``,
        `✏️ [Відкрити в адмінці](${siteUrl}/admin)`,
    ].join("\n");

    await Promise.all(recipients.map((chatId) =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method:  "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                chat_id:                  chatId,
                text,
                parse_mode:               "Markdown",
                disable_web_page_preview: true,
            }),
        })
    ));
}

export async function GET(req: NextRequest) {
    if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const [posts, contentPlan] = await Promise.all([
            getExistingPosts(),
            getContentPlan(),
        ]);

        const result = await analyzeAndGenerate(posts, contentPlan);

        // Зберігаємо оновлений контент-план
        await saveContentPlan({ items: result.plan_updates, updatedAt: new Date().toISOString() });

        // TODO: генерація зображення через Imagen API (потребує білінг)
        // const coverImage = await generateCoverImage(result.post.title, result.post.category, result.post.seo_keywords ?? []);

        const wordCount = result.post.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
        const blogRes = await fetch(`${BLOG_API}/blog/posts`, {
            method:  "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                ...result.post,
                cover_image: "",
                published:   false,
                read_time:   Math.max(1, Math.round(wordCount / 200)),
            }),
        });

        if (!blogRes.ok) throw new Error(`Blog API: ${await blogRes.text()}`);

        await sendDraftNotification({
            title:           result.post.title,
            excerpt:         result.post.excerpt,
            slug:            result.post.slug,
            selectionReason: result.selection_reason,
            seoKeywords:     result.post.seo_keywords ?? [],
            planUpdated:     result.plan_updates.filter((i: PlanItem) => i.status === "planned").length,
        });

        return NextResponse.json({
            ok:    true,
            slug:  result.post.slug,
            topic: result.selected_topic,
        });
    } catch (e) {
        console.error("Cron error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}
