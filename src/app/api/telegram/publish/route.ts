import { NextRequest, NextResponse } from "next/server";

const CATEGORY_META: Record<string, { emoji: string; hashtags: string }> = {
    tips:  { emoji: "💡", hashtags: "#поради #нерухомість #лайфхаки #foxflat" },
    news:  { emoji: "📣", hashtags: "#новини #нерухомість #ринок #foxflat" },
    guide: { emoji: "📖", hashtags: "#гайд #нерухомість #корисно #foxflat" },
};

export async function POST(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!token || !channelId) {
        return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
    }

    const { title, excerpt, slug, cover_image, category, content } = await req.json();

    if (!title || !slug) {
        return NextResponse.json({ error: "title and slug are required" }, { status: 400 });
    }

    const meta = CATEGORY_META[category] ?? { emoji: "📰", hashtags: "#нерухомість #foxflat" };
    const postUrl = `https://foxflat.com.ua/blog/${slug}`;

    // Ліміт підпису для sendPhoto — 1024 символи
    const CAPTION_LIMIT = cover_image ? 1024 : 4096;
    const FIXED_PARTS = [
        `${meta.emoji} <b>${escapeHtml(title)}</b>`,
        ``,
        ``,
        `━━━━━━━━━━━━━━`,
        ``,
        `🔗 <a href="${postUrl}">Читати статтю повністю →</a>`,
        ``,
        `━━━━━━━━━━━━━━`,
        ``,
        `🏠 <b>Шукаєш квартиру в оренду?</b>`,
        `Підписуйся на <a href="https://t.me/FoxFlat_bot">@FoxFlat_bot</a> — отримуй найкращі пропозиції першим!`,
        ``,
        meta.hashtags,
    ].join("\n");

    const excerptLen = excerpt ? escapeHtml(excerpt).length + 2 : 0;
    const availableChars = CAPTION_LIMIT - FIXED_PARTS.length - excerptLen - 4;
    const intro = buildIntro(content, excerpt, availableChars);

    const caption = [
        `${meta.emoji} <b>${escapeHtml(title)}</b>`,
        ``,
        escapeHtml(excerpt ?? ""),
        ``,
        intro,
        ``,
        `━━━━━━━━━━━━━━`,
        ``,
        `🔗 <a href="${postUrl}">Читати статтю повністю →</a>`,
        ``,
        `━━━━━━━━━━━━━━`,
        ``,
        `🏠 <b>Шукаєш квартиру в оренду?</b>`,
        `Підписуйся на <a href="https://t.me/FoxFlat_bot">@FoxFlat_bot</a> — отримуй найкращі пропозиції першим!`,
        ``,
        meta.hashtags,
    ].join("\n");

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

function stripHtml(html: string): string {
    return html.replace(/<[^>]+>/g, "").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").trim();
}

function firstParagraph(html: string): string {
    const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const text = stripHtml(match[1]).trim();
        if (text.length > 0) return text;
    }
    return stripHtml(html).trim();
}

function truncateWords(text: string, maxLen: number): string {
    if (text.length <= maxLen) return text;
    const cut = text.slice(0, maxLen).replace(/\s+\S*$/, "");
    return cut + "…";
}

function buildIntro(content: string | undefined, excerpt: string | undefined, maxLen: number): string {
    if (content) {
        const para = firstParagraph(content);
        if (para.length > 20) return escapeHtml(truncateWords(para, maxLen));
    }
    return escapeHtml(truncateWords(excerpt ?? "", maxLen));
}
