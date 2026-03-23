// src/app/api/revalidate/route.ts
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const { path, token } = await req.json();

        if (token !== process.env.NEXT_REVALIDATE_TOKEN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (!path) {
            return NextResponse.json({ error: "path required" }, { status: 400 });
        }

        revalidatePath(path);
        return NextResponse.json({ revalidated: true, path });

    } catch (e) {
        return NextResponse.json({ error: String(e) }, { status: 500 });
    }
}