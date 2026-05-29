import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const origin = new URL(req.url).origin;
    const res = await fetch(`${origin}/api/cron/generate`, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}