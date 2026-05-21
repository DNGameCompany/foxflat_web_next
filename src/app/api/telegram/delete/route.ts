import { NextRequest, NextResponse } from "next/server";

function extractMessageId(messageUrl: string): number | null {
    const match = messageUrl.match(/\/(\d+)$/);
    return match ? parseInt(match[1], 10) : null;
}

export async function POST(req: NextRequest) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    const channelId = process.env.TELEGRAM_CHANNEL_ID;

    if (!token || !channelId) {
        return NextResponse.json({ error: "Telegram not configured" }, { status: 500 });
    }

    const { messageUrl } = await req.json();

    if (!messageUrl) {
        return NextResponse.json({ error: "messageUrl is required" }, { status: 400 });
    }

    const messageId = extractMessageId(messageUrl);
    if (!messageId) {
        return NextResponse.json({ error: "Cannot extract message_id from URL" }, { status: 400 });
    }

    const res = await fetch(`https://api.telegram.org/bot${token}/deleteMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chat_id: channelId, message_id: messageId }),
    });

    const result = await res.json();

    if (!result.ok) {
        return NextResponse.json({ error: result.description ?? "Telegram error" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
}
