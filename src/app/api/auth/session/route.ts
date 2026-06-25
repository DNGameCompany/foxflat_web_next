import { NextRequest, NextResponse } from "next/server";

const FIREBASE_API_KEY = "AIzaSyA0pEOXR9Uno1VPcY6VlQGi9q6mfgEYgMY";

async function verifyFirebaseToken(idToken: string): Promise<string | null> {
    try {
        const res = await fetch(
            `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${FIREBASE_API_KEY}`,
            {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({ idToken }),
            }
        );
        if (!res.ok) return null;
        const data = await res.json();
        return (data.users?.[0]?.email as string) ?? null;
    } catch {
        return null;
    }
}

export async function POST(req: NextRequest) {
    const adminEmail = process.env.ADMIN_EMAIL;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!adminEmail || !sessionSecret) {
        return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
    }

    let idToken: string | undefined;
    try {
        ({ idToken } = await req.json());
    } catch {
        return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    if (!idToken) {
        return NextResponse.json({ error: "Missing token" }, { status: 400 });
    }

    const email = await verifyFirebaseToken(idToken);
    if (!email || email !== adminEmail) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set("admin_session", sessionSecret, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
    });
    return res;
}

export async function DELETE() {
    const res = NextResponse.json({ ok: true });
    res.cookies.delete("admin_session");
    return res;
}