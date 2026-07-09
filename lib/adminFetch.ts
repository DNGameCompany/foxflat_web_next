import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

// Wraps fetch for /api/admin/* calls. The admin_session cookie (server-side)
// expires after 7 days independently of the Firebase client session, which
// persists much longer — so the panel can look "logged in" while every
// /api/admin/* call 401s. On 401, force a clean re-login instead of failing silently.
export async function adminFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
    const res = await fetch(input, init);
    if (res.status === 401 && typeof window !== "undefined") {
        await signOut(auth).catch(() => {});
        await fetch("/api/auth/session", { method: "DELETE" }).catch(() => {});
        window.location.href = "/admin/login";
    }
    return res;
}
