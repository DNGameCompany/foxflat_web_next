import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";

export async function GET(req: NextRequest) {
    // простий захист від прямих запитів «збоку»
    const referer = req.headers.get("referer") ?? "";
    const origin = req.headers.get("origin") ?? "";
    const host = req.headers.get("host") ?? "";

    const allowed =
        referer.includes(host) ||
        origin.includes(host) ||
        process.env.NODE_ENV === "development";

    if (!allowed) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    try {
        const filePath = path.join(
            process.cwd(),
            "private",
            "docs",
            "dogovir-najmu-zhytla-shablon.pdf"
        );
        const buffer = await readFile(filePath);

        return new NextResponse(buffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition":
                    'attachment; filename="dogovir-najmu-zhytla.pdf"',
                "Cache-Control": "no-store",
                "X-Content-Type-Options": "nosniff",
            },
        });
    } catch {
        return NextResponse.json({ error: "File not found" }, { status: 404 });
    }
}