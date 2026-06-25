import { NextRequest, NextResponse } from "next/server";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export interface PlanItem {
    topic: string;
    status: "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason: string;
}

export async function GET() {
    try {
        const snap = await getDoc(doc(db, "config", "content_plan"));
        if (!snap.exists()) return NextResponse.json({ items: [], updatedAt: null });
        return NextResponse.json(snap.data());
    } catch {
        return NextResponse.json({ error: "Failed to fetch content plan" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json().catch(() => null);
        if (!body || !Array.isArray(body.items)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }
        if (body.items.length > 100) {
            return NextResponse.json({ error: "Too many items" }, { status: 400 });
        }
        const items: PlanItem[] = body.items.map((i: PlanItem) => ({
            topic:    String(i.topic ?? "").slice(0, 300),
            status:   ["planned", "published", "skip"].includes(i.status) ? i.status : "planned",
            priority: ["high", "medium", "low"].includes(i.priority) ? i.priority : "medium",
            reason:   String(i.reason ?? "").slice(0, 500),
        }));
        await setDoc(doc(db, "config", "content_plan"), {
            items,
            updatedAt: new Date().toISOString(),
        });
        return NextResponse.json({ ok: true });
    } catch {
        return NextResponse.json({ error: "Failed to save content plan" }, { status: 500 });
    }
}
