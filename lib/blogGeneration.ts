import { doc, getDoc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase";

const BLOG_API = "https://api.foxflat.com.ua";

export interface SearchResult {
    title:   string;
    url:     string;
    snippet: string;
}

// Категорії пошукових запитів — кожна дає інший тип даних для статті.
// "competitors" — окрема категорія: не факти по темі, а аналіз того,
// що вже є в топі видачі, щоб стаття не дублювала конкурентів, а закривала їхні прогалини.
export type SearchCategory = "stats" | "legal" | "competitors" | "news" | "expert" | "local";

export interface SearchQuery {
    query:    string;
    category: SearchCategory;
}

const CATEGORY_LABELS: Record<SearchCategory, string> = {
    stats:       "СТАТИСТИКА / ЦІНИ",
    legal:       "ЗАКОНОДАВСТВО",
    competitors: "ЩО ВЖЕ В ТОП-10 GOOGLE (конкуренти)",
    news:        "СВІЖІ НОВИНИ",
    expert:      "ЕКСПЕРТНІ ДУМКИ / КЕЙСИ",
    local:       "ЛОКАЛЬНІ ДАНІ (місто/район)",
};

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

// Скільки пошукових запитів максимум використовуємо на статтю і скільки
// результатів тягнемо на кожен запит. 8 запитів × 5 результатів = до 40 посилань.
// ВАЖЛИВО: Google Custom Search JSON API безкоштовний ліміт — 100 запитів/день,
// тобто ~12 статей/день при MAX_QUERIES_PER_ARTICLE=8. Якщо генеруєте частіше —
// або зменшіть це число, або підключіть платний тір.
const MAX_QUERIES_PER_ARTICLE = 8;
const RESULTS_PER_QUERY       = 5;
const COMPETITOR_RESULTS      = 8;

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

// Виконує пошукові запити, підібрані планувальником саме під обрану тему,
// згруповані по категоріях (факти, конкуренти, законодавство тощо) —
// це джерело конкретних даних для статті. Категорія "competitors" рендериться
// окремим блоком з поясненням, що це аналіз топ-видачі, а не факти для копіювання.
export async function runTargetedSearches(queries: SearchQuery[]): Promise<string> {
    const picked = queries.slice(0, MAX_QUERIES_PER_ARTICLE);
    if (!picked.length) return "";

    const resultsList = await Promise.all(
        picked.map((q) =>
            searchGoogle(q.query, q.category === "competitors" ? COMPETITOR_RESULTS : RESULTS_PER_QUERY)
        )
    );

    return resultsList
        .map((results, i) => {
            const q = picked[i];
            const label = `${CATEGORY_LABELS[q.category]} — запит: "${q.query}"`;
            return formatSearchResults(results, label);
        })
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
3. Сформуй 6-8 пошукових запитів українською мовою, РІЗНИХ за категорією — щоб зібрати максимально глибокий і актуальний матеріал, а не загальну "воду". Обов'язково включи:
   - "stats": 1-2 запити на конкретні ціни/статистику ринку (для теми з містом — саме цього міста).
   - "competitors": 1-2 запити — точна цільова SEO-фраза цієї статті (наприклад "оренда квартир Львів" або "як орендувати квартиру в Україні") — щоб побачити, що вже в топі Google і не дублювати це, а закрити прогалини.
   - "legal": якщо тема торкається закону/договору/оподаткування — 1 запит з номером/назвою закону, якщо відомо.
   - "news": якщо тема новинна — 1-2 запити на останні новини (останні 1-3 місяці).
   - "expert": 1 запит на експертну думку, кейс або дослідження по темі.
   - "local": якщо тема прив'язана до міста — 1 запит на район/інфраструктуру цього міста.
   Пропускай категорії, які нерелевантні темі (наприклад "legal" для чек-листа порад).

Відповідай ТІЛЬКИ JSON без markdown:
{"plan_updates":[{"topic":"","status":"planned","priority":"high","reason":""}],"selected_topic":"","selection_reason":"","category":"news|guide|tips","search_queries":[{"query":"","category":"stats|legal|competitors|news|expert|local"}]}`;

export interface PlanningResult {
    plan_updates:     PlanItem[];
    selected_topic:   string;
    selection_reason: string;
    category:         string;
    search_queries:   SearchQuery[];
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
        const search_queries: SearchQuery[] = [
            { query: forcedTopic, category: "competitors" },
        ];
        if (city) {
            search_queries.push(
                { query: `ціни оренди квартир ${city} 2026`, category: "stats" },
                { query: `райони для оренди квартири ${city}`, category: "local" },
            );
        }
        return {
            result: {
                plan_updates,
                selected_topic:   forcedTopic,
                selection_reason: "Тема обрана вручну оператором",
                category:         "guide",
                // без AI-планування немає розбору теми на пошукові категорії —
                // беремо базовий набір: сама тема як конкурентний запит + локальні дані міста
                search_queries,
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

    const { raw, tokens } = await callClaude(PLANNING_SYSTEM_PROMPT, userMsg, 1200);
    return { result: repairAndParseJson(raw) as PlanningResult, tokens };
}

const CONTENT_SYSTEM_PROMPT = `Ти — SEO-копірайтер foxflat.com.ua (оренда квартир по Україні).

Достовірність (критично): нижче наведені пошукові дані — ЄДИНЕ джерело конкретних фактів (ціни, назви районів, статистика, згадки законів, новини). Твоя власна пам'ять про ціни чи райони може бути ЗАСТАРІЛОЮ — НЕ використовуй її для конкретних цифр чи назв.
- Якщо в пошукових даних є ціни/райони/факти для потрібної теми — використовуй саме їх, згадуючи джерело як контекст у тексті (без прямого URL).
- Якщо даних для якогось аспекту немає — НЕ вигадуй цифри чи назви. Пиши узагальнено або зроби акцент на аспектах, де дані є.
- Блок "ЩО ВЖЕ В ТОП-10 GOOGLE" — це НЕ джерело фактів для копіювання, а аналіз конкурентів. Прочитай, що вони вже висвітлюють, і:
  1. НЕ повторюй їхню структуру і формулювання.
  2. Знайди, чого їм бракує (застарілі дані, немає конкретики, немає прикладів/кейсів, немає порівняння, немає відповіді на практичне питання) — і закрий саме цю прогалину.
  3. Якщо є свіжіші дані (з блоків "СВІЖІ НОВИНИ", "СТАТИСТИКА") — це твоя перевага, використай її явно.

СТРУКТУРА — обирай сам, залежно від теми і від того, чого бракує конкурентам. НЕ використовуй завжди один і той самий шаблон "вступ → 3 H2 → висновок". Варіанти на вибір (комбінуй за потреби):
- Практичний гайд: короткий вступ із болем читача → пронумеровані кроки (H2 або H3 на крок) → підсумок-чекліст.
- Порівняння/огляд: вступ → таблиця або структуровані блоки порівняння (наприклад райони/ціни/варіанти) → рекомендація.
- Новина/аналіз: що сталося (з фактами і датою) → чому це важливо для орендаря/орендодавця → що робити далі.
- Питання-відповідь: 5-8 конкретних питань читача як підзаголовки H2/H3, кожне — пряма відповідь по суті.
- Лонгрід-дослідження: якщо є багато статистики — веди статтю навколо даних, а не навколо загальних порад.
Обирай той формат, який найкраще подає САМЕ ЗІБРАНІ ДАНІ і найкраще відрізняється від конкурентів з пошуку. Кількість підзаголовків — довільна (2-7), головне — щоб кожен ніс конкретну інформацію, а не воду.

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

ОБСЯГ: 800-1400 слів — залежно від того, скільки реальних, конкретних даних дав пошук (більше якісних даних → довша, конкретніша стаття; мало даних → коротша, без води).

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

Напиши статтю, спираючись на дані вище. Обери структуру сам за інструкцією в системному промті — під цю тему і під те, що вже є в конкурентів.`;

    const { raw, tokens } = await callClaude(CONTENT_SYSTEM_PROMPT, userMsg, 7000);
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