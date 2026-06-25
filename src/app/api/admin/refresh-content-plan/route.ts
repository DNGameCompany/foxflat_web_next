import { NextRequest } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export const dynamic = "force-dynamic";

const BLOG_API = "https://api.foxflat.com.ua";

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

async function getContentPlan(): Promise<ContentPlan> {
    const snap = await getDoc(doc(db, "config", "content_plan"));
    return snap.exists() ? (snap.data() as ContentPlan) : { items: [], updatedAt: "" };
}

async function getExistingPosts(): Promise<{ title: string; category: string }[]> {
    try {
        const res = await fetch(`${BLOG_API}/blog/posts`);
        if (!res.ok) return [];
        const data = await res.json();
        return Array.isArray(data) ? data : [];
    } catch { return []; }
}

export async function POST(req: NextRequest) {
    // save=true to persist the result to Firestore immediately
    const body = await req.json().catch(() => ({}));
    const autoSave: boolean = body.save === true;

    const enc = new TextEncoder();
    const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
    const writer = writable.getWriter();

    const emit = (data: object) =>
        writer.write(enc.encode(`data: ${JSON.stringify(data)}\n\n`));

    (async () => {
        try {
            await emit({ type: "progress", step: "fetching", progress: 5, message: "Завантаження статей..." });

            const [posts, plan] = await Promise.all([getExistingPosts(), getContentPlan()]);

            await emit({ type: "progress", step: "analyzing", progress: 25, message: "AI аналізує контент-план..." });

            const today = new Date().toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });

            const c = posts.reduce((acc: Record<string, number>, p) => {
                acc[p.category] = (acc[p.category] ?? 0) + 1;
                return acc;
            }, {});

            const postsCtx = posts.length
                ? posts.map((p) => `[${p.category}] ${p.title}`).join("\n")
                : "Статей ще немає";

            const planCtx = plan.items.length
                ? plan.items.map((i) => `[${i.status}] (${i.priority}) ${i.topic} — ${i.reason}`).join("\n")
                : "Контент-план порожній";

            const res = await fetch("https://api.anthropic.com/v1/messages", {
                method: "POST",
                headers: {
                    "x-api-key": process.env.ANTHROPIC_API_KEY!,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                body: JSON.stringify({
                    model: "claude-sonnet-4-6",
                    max_tokens: 3000,
                    system: `Ти — SEO-стратег foxflat.com.ua (оренда квартир, Україна).
Міста (22): ${CITIES.join(", ")}.
Категорії: news 25% | guide 35% | tips 40%.
Ціль: топ-10 Google за "оренда квартир [місто]".
Відповідай ТІЛЬКИ JSON без markdown.`,
                    messages: [{
                        role: "user",
                        content: `Сьогодні: ${today}
Розподіл статей: tips ${c.tips ?? 0}, news ${c.news ?? 0}, guide ${c.guide ?? 0}

ОПУБЛІКОВАНІ СТАТТІ (${posts.length}):
${postsCtx}

ПОТОЧНИЙ КОНТЕНТ-ПЛАН (${plan.items.length} тем):
${planCtx}

Проаналізуй покриття тем:
1. Які теми застаріли або вже добре розкриті в статтях?
2. Яких тем, міст або категорій бракує?
3. Які заплановані теми варто залишити, які переглянути, а які видалити?
4. Які нові теми додати для кращого SEO?

Поверни оновлений контент-план (15-25 тем, лише status=planned):
{"analysis":"3-4 речення: що змінив і чому","items":[{"topic":"","status":"planned","priority":"high","reason":""}]}`,
                    }],
                }),
            });

            if (!res.ok) throw new Error(`Claude API error: ${res.status}`);

            const data = await res.json();
            const tokens = {
                input: data.usage?.input_tokens ?? 0,
                output: data.usage?.output_tokens ?? 0,
            };

            const raw: string = data.content[0].text.trim()
                .replace(/^```json?\s*/i, "")
                .replace(/\s*```$/, "");

            let parsed: { analysis: string; items: PlanItem[] };
            try {
                parsed = JSON.parse(raw);
            } catch {
                const fixed = raw.replace(/("(?:[^"\\]|\\.)*")/g, (m) =>
                    m.replace(/\n/g, "\\n").replace(/\r/g, "\\r")
                );
                parsed = JSON.parse(fixed);
            }

            if (autoSave) {
                await setDoc(doc(db, "config", "content_plan"), {
                    items: parsed.items,
                    updatedAt: new Date().toISOString(),
                });
            }

            await emit({
                type: "done",
                progress: 100,
                analysis: parsed.analysis,
                items: parsed.items,
                previousCount: plan.items.filter((i) => i.status === "planned").length,
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

export async function PUT(req: NextRequest) {
    try {
        const { items } = await req.json() as { items: PlanItem[] };
        await setDoc(doc(db, "config", "content_plan"), {
            items,
            updatedAt: new Date().toISOString(),
        });
        return Response.json({ ok: true });
    } catch (e) {
        return Response.json({ error: String(e) }, { status: 500 });
    }
}
