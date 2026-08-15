import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

const BLOG_API = "https://api.foxflat.com.ua";

export interface SearchResult {
    title:   string;
    url:     string;
    snippet: string;
}

export interface PlanItem {
    topic:    string;
    status:   "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason:   string;
}

export interface ContentPlan {
    items:     PlanItem[];
    updatedAt: string;
}

export interface GeneratedPost {
    title:        string;
    excerpt:      string;
    content:      string;
    category:     string;
    slug:         string;
    seo_keywords: string[];
}

export const CITIES = [
    "Київ", "Львів", "Одеса", "Харків", "Дніпро", "Запоріжжя",
    "Вінниця", "Миколаїв", "Херсон", "Чернігів", "Полтава", "Черкаси",
    "Суми", "Житомир", "Рівне", "Луцьк", "Тернопіль", "Хмельницький",
    "Кропивницький", "Ужгород", "Івано-Франківськ", "Чернівці",
];

export async function searchGoogle(query: string, count = 5): Promise<SearchResult[]> {
    const key = process.env.GOOGLE_SEARCH_API_KEY;
    const cx  = process.env.GOOGLE_SEARCH_CX;
    if (!key || !cx) return [];
    try {
        const params = new URLSearchParams({
            key,
            cx,
            q:            query,
            num:          String(Math.min(count, 10)),
            lr:           "lang_uk",
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

export function formatSearchResults(results: SearchResult[], label: string): string {
    if (!results.length) return "";
    return `\n─── ${label} ───\n` +
        results.map((r, i) =>
            `${i + 1}. ${r.title}\n   ${r.snippet}\n   ${r.url}`
        ).join("\n\n");
}

// Визначає місто зі згаданих у темі назв — потрібно лише як fallback
// для forcedTopic (коли немає AI-планування, яке саме підбирає запити).
export function extractCity(topic: string): string | null {
    return CITIES.find((city) => topic.includes(city)) ?? null;
}

// Виконує пошукові запити, підібрані планувальником саме під обрану тему
// (а не жорстко зашитий шаблон) — це джерело конкретних фактів для статті.
export async function runTargetedSearches(queries: string[]): Promise<string> {
    const picked = queries.slice(0, 4);
    if (!picked.length) return "";
    const resultsList = await Promise.all(picked.map((q) => searchGoogle(q, 3)));
    return resultsList
        .map((results, i) => formatSearchResults(results, picked[i]))
        .filter(Boolean)
        .join("\n");
}

export async function getContentPlan(): Promise<ContentPlan> {
    const snap = await getDoc(doc(db, "config", "content_plan"));
    return snap.exists() ? (snap.data() as ContentPlan) : { items: [], updatedAt: "" };
}

export async function saveContentPlan(plan: ContentPlan) {
    await setDoc(doc(db, "config", "content_plan"), {
        ...plan,
        updatedAt: new Date().toISOString(),
    });
}

export async function getExistingPosts(): Promise<{ title: string; category: string }[]> {
    try {
        const res = await fetch(`${BLOG_API}/blog/posts`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
}

async function callClaude(system: string, userMsg: string, maxTokens: number): Promise<{ raw: string; tokens: { input: number; output: number } }> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key":         process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type":      "application/json",
        },
        body: JSON.stringify({
            model:      "claude-sonnet-4-6",
            max_tokens: maxTokens,
            system,
            messages: [{ role: "user", content: userMsg }],
        }),
    });

    if (!res.ok) throw new Error(`Claude API error: ${res.status} ${await res.text()}`);

    const data = await res.json();
    const raw: string = data.content[0].text.trim()
        .replace(/^```json?\s*/i, "")
        .replace(/\s*```$/, "");

    return {
        raw,
        tokens: {
            input:  data.usage?.input_tokens ?? 0,
            output: data.usage?.output_tokens ?? 0,
        },
    };
}

function repairAndParseJson(raw: string): unknown {
    try {
        return JSON.parse(raw);
    } catch { /* спробуємо полагодити нижче */ }

    const escaped = raw
        .replace(/\r\n/g, "\\n")
        .replace(/\n/g, "\\n")
        .replace(/\r/g, "\\r")
        .replace(/\t/g, "\\t");
    try {
        return JSON.parse(escaped);
    } catch {
        throw new Error(`JSON parse failed. Фрагмент відповіді: ${raw.slice(0, 300)}`);
    }
}

const PLANNING_SYSTEM_PROMPT = `Ти — SEO-контент-менеджер foxflat.com.ua (оренда квартир по Україні).
Міста (22): ${CITIES.join(", ")}.
SEO-ціль: топ-10 за "оренда квартир [місто]".

Категорії: news 25% | guide 35% | tips 40%
news — новини ринку/законодавства; guide — інструкції (орендувати, перевірити, договір); tips — поради, лайфхаки, чек-листи.

Твоя задача — ТІЛЬКИ планування, без написання тексту статті.
1. Онови план: додай нові теми (баланс категорій + міст, великі міста частіше).
2. Обери найкращу наступну тему (SEO + актуальність + баланс категорій). Якщо тема прив'язана до міста — вкажи місто прямо в тексті теми (наприклад "Огляд районів для оренди у Львові").
3. Сформуй 2-4 пошукові запити українською мовою — саме ті, які знайдуть КОНКРЕТНІ актуальні факти, необхідні для цієї статті (а не загальні). Наприклад: для теми про місто — ціни й райони цього міста; для теми про ВПО — суми й назви програм компенсації оренди, актуальна статистика переселенців; для теми про закон — номер/назву закону і дату змін. Без точних, наведених пошуком фактів стаття вийде порожньою "водою" — це найважливіший крок.

Відповідай ТІЛЬКИ JSON без markdown:
{"plan_updates":[{"topic":"","status":"planned","priority":"high","reason":""}],"selected_topic":"","selection_reason":"","category":"news|guide|tips","search_queries":["",""]}`;

export interface PlanningResult {
    plan_updates:     PlanItem[];
    selected_topic:   string;
    selection_reason: string;
    category:         string;
    search_queries:   string[];
}

export async function planNextTopic(
    posts: { title: string; category: string }[],
    plan: ContentPlan,
    generalSearchCtx: string,
    forcedTopic: string | null,
): Promise<{ result: PlanningResult; tokens: { input: number; output: number } }> {
    if (forcedTopic) {
        const plan_updates = plan.items.map((i) =>
            i.topic === forcedTopic ? { ...i, status: "published" as const } : i
        );
        const city = extractCity(forcedTopic);
        return {
            result: {
                plan_updates,
                selected_topic:   forcedTopic,
                selection_reason: "Тема обрана вручну оператором",
                category:         "guide",
                // без AI-планування немає розбору теми на конкретні запити —
                // беремо саму тему як запит (+ ціни міста, якщо воно згадане)
                search_queries:   city ? [forcedTopic, `ціни оренди квартир ${city} 2026`] : [forcedTopic],
            },
            tokens: { input: 0, output: 0 },
        };
    }

    const today = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

    const c = posts.reduce((acc: Record<string, number>, p) => {
        acc[p.category] = (acc[p.category] ?? 0) + 1;
        return acc;
    }, {});

    const recentPosts = posts.slice(-25);
    const postsCtx = recentPosts.length
        ? recentPosts.map((p) => `[${p.category}] ${p.title}`).join("\n")
        : "Статей ще немає";

    const plannedItems = plan.items.filter((i) => i.status === "planned");
    const publishedCount = plan.items.filter((i) => i.status === "published").length;
    const planCtx = plannedItems.length
        ? plannedItems.map((i) => `(${i.priority}) ${i.topic} — ${i.reason}`).join("\n")
        : "Немає запланованих тем";

    const userMsg = `Сьогодні: ${today} | Розподіл: tips ${c.tips ?? 0}, news ${c.news ?? 0}, guide ${c.guide ?? 0}

СТАТТІ (${posts.length} всього, останні ${recentPosts.length}):
${postsCtx}

ПЛАН (${plannedItems.length} заплановано, ${publishedCount} опубліковано):
${planCtx}

${generalSearchCtx}`;

    const { raw, tokens } = await callClaude(PLANNING_SYSTEM_PROMPT, userMsg, 800);
    return { result: repairAndParseJson(raw) as PlanningResult, tokens };
}

const CONTENT_SYSTEM_PROMPT = `Ти — SEO-копірайтер foxflat.com.ua (оренда квартир по Україні).

Достовірність (критично): нижче наведені пошукові дані — ЄДИНЕ джерело конкретних фактів (ціни, назви районів, статистика, згадки законів). Твоя власна пам'ять про ціни чи райони може бути ЗАСТАРІЛОЮ — НЕ використовуй її для конкретних цифр чи назв.
- Якщо в пошукових даних є ціни/райони для потрібного міста — використовуй саме їх з посиланням у тексті на джерело як контекст (без прямого URL).
- Якщо даних для міста немає — НЕ вигадуй ціни чи перелік районів. Пиши узагальнено (наприклад "ціни залежать від району та стану ремонту") або зроби акцент на інших аспектах (як шукати, юридичні нюанси, поради).

TITLE (критично для CTR у Google — це найважливіше поле):
- До 60 символів (Google обрізає довші в видачі — рахуй символи, не слова).
- НЕ повторюй буквально майбутній пошуковий запит — обіцяй конкретну вигоду чи відповідь.
- Формат "питання" або "число + вигода" працює краще за описовий заголовок:
  Погано: "Комунальні платежі при оренді квартири в Україні"
  Добре:  "Хто платить комуналку при оренді: 5 правил, які варто знати"
- Якщо доречно — додай рік (2026), число (кроків/порад/причин) або гостре слово ("помилка", "пастка", "як не втратити").
- Уникай кліпбейту, який не відповідає змісту статті.

EXCERPT (meta description — друге по важливості для CTR):
- 120-155 символів.
- НЕ дублюй title слово в слово — доповнюй його, обіцяй конкретний результат читання.
- Формулюй як відповідь на біль читача: що він дізнається/отримає, прочитавши статтю.

Відповідай ТІЛЬКИ JSON без markdown. В content — HTML теги, \\n-escape замість реальних переносів. В HTML атрибутах використовуй одинарні лапки (<a href='url'>), а НЕ подвійні.
{"title":"","excerpt":"","content":"","category":"","slug":"","seo_keywords":[]}`;

export async function writePost(
    selectedTopic: string,
    category: string,
    generalSearchCtx: string,
    citySearchCtx: string,
): Promise<{ result: GeneratedPost; tokens: { input: number; output: number } }> {
    const today = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

    const searchCtx = [generalSearchCtx, citySearchCtx].filter(Boolean).join("\n") || "Пошукові дані недоступні.";

    const userMsg = `Сьогодні: ${today}
Тема: "${selectedTopic}"
Категорія: ${category}

${searchCtx}

Напиши статтю 700-900 слів: вступ → 3-4×H2 → висновок. LSI природно.`;

    const { raw, tokens } = await callClaude(CONTENT_SYSTEM_PROMPT, userMsg, 5000);
    return { result: repairAndParseJson(raw) as GeneratedPost, tokens };
}

export async function sendDraftNotification(params: {
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

export async function generateCoverImage(title: string, category: string, keywords: string[]): Promise<string | null> {
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

export async function publishDraft(post: GeneratedPost): Promise<void> {
    const wordCount = post.content.replace(/<[^>]+>/g, "").split(/\s+/).length;
    const blogRes = await fetch(`${BLOG_API}/blog/posts`, {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
            ...post,
            cover_image: "",
            published:   false,
            read_time:   Math.max(1, Math.round(wordCount / 200)),
        }),
    });
    if (!blogRes.ok) throw new Error(`Blog API: ${await blogRes.text()}`);
}
