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

async function analyzeAndGenerate(posts: {
    title: string;
    category: string;
    slug: string;
}[], plan: ContentPlan) {
    const today = new Date().toLocaleDateString("uk-UA", {
        day: "numeric", month: "long", year: "numeric",
    });

    const categoryCount = posts.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
    }, {});
    const categoryStats = `tips: ${categoryCount.tips ?? 0}, news: ${categoryCount.news ?? 0}, guide: ${categoryCount.guide ?? 0}`;

    const postsCtx = posts.length
        ? posts.map((p) => `- [${p.category}] "${p.title}"`).join("\n")
        : "Статей ще немає";

    const planCtx = plan.items.length
        ? plan.items.map((i) => `- [${i.status}] (${i.priority}) ${i.topic} — ${i.reason}`).join("\n")
        : "Контент-план порожній";

    // Паралельно шукаємо актуальні дані
    const [newsResults, lawResults, priceResults] = await Promise.all([
        searchGoogle("ринок нерухомості України оренда квартир новини", 5),
        searchGoogle("закон оренда житло Україна зміни 2025", 3),
        searchGoogle("ціни оренди квартир Київ Львів Одеса Харків", 4),
    ]);

    const searchCtx = [
        formatSearchResults(newsResults,  "АКТУАЛЬНІ НОВИНИ РИНКУ НЕРУХОМОСТІ"),
        formatSearchResults(lawResults,   "ЗМІНИ В ЗАКОНОДАВСТВІ"),
        formatSearchResults(priceResults, "ЦІНИ НА ОРЕНДУ"),
    ].filter(Boolean).join("\n") || "Пошукові дані недоступні — спирайся лише на перевірені факти.";

    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key":         process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type":      "application/json",
        },
        body: JSON.stringify({
            model:      "claude-sonnet-4-6",
            max_tokens: 8000,
            messages: [{
                role:    "user",
                content: `Ти — SEO-стратег і контент-менеджер для foxflat.com.ua.

САЙТ: сервіс пошуку та оренди квартир по всій Україні.
МІСТА СЕРВІСУ (${CITIES.length}): ${CITIES.join(", ")}.
АУДИТОРІЯ: люди, що шукають оренду квартири в різних містах України.
SEO-ЦІЛЬ: Google топ-10 за запитами "оренда квартир [місто]" та суміжними по всіх містах.
СЬОГОДНІ: ${today}

─── КАТЕГОРІЇ БЛОГУ ───
• news  (Новини)  — актуальні новини ринку нерухомості, зміни законодавства, тренди
• guide (Гайд)   — покрокові інструкції: як орендувати, як перевірити, як скласти договір
• tips  (Порада) — практичні поради, лайфхаки, чек-листи для орендарів

ПОТОЧНИЙ РОЗПОДІЛ: ${categoryStats}

─── ІСНУЮЧІ СТАТТІ (${posts.length} шт.) ───
${postsCtx}

─── ПОТОЧНИЙ КОНТЕНТ-ПЛАН ───
${planCtx}
${searchCtx}

─── ПРАВИЛА ДОСТОВІРНОСТІ (КРИТИЧНО) ───
• Використовуй ТІЛЬКИ факти, які є в пошукових результатах вище АБО які є загальновідомою стабільною інформацією.
• Якщо пишеш конкретні ціни — бери з пошукових результатів або давай ДІАПАЗОН з поміткою "орієнтовно".
• Якщо пишеш про закони — посилайся на конкретні статті або джерела з результатів пошуку.
• НЕ вигадуй статистику, конкретні цифри чи факти "зі стелі" — це вводить читачів в оману.
• Якщо по темі немає свіжих даних — обери загальну/практичну тему де факти стабільні.
• Для категорії "news": ОБОВ'ЯЗКОВО спирайся на пошукові результати. Немає результатів — не пиши новини, обери guide/tips.

─── ТВОЄ ЗАВДАННЯ ───

1. АНАЛІЗ ПРОГАЛИН:
   - Яких тем або міст-специфічних матеріалів не вистачає?
   - Яка категорія (news/guide/tips) зараз недопредставлена?
   - Що актуально зараз (з пошукових результатів + сезон)?
   - Які LSI-кластери ще не охоплені?
   - Чи варто зробити статтю по конкретному місту?

2. ОНОВЛЕННЯ КОНТЕНТ-ПЛАНУ:
   - Відмітити опубліковані теми
   - Додати нові теми — баланс між: загальні / міські / категорії
   - Ідеальне співвідношення: ~40% tips, ~35% guide, ~25% news
   - По містах: більші міста частіше, менші рідше але обов'язково

3. ВИБІР ТЕМИ:
   - Найкраща тема для ЗАРАЗ з огляду на SEO + актуальність (пошукові дані) + баланс категорій
   - Якщо стаття про місто — обери те де найбільший потенціал трафіку і мало контенту
   - Поясни свій вибір (категорія + місто або загальна + чому зараз)

4. НАПИСАННЯ СТАТТІ:
   - Мова: українська, жива і природна
   - Обсяг: 700-900 слів
   - Структура: вступ → 3-4 секції H2 → висновок
   - Конкретні факти та поради — ТІЛЬКИ ті, в яких впевнений (з пошуку або стабільні знання)
   - LSI ключові слова природно в тексті
   - Якщо стаття про місто — локальні деталі: райони, орієнтовні ціни, особливості ринку
   - НІЯКИХ вигаданих цитат, статистики "за даними аналітиків" без джерела

Поверни ТІЛЬКИ валідний JSON без markdown. ВАЖЛИВО: у полі content НЕ використовуй реальні символи переносу рядка — замість них пиши HTML теги, пробіли або \n як escape-послідовність.
{
  "plan_updates": [
    {
      "topic": "назва теми",
      "status": "planned",
      "priority": "high",
      "reason": "чому важливо для SEO або аудиторії"
    }
  ],
  "selected_topic": "обрана тема",
  "selection_reason": "2-3 речення: чому саме ця тема зараз",
  "post": {
    "title": "заголовок до 70 символів",
    "excerpt": "SEO-мета опис до 160 символів",
    "content": "повний HTML: теги <h2> <p> <ul> <li> <strong>",
    "category": "tips або news або guide",
    "slug": "slug-latiynkoyu-do-60-symvoliv",
    "seo_keywords": ["ключове слово 1", "ключове слово 2", "ключове слово 3"]
  }
}`,
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
        // Claude sometimes includes literal newlines inside JSON strings — fix them
        const fixed = raw.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
            m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
        );
        return JSON.parse(fixed);
    }
}

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

async function generateCoverImage(title: string, category: string, keywords: string[]): Promise<string | null> {
    try {
        const prompt = buildImagePrompt(title, category, keywords);
        const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${process.env.GEMINI_API_KEY}`,
            {
                method:  "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: prompt }] }],
                    generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
                }),
            }
        );

        if (!res.ok) {
            console.error("Gemini image error:", await res.text());
            return null;
        }

        const data   = await res.json();
        const base64 = data.candidates?.[0]?.content?.parts?.find(
            (p: { inlineData?: { data: string } }) => p.inlineData
        )?.inlineData?.data;

        if (!base64) return null;

        const buffer     = Buffer.from(base64, "base64");
        const storageRef = ref(storage, `blog/auto-${Date.now()}.png`);
        await uploadBytes(storageRef, buffer, { contentType: "image/png" });
        return await getDownloadURL(storageRef);
    } catch (e) {
        console.error("Image generation failed:", e);
        return null;
    }
}

async function sendApprovalMessage(params: {
    title:           string;
    excerpt:         string;
    slug:            string;
    coverImage:      string | null;
    selectionReason: string;
    seoKeywords:     string[];
    planUpdated:     number;
}) {
    const token   = process.env.TELEGRAM_BOT_TOKEN!;
    const adminId = process.env.ADMIN_TELEGRAM_ID!;

    const caption = [
        `🤖 *Авто-пост на перевірку*`,
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
    ].join("\n");

    const keyboard = {
        inline_keyboard: [[
            { text: "✅ Опублікувати", callback_data: `approve_${params.slug}` },
            { text: "❌ Відхилити",    callback_data: `reject_${params.slug}` },
        ]],
    };

    if (params.coverImage) {
        await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
            method:  "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                chat_id:   adminId,
                photo:     params.coverImage,
            }),
        });
    }

    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            chat_id:      adminId,
            text:         params.coverImage ? caption : `${caption}\n📷 Без обкладинки`,
            parse_mode:   "Markdown",
            reply_markup: keyboard,
        }),
    });
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

        // Генеруємо зображення паралельно зі збереженням чернетки
        const [coverImage] = await Promise.all([
            generateCoverImage(result.post.title, result.post.category, result.post.seo_keywords ?? []),
        ]);

        const wordCount = result.post.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
        const blogRes = await fetch(`${BLOG_API}/blog/posts`, {
            method:  "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
                ...result.post,
                cover_image: coverImage ?? "",
                published:   false,
                read_time:   Math.max(1, Math.round(wordCount / 200)),
            }),
        });

        if (!blogRes.ok) throw new Error(`Blog API: ${await blogRes.text()}`);

        await sendApprovalMessage({
            title:           result.post.title,
            excerpt:         result.post.excerpt,
            slug:            result.post.slug,
            coverImage,
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
