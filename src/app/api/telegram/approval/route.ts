import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const BLOG_API = "https://api.foxflat.com.ua";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://foxflat.com.ua";

async function markPlanItem(slug: string, status: "published" | "skip") {
    try {
        const ref  = doc(db, "config", "content_plan");
        const snap = await getDoc(ref);
        if (!snap.exists()) return;
        const plan = snap.data();
        const items = (plan.items ?? []).map((item: { topic: string; status: string }) =>
            item.topic.toLowerCase().includes(slug.replace(/-/g, " ").toLowerCase().slice(0, 15))
                ? { ...item, status }
                : item
        );
        await setDoc(ref, { ...plan, items, updatedAt: new Date().toISOString() });
    } catch (e) {
        console.error("Failed to update content plan:", e);
    }
}

async function tgCall(token: string, method: string, body: object) {
    return fetch(`https://api.telegram.org/bot${token}/${method}`, {
        method:  "POST",
        headers: { "content-type": "application/json" },
        body:    JSON.stringify(body),
    });
}

export async function POST(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN!;
    const body  = await req.json();

    const cb = body.callback_query;
    if (!cb) return NextResponse.json({ ok: true });

    const data:      string = cb.data ?? "";
    const chatId:    number = cb.message.chat.id;
    const messageId: number = cb.message.message_id;
    const origText:  string = cb.message.text ?? "";

    if (data.startsWith("approve_")) {
        const slug = data.replace("approve_", "");

        // Публікуємо пост
        const pubRes = await fetch(`${BLOG_API}/blog/posts/${slug}/publish`, { method: "PATCH" });

        if (pubRes.ok) {
            // Постимо в TG канал
            const postRes = await fetch(`${BLOG_API}/blog/posts/${slug}`);
            if (postRes.ok) {
                const post = await postRes.json();
                await fetch(`${SITE_URL}/api/telegram/publish`, {
                    method:  "POST",
                    headers: { "content-type": "application/json" },
                    body: JSON.stringify({
                        title:       post.title,
                        excerpt:     post.excerpt,
                        slug:        post.slug,
                        cover_image: post.cover_image,
                        category:    post.category,
                        content:     post.content,
                    }),
                });
            }

            // Оновлюємо контент-план
            await markPlanItem(slug, "published");

            await tgCall(token, "answerCallbackQuery", {
                callback_query_id: cb.id,
                text: "✅ Опубліковано і запощено в канал!",
            });
            await tgCall(token, "editMessageText", {
                chat_id:    chatId,
                message_id: messageId,
                text:       `✅ *Опубліковано*\n\n${origText}`,
                parse_mode: "Markdown",
            });
        } else {
            await tgCall(token, "answerCallbackQuery", {
                callback_query_id: cb.id,
                text: "⚠️ Помилка публікації",
            });
        }

    } else if (data.startsWith("reject_")) {
        const slug = data.replace("reject_", "");

        await fetch(`${BLOG_API}/blog/posts/${slug}`, { method: "DELETE" });
        await markPlanItem(slug, "skip");

        await tgCall(token, "answerCallbackQuery", {
            callback_query_id: cb.id,
            text: "❌ Відхилено і видалено",
        });
        await tgCall(token, "editMessageText", {
            chat_id:    chatId,
            message_id: messageId,
            text:       `❌ *Відхилено*\n\n${origText}`,
            parse_mode: "Markdown",
        });
    }

    return NextResponse.json({ ok: true });
}
