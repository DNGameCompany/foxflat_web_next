import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const origin = new URL(req.url).origin;
        const url = `${origin}/api/cron/generate`;
        console.log("Calling:", url);
        console.log("CRON_SECRET:", process.env.CRON_SECRET ? "set" : "NOT SET");

        const res = await fetch(url, {
            headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
        });

        console.log("Cron response status:", res.status);
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("run-cron error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}