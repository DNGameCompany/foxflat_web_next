import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
    const session = req.cookies.get("admin_session")?.value;
    const secret = process.env.ADMIN_SESSION_SECRET;

    if (!secret || !session || session !== secret) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/api/admin/:path*"],
};