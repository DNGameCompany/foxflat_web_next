import { NextRequest, NextResponse } from "next/server";

const CATEGORY_HASHTAGS: Record<string, string> = {
    tips:  "#поради #нерухомість #foxflat",
    news:  "#новини #нерухомість #foxflat",
    guide: "#гайд #нерухомість #foxflat",
};

export async function POST(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!token || !channelId) {
        return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
    }

    const { title, excerpt, slug, cover_image, category } = await req.json();

    if (!title || !slug) {
        return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
    }

    const hashtags = CATEGORY_HASHTAGS[category] ?? "#нерухомість #foxflat";
    const postUrl = `https://foxflat.com.ua/blog/${slug}`;
    const caption = `📰 <b>${escapeHtml(title)}</b>\n\n${escapeHtml(excerpt ?? "")}\n\n👉 <a href="${postUrl}">Читати повністю</a>\n\n${hashtags}`;

    const tgUrl = `https://api.telegram.org/bot${token}`;

    let result: { ok: boolean; result?: { message_id: number }; description?: string };

    if (cover_image) {
        const res = await fetch(`${tgUrl}/sendPhoto`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: channelId,
                photo: cover_image,
                caption,
                parse_mode: "HTML",
            }),
        });
        result = await res.json();
    } else {
        const res = await fetch(`${tgUrl}/sendMessage`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: channelId,
                text: caption,
                parse_mode: "HTML",
            }),
        });
        result = await res.json();
    }

    if (!result.ok) {
        return NextResponse.json({ error: result.description ?? "Telegram error" }, { status: 500 });
    }

    const messageId = result.result!.message_id;
    const username = channelId.startsWith("@") ? channelId.slice(1) : channelId;
    const messageUrl = `https://t.me/${username}/${messageId}`;

    return NextResponse.json({ ok: true, messageUrl });
}

function escapeHtml(text: string): string {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
