import { NextResponse } from "next/server";

export async function POST() {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/cron/generate`, {
        headers: { Authorization: `Bearer ${process.env.CRON_SECRET}` },
    });
    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
}