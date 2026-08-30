// humanize.ts
// Багаторівнева редакція чернетки після writePost(), перед publishDraft().
//
// Пайплайн (без платного детектора — при обсязі 2-3 статті/міс перевірка
// AI-скору робиться вручну через безкоштовний веб-інтерфейс GPTZero/Sapling
// перед публікацією, а не автоматично в коді):
//   1. Чистка ШІ-кліше (структурні патерни, не факти)
//   2. Авторський голос (особиста інтонація, нерівномірність)
//   3. Факт-чек (перевірка, що правки 1-2 не "поїхали" по цифрах/назвах з пошуку)

import type { GeneratedPost } from "./blogGeneration"; // підлаштуйте шлях під ваш проєкт

// ─── Прохід 1: чистка шаблонних ШІ-конструкцій ────────────────────────────
const CLICHE_SCRUB_SYSTEM_PROMPT = `Ти — редактор, який спеціалізується на прибиранні "ШІ-запаху" з тексту.

Тобі дають готову статтю. Знайди і перепиши:
1. Штучні зв'язки-кліше: "у сучасному світі", "важливо зазначити", "не варто забувати", "як відомо", "в наш час", "з одного боку... з іншого боку" — і подібні.
2. Однакову довжину і ритм речень підряд (3+ речення однакової структури поспіль) — розбий ритм: коротке речення. Потім довше, з деталлю.
3. Симетричні списки з однаковою граматичною формою в кожному пункті без жодного винятку — зроби 1-2 пункти "нерівними" (довший приклад, коротке уточнення).
4. Висновок, що просто повторює вступ іншими словами — заміни на конкретну дію або застереження, яких не було раніше в тексті.
5. Загальні твердження без конкретики — де можливо, доточи цифрою/прикладом з наведених даних, або прибери, якщо додати нема чим.

НЕ додавай нових фактів, яких немає в тексті. НЕ змінюй заголовки (H2/H3), title, excerpt. НЕ скорочуй текст суттєво.

Відповідай ТІЛЬКИ JSON без markdown: {"content":""}`;

// ─── Прохід 2: авторський голос ────────────────────────────────────────────
const VOICE_PASS_SYSTEM_PROMPT = `Ти — досвідчений автор блогу про оренду житла в Україні, який редагує чужий чорновик перед публікацією під своїм іменем.

Онови ТІЛЬКИ content (не title/excerpt, не структуру заголовків):
1. У 2-3 місцях додай коротку особисту репліку від автора: пересторогу з практики, суб'єктивну оцінку, або риторичне питання до читача.
2. Якщо є пронумерований список чи кроки — після одного з пунктів додай коротке речення-виняток.
3. Перший і останній абзац перепиши так, щоб вони явно не були симетричними один одному за структурою.
4. Не перетворюй офіційний текст (про закони) на розмовний блог — тон має лишитись доречним темі, лише менш "рівним".

Дані, на основі яких писалась стаття (використовуй тільки для перевірки, не додавай нових фактів понад це):
{{SEARCH_CONTEXT}}

Відповідай ТІЛЬКИ JSON без markdown: {"content":""}`;

// ─── Прохід 3: факт-чек після двох правок ──────────────────────────────────
// Найризикованіше місце: переписуючи речення, модель може "зсунути" цифру,
// переплутати місто чи назву закону. Цей прохід звіряє фінал з першоджерелом.
const FACT_CHECK_SYSTEM_PROMPT = `Ти — перевіряючий редактор. Тобі дають ДВІ версії статті: ОРИГІНАЛ (до стилістичної правки) і ВІДРЕДАГОВАНИЙ варіант, а також пошукові дані, з яких брались факти.

Завдання:
1. Пройди по ВІДРЕДАГОВАНОМУ варіанту і звір усі цифри, дати, назви (міст, законів, компаній, районів) з ОРИГІНАЛОМ і з пошуковими даними.
2. Якщо якась цифра/назва в відредагованому варіанті відрізняється від оригіналу і це НЕ підтверджено пошуковими даними — виправ назад на версію з оригіналу.
3. Якщо стилістична правка додала твердження, якого не було в оригіналі і воно НЕ підтверджене пошуковими даними — або прибери це твердження, або переформулюй як думку автора (не факт).
4. Якщо все узгоджено — поверни відредагований варіант без змін.
5. НЕ відкочуй стилістичні покращення (авторський голос, ритм речень) — виправляй ЛИШЕ фактичні розбіжності.

ОРИГІНАЛ:
{{ORIGINAL}}

ПОШУКОВІ ДАНІ:
{{SEARCH_CONTEXT}}

Відповідай ТІЛЬКИ JSON без markdown: {"content":"","corrections_made":["короткий опис кожного виправлення, або порожній масив якщо виправлень не було"]}`;

interface ClaudeCallResult {
    raw: string;
    tokens: { input: number; output: number };
}

async function callClaude(system: string, userMsg: string, maxTokens: number): Promise<ClaudeCallResult> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "x-api-key": process.env.ANTHROPIC_API_KEY!,
            "anthropic-version": "2023-06-01",
            "content-type": "application/json",
        },
        body: JSON.stringify({
            model: "claude-sonnet-4-6",
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
    return { raw, tokens: { input: data.usage?.input_tokens ?? 0, output: data.usage?.output_tokens ?? 0 } };
}

async function runStage(system: string, content: string): Promise<{ content: string; tokens: { input: number; output: number } }> {
    const { raw, tokens } = await callClaude(system, `Стаття (content):\n\n${content}`, 7000);
    const parsed = JSON.parse(raw) as { content: string };
    return { content: parsed.content, tokens };
}

async function runFactCheck(original: string, edited: string, searchCtx: string) {
    const system = FACT_CHECK_SYSTEM_PROMPT
        .replace("{{ORIGINAL}}", original)
        .replace("{{SEARCH_CONTEXT}}", searchCtx || "Дані відсутні.");
    const { raw, tokens } = await callClaude(system, `ВІДРЕДАГОВАНИЙ ВАРІАНТ:\n\n${edited}`, 7000);
    const parsed = JSON.parse(raw) as { content: string; corrections_made: string[] };
    return { content: parsed.content, corrections: parsed.corrections_made, tokens };
}

// ─── Оркестрація ────────────────────────────────────────────────────────────
export interface HumanizeResult {
    final: string;
    corrections: string[];
    tokens: { input: number; output: number };
}

export async function humanizeDraft(post: GeneratedPost, searchCtx: string): Promise<HumanizeResult> {
    let totalIn = 0, totalOut = 0;

    const stage1 = await runStage(CLICHE_SCRUB_SYSTEM_PROMPT, post.content);
    totalIn += stage1.tokens.input; totalOut += stage1.tokens.output;

    const voiceSystem = VOICE_PASS_SYSTEM_PROMPT.replace("{{SEARCH_CONTEXT}}", searchCtx || "Дані відсутні.");
    const stage2 = await runStage(voiceSystem, stage1.content);
    totalIn += stage2.tokens.input; totalOut += stage2.tokens.output;

    const stage3 = await runFactCheck(post.content, stage2.content, searchCtx);
    totalIn += stage3.tokens.input; totalOut += stage3.tokens.output;

    return {
        final: stage3.content,
        corrections: stage3.corrections,
        tokens: { input: totalIn, output: totalOut },
    };
}