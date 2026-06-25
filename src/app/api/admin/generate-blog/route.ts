import { NextRequest } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const BLOG_API = "https://api.foxflat.com.ua";

interface SearchResult {
    title: string;
    url: string;
    snippet: string;
}

interface PlanItem {
    topic: string;
    status: "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason: string;
}

interface ContentPlan {
    items: PlanItem[];
    updatedAt: string;
}

const CITIES = [
    "Київ", "Львів", "Одеса", "Харків", "Дніпро", "Запоріжжя",
    "Вінниця", "Миколаїв", "Херсон", "Чернігів", "Полтава", "Черкаси",
    "Суми", "Житомир", "Рівне", "Луцьк", "Тернопіль", "Хмельницький",
    "Кропивницький", "Ужгород", "Івано-Франківськ", "Чернівці",
];

async function searchGoogle(query: string, count = 5): Promise<SearchResult[]> {
    const key = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_CX;
    if (!key || !cx) return [];
    try {
        const params = new URLSearchParams({
            key, cx, q: query,
            num: String(Math.min(count, 10)),
            lr: "lang_uk",
            dateRestrict: "m3",
        });
        const res = await fetch(`https://www.googleapis.com/customsearch/v1?${params}`);
        if (!res.ok) return [];
        const data = await res.json();
        return (data.items ?? []).map((r: { title: string; link: string; snippet: string }) => ({
            title: r.title, url: r.link, snippet: r.snippet,
        }));
    } catch { return []; }
}

function formatSearchResults(results: SearchResult[], label: string): string {
    if (!results.length) return "";
    return `\n─── ${label} ───\n` +
        results.map((r, i) => `${i + 1}. ${r.title}\n   ${r.snippet}\n   ${r.url}`).join("\n\n");
}

async function getContentPlan(): Promise<ContentPlan> {
    const snap = await getDoc(doc(db, "config", "content_plan"));
    return snap.exists() ? (snap.data() as ContentPlan) : { items: [], updatedAt: "" };
}

async function saveContentPlan(plan: ContentPlan) {
    await setDoc(doc(db, "config", "content_plan"), { ...plan, updatedAt: new Date().toISOString() });
}

async function getExistingPosts() {
    try {
        const res = await fetch(`${BLOG_API}/blog/posts`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch { return []; }
}

const SYSTEM_PROMPT = `Ти — SEO-контент-менеджер foxflat.com.ua (оренда квартир по Україні).
Міста (22): ${CITIES.join(", ")}.
SEO-ціль: топ-10 за "оренда квартир [місто]".

Категорії: news 25% | guide 35% | tips 40%
news — новини ринку/законодавства; guide — інструкції (орендувати, перевірити, договір); tips — поради, лайфхаки, чек-листи.

Достовірність (критично): тільки факти з пошукових результатів або загальновідомі. Не вигадуй ціни/статистику без джерела. news лише за наявності свіжих пошукових даних — інакше guide/tips.

Відповідай ТІЛЬКИ JSON без markdown. В content — HTML теги, \n-escape замість реальних переносів:
{"plan_updates":[{"topic":"","status":"planned","priority":"high","reason":""}],"selected_topic":"","selection_reason":"","post":{"title":"","excerpt":"","content":"","category":"","slug":"","seo_keywords":[]}}`;

async function callClaude(
    posts: { title: string; category: string }[],
    plan: ContentPlan,
    searches: { news: SearchResult[]; laws: SearchResult[]; prices: SearchResult[] },
    forcedTopic: string | null,
): Promise<{ result: unknown; tokens: { input: number; output: number } }> {
    const today = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

    const c = posts.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
    }, {});

    // Останні 25 статей; slug не потрібен для промпту
    const recentPosts = posts.slice(-25);
    const postsCtx = recentPosts.length
        ? recentPosts.map((p) => `[${p.category}] ${p.title}`).join("\n")
        : "Статей ще немає";

    // Тільки заплановані теми — опубліковані вже видно в списку статей
    const plannedItems = plan.items.filter((i) => i.status === "planned");
    const publishedCount = plan.items.filter((i) => i.status === "published").length;
    const planCtx = plannedItems.length
        ? plannedItems.map((i) => `(${i.priority}) ${i.topic} — ${i.reason}`).join("\n")
        : "Немає запланованих тем";

    const searchCtx = [
        formatSearchResults(searches.news,   "НОВИНИ РИНКУ"),
        formatSearchResults(searches.laws,   "ЗАКОНОДАВСТВО"),
        formatSearchResults(searches.prices, "ЦІНИ"),
    ].filter(Boolean).join("\n") || "Пошукові дані недоступні.";

    const topicDirective = forcedTopic
        ? `ТЕМА ОБРАНА ВРУЧНУ: "${forcedTopic}"
Пропусти вибір теми. Напиши статтю саме про неї.
selected_topic = "${forcedTopic}" | selection_reason = чому ця тема важлива для SEO.
В plan_updates познач "${forcedTopic}" як published, решту не змінюй.`
        : `1. Онови план: додай нові теми (баланс категорій + міст, великі міста частіше).
2. Обери найкращу тему (SEO + актуальність + баланс). Місто з найбільшим потенціалом і малим покриттям.`;

    const userMsg = `Сьогодні: ${today} | Розподіл: tips ${c.tips ?? 0}, news ${c.news ?? 0}, guide ${c.guide ?? 0}

СТАТТІ (${posts.length} всього, останні ${recentPosts.length}):
${postsCtx}

ПЛАН (${plannedItems.length} заплановано, ${publishedCount} опубліковано):
${planCtx}

${searchCtx}

${topicDirective}
${forcedTopic ? "" : "3. "}Напиши 700-900 слів: вступ → 3-4×H2 → висновок. LSI природно. Місто → райони/ціни/особливості.`;

    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model:      "claude-sonnet-4-6",
            max_tokens: 4000,
            system:     SYSTEM_PROMPT,
            messages:   [{ role: "user", content: userMsg }],
        }),
    });

    if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);

    const data = await res.json();
    const tokens = {
        input: data.usage?.input_tokens ?? 0,
        output: data.usage?.output_tokens ?? 0,
    };

    const raw: string = data.content[0].text
        .trim()
        .replace(/^```json?\s*/i, "")
        .replace(/\s*```$/, "");

    let result: unknown;
    try {
        result = JSON.parse(raw);
    } catch {
        const fixed = raw.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
            m.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t")
        );
        result = JSON.parse(fixed);
    }

    return { result, tokens };
}

async function sendDraftNotification(params: {
    title: string;
    excerpt: string;
    slug: string;
    selectionReason: string;
    seoKeywords: string[];
    planUpdated: number;
}) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foxflat.com.ua";
    const recipients = (process.env.TELEGRAM_NOTIFY_IDS ?? process.env.ADMIN_TELEGRAM_ID ?? "")
        .split(",").map((id) => id.trim()).filter(Boolean);

    const text = [
        `🤖 *Нова чернетка в блозі*`, ``,
        `📝 *${params.title}*`, ``,
        params.excerpt, ``,
        `🎯 *Чому ця тема:*`,
        params.selectionReason, ``,
        `🔑 ${params.seoKeywords.join(" · ")}`,
        `📋 Контент-план оновлено: +${params.planUpdated} тем`, ``,
        `✏️ [Відкрити в адмінці](${siteUrl}/admin)`,
    ].join("\n");

    await Promise.all(recipients.map((chatId) =>
        fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ chat_id: chatId, text, parse_mode: "Markdown", disable_web_page_preview: true }),
        })
    ));
}

export async function POST(req: NextRequest) {
    const body = await req.json().catch(() => ({}));
    const forcedTopic: string | null = body.topic || null;
    // dry_run = true: generate content only, skip saving to API and Telegram notification
    const isDryRun: boolean = body.dry_run === true;

    const enc = new TextEncoder();
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();

    const emit = (data: object) =>
        writer.write(enc.encode(`data: ${JSON.stringify(data)}\n\n`));

    (async () => {
        try {
            await emit({ type: "progress", step: "fetching", progress: 5, message: "Завантаження даних..." });

            const [posts, plan] = await Promise.all([getExistingPosts(), getContentPlan()]);

            await emit({ type: "progress", step: "searching", progress: 18, message: "Пошук актуальних даних..." });

            const [news, laws, prices] = await Promise.all([
                searchGoogle("ринок нерухомості України оренда квартир новини", 3),
                searchGoogle("закон оренда житло Україна зміни 2025", 2),
                searchGoogle("ціни оренди квартир Київ Львів Одеса Харків", 3),
            ]);

            await emit({ type: "progress", step: "generating", progress: 45, message: "Генерація AI контенту..." });

            const { result, tokens } = await callClaude(
                posts,
                plan,
                { news, laws, prices },
                forcedTopic,
            );

            const r = result as {
                plan_updates: PlanItem[];
                selected_topic: string;
                selection_reason: string;
                post: {
                    title: string; excerpt: string; content: string;
                    category: string; slug: string; seo_keywords?: string[];
                };
            };

            if (isDryRun) {
                // Return generated content without saving — user fills the form manually
                await emit({
                    type: "done",
                    progress: 100,
                    post: {
                        title:    r.post.title,
                        excerpt:  r.post.excerpt,
                        content:  r.post.content,
                        category: r.post.category,
                        slug:     r.post.slug,
                    },
                    tokens,
                });
                return;
            }

            await emit({ type: "progress", step: "saving", progress: 85, message: "Збереження статті..." });

            await saveContentPlan({ items: r.plan_updates, updatedAt: new Date().toISOString() });

            const wc = r.post.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
            const blogRes = await fetch(`${BLOG_API}/blog/posts`, {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    ...r.post,
                    cover_image: "",
                    published: false,
                    read_time: Math.max(1, Math.round(wc / 200)),
                }),
            });
            if (!blogRes.ok) throw new Error(`Blog API: ${await blogRes.text()}`);

            await emit({ type: "progress", step: "notifying", progress: 95, message: "Telegram сповіщення..." });

            await sendDraftNotification({
                title: r.post.title,
                excerpt: r.post.excerpt,
                slug: r.post.slug,
                selectionReason: r.selection_reason,
                seoKeywords: r.post.seo_keywords ?? [],
                planUpdated: r.plan_updates.filter((i) => i.status === "planned").length,
            });

            await emit({
                type: "done",
                progress: 100,
                slug:   r.post.slug,
                topic:  r.selected_topic,
                reason: r.selection_reason,
                tokens,
            });
        } catch (e) {
            await emit({ type: "error", message: String(e) });
        } finally {
            writer.close();
        }
    })();

    return new Response(readable, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    });
}
