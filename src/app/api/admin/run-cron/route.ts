import { NextRequest, NextResponse } from "next/server";
import {GET} from "@/src/app/api/cron/generate-blog/route";

export async function POST(req: NextRequest) {
    try {
        const fakeReq = new NextRequest(
            new URL("/api/cron/generate", req.url),
            { headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` } }
        );
        return await GET(fakeReq);
    } catch (e) {
        console.error("run-cron error:", e);
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}