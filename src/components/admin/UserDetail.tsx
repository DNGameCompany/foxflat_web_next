// src/components/admin/UserDetail.tsx
"use client";

import { useEffect, useState, JSX } from "react";

interface Timestamp {
    seconds: number;
    nanoseconds?: number;
}

interface UserDetails {
    user_id: string;
    created_at?: string | Timestamp;
    subscription_status?: string;
    subscription_name?: string;
    subscription_end_date?: string | Timestamp;
    current_geo?: string;
    current_state?: string;
    flatfy_url?: string | null;
    dimria_url?: string | null;
    filters?: Record<string, unknown> | null;
    last_payment?: {
        amount?: number;
        currency?: string;
        status?: string;
        create_date?: string | Timestamp;
    } | null;
    deleted_info?: {
        deleted_at?: string | Timestamp;
        deleted_by?: string;
    } | null;
}

interface UserDetailProps {
    userId: string;
}

export default function UserDetail({ userId }: UserDetailProps) {
    const [user, setUser] = useState<UserDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!userId) return;
        setLoading(true);
        setError(null);

        fetch(`https://api.foxflat.com.ua/users/${userId}`)
            .then((res) => {
                if (!res.ok) throw new Error(res.status === 404 ? "Користувача не знайдено" : `Помилка сервера: ${res.status}`);
                return res.json();
            })
            .then((data) => setUser(data))
            .catch((err: unknown) => setError(err instanceof Error ? err.message : "Не вдалося завантажити дані"))
            .finally(() => setLoading(false));
    }, [userId]);

    const formatDate = (d?: string | Timestamp) => {
        if (!d) return "—";
        const date = typeof d === "string" ? new Date(d) : new Date(d.seconds * 1000);
        return isNaN(date.getTime()) ? "—" : date.toLocaleString("uk-UA");
    };

    const formatDateOnly = (d?: string | Timestamp) => {
        if (!d) return "—";
        const date = typeof d === "string" ? new Date(d) : new Date(d.seconds * 1000);
        return isNaN(date.getTime()) ? "—" : date.toLocaleDateString("uk-UA");
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[40vh] gap-3 text-orange-400">
            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium">Завантаження...</span>
        </div>
    );

    if (error || !user) return (
        <div className="text-center py-12">
            <p className="text-sm text-red-400">{error || "Користувача не знайдено"}</p>
        </div>
    );

    const hasFilters = user.filters && Object.keys(user.filters).length > 0;
    const hasSources = user.flatfy_url || user.dimria_url;
    const subName = user.subscription_name || "—";
    const subStatus = user.subscription_status;

    return (
        <div className="space-y-4 pb-8">

            {/* Видалений юзер */}
            {user.deleted_info && (
                <div className="flex items-center gap-3 px-5 py-4 rounded-xl border border-red-500/30 bg-red-500/[0.07]">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-red-400 flex-shrink-0">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <p className="text-sm text-red-400 font-medium">
                        Користувач видалений — {formatDate(user.deleted_info.deleted_at)}
                        {user.deleted_info.deleted_by ? ` · ${user.deleted_info.deleted_by}` : ""}
                    </p>
                </div>
            )}

            {/* Основна інформація */}
            <Section title="Основна інформація">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    <InfoItem label="User ID" value={user.user_id} mono />
                    <InfoItem label="Дата створення" value={formatDate(user.created_at)} />
                    <InfoItem label="Підписка" value={`${subName}${subStatus ? ` · ${subStatus}` : ""}`}
                              accent={subName !== "—" && subName !== "trial"} />
                    <InfoItem label="Закінчення підписки" value={formatDateOnly(user.subscription_end_date)} />
                    <InfoItem label="Місто" value={user.current_geo || "—"} />
                    <InfoItem label="Стан бота" value={user.current_state || "—"} />
                </div>
            </Section>

            {/* Джерела парсингу */}
            {hasSources && (
                <Section title="Джерела парсингу">
                    <div className="flex flex-col gap-3">
                        {user.flatfy_url && <LinkItem label="Flatfy" url={user.flatfy_url} />}
                        {user.dimria_url && <LinkItem label="DimRia" url={user.dimria_url} />}
                    </div>
                </Section>
            )}

            {/* Фільтри */}
            {hasFilters && (
                <Section title="Фільтри">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {Object.entries(user.filters!).map(([key, value]) => (
                            <FilterItem key={key} label={key} value={value} />
                        ))}
                    </div>
                </Section>
            )}

            {/* Останній платіж */}
            {user.last_payment && (
                <Section title="Останній платіж">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <InfoItem label="Сума" value={`${user.last_payment.amount ?? "—"} ${user.last_payment.currency ?? ""}`} accent />
                        <InfoItem label="Статус" value={user.last_payment.status ?? "—"} />
                        <InfoItem label="Дата" value={formatDate(user.last_payment.create_date)} />
                    </div>
                </Section>
            )}
        </div>
    );
}

// ── Допоміжні компоненти ─────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    {title}
                </p>
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

function InfoItem({ label, value, mono, accent }: { label: string; value: string; mono?: boolean; accent?: boolean }) {
    return (
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] text-white/25 uppercase tracking-widest">{label}</p>
            <p className={`text-sm font-semibold leading-snug break-all ${
                mono ? "font-mono text-white/60" : accent ? "text-orange-400" : "text-white/70"
            }`}>
                {value}
            </p>
        </div>
    );
}

function LinkItem({ label, url }: { label: string; url: string }) {
    return (
        <div className="flex flex-col gap-1 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">{label}</p>
            <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-orange-400 hover:text-orange-300 break-all underline underline-offset-2 transition-colors"
            >
                {url}
            </a>
        </div>
    );
}

function FilterItem({ label, value }: { label: string; value: unknown }) {
    const renderValue = (val: unknown): JSX.Element => {
        if (val === null || val === undefined) return <span className="text-white/25">—</span>;
        if (Array.isArray(val)) return (
            <div className="flex flex-wrap gap-1 mt-1">
                {val.map((item, idx) => (
                    <span key={idx} className="text-xs px-2 py-0.5 rounded-md bg-white/[0.05] text-white/50">
                        {renderValue(item)}
                    </span>
                ))}
            </div>
        );
        if (typeof val === "object") return (
            <div className="flex flex-col gap-1 mt-1 pl-3 border-l border-white/[0.07]">
                {Object.entries(val as Record<string, unknown>).map(([k, v]) => (
                    <div key={k} className="text-xs">
                        <span className="text-white/25">{k}: </span>
                        {renderValue(v)}
                    </div>
                ))}
            </div>
        );
        return <span className="text-white/60">{val.toString()}</span>;
    };

    return (
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">{label}</p>
            <div className="text-sm">{renderValue(value)}</div>
        </div>
    );
}