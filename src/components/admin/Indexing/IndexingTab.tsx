"use client";

import { useEffect, useState, useCallback } from "react";
const API_URL = "https://api.foxflat.com.ua";

type IndexStatus = "unknown" | "pending" | "indexed" | "not_indexed" | "error";
type SortKey = "created_at" | "path" | "status" | "submitted_at";

interface Page {
    path: string;
    url: string;
    title: string;
    priority: number;
    status: IndexStatus;
    created_at?: string;
    submitted_at?: string;
    checked_at?: string;
    coverage_state?: string;
}

const STATUS_CONFIG: Record<IndexStatus, { label: string; color: string; dot: string }> = {
    unknown:     { label: "Невідомо",        color: "text-white/25",   dot: "bg-white/20" },
    pending:     { label: "В процесі",        color: "text-yellow-400", dot: "bg-yellow-400" },
    indexed:     { label: "Індексується",     color: "text-green-400",  dot: "bg-green-400" },
    not_indexed: { label: "Не індексується",  color: "text-white/40",   dot: "bg-white/20" },
    error:       { label: "Помилка",          color: "text-red-400",    dot: "bg-red-400" },
};

export default function IndexingTab() {
    const [pages, setPages] = useState<Page[]>([]);
    const [loading, setLoading] = useState(true);
    const [checkingAll, setCheckingAll] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [submitting, setSubmitting] = useState<Record<string, boolean>>({});
    const [checking, setChecking] = useState<Record<string, boolean>>({});
    const [sort, setSort] = useState<SortKey>("created_at");
    const [filter, setFilter] = useState<IndexStatus | "all">("all");
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const fetchPages = useCallback(() => {
        setLoading(true);
        fetch(`${API_URL}/indexing/pages?sort=${sort}&order=desc`)
            .then((r) => r.json())
            .then((data) => setPages(data.pages ?? []))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [sort]);

    useEffect(() => { fetchPages(); }, [fetchPages]);

    const submitPage = async (path: string, url: string) => {
        setSubmitting((p) => ({ ...p, [path]: true }));
        try {
            const res = await fetch(`${API_URL}/indexing/submit`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url }),
            });
            if (!res.ok) throw new Error();

        } catch {

        } finally {
            setSubmitting((p) => ({ ...p, [path]: false }));
        }
    };

    const checkPage = async (path: string, url: string) => {
        setChecking((p) => ({ ...p, [path]: true }));
        try {
            const res = await fetch(`${API_URL}/indexing/status?url=${encodeURIComponent(url)}`);
            if (!res.ok) throw new Error();
            const data = await res.json();
            setPages((prev) =>
                prev.map((p) =>
                    p.path === path
                        ? { ...p, status: data.indexed ? "indexed" : "not_indexed", checked_at: new Date().toISOString(), coverage_state: data.coverageState }
                        : p
                )
            );
        } catch {
            setPages((prev) => prev.map((p) => p.path === path ? { ...p, status: "error" } : p));
        } finally {
            setChecking((p) => ({ ...p, [path]: false }));
        }
    };

    const syncSitemap = async () => {
        setSyncing(true);
        try {
            const res = await fetch(`${API_URL}/indexing/sync-sitemap`, { method: "POST" });
            const data = await res.json();
            await fetchPages();
            alert(`Синхронізовано: +${data.added ?? 0} нових, ${data.skipped ?? 0} вже є`);
        } catch (e) {
            console.error(e);
        } finally {
            setSyncing(false);
        }
    };

    const checkAll = async () => {
        setCheckingAll(true);
        try {
            await fetch(`${API_URL}/indexing/check-all`, { method: "POST" });
            // Чекаємо 30 секунд поки фоновий процес завершиться, потім оновлюємо
            setTimeout(async () => {
                await fetchPages();
                setCheckingAll(false);
            }, 30000);
        } catch (e) {
            console.error(e);
            setCheckingAll(false);
        }
    };

    const submitSelected = async () => {
        for (const path of Array.from(selected)) {
            const page = pages.find((p) => p.path === path);
            if (page) await submitPage(page.path, page.url);
        }
        setSelected(new Set());
    };

    const toggleSelect = (path: string) => {
        setSelected((prev) => {
            const next = new Set(prev);
            if (next.has(path)) { next.delete(path); } else { next.add(path); }
            return next;
        });
    };

    const toggleSelectAll = () => {
        if (selected.size === filteredPages.length) {
            setSelected(new Set());
        } else {
            setSelected(new Set(filteredPages.map((p) => p.path)));
        }
    };

    const formatDate = (iso?: string | null) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleString("uk-UA", {
            day: "2-digit", month: "2-digit",
            hour: "2-digit", minute: "2-digit",
        });
    };

    const filteredPages = pages.filter(
        (p) => filter === "all" || p.status === filter
    );

    const counts = (["indexed", "pending", "not_indexed", "unknown", "error"] as IndexStatus[])
        .reduce((acc, s) => ({ ...acc, [s]: pages.filter((p) => p.status === s).length }), {} as Record<IndexStatus, number>);

    const sorts: { key: SortKey; label: string }[] = [
        { key: "created_at",   label: "Новіші" },
        { key: "submitted_at", label: "Відправлені" },
        { key: "path",         label: "URL" },
        { key: "status",       label: "Статус" },
    ];

    if (loading) return (
        <div className="flex items-center justify-center py-16 gap-3 text-orange-400">
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm">Завантаження...</span>
        </div>
    );

    return (
        <div className="space-y-4">

            {/* Статус картки */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {(["indexed", "pending", "not_indexed", "unknown", "error"] as IndexStatus[]).map((s) => {
                    const cfg = STATUS_CONFIG[s];
                    return (
                        <button key={s}
                                onClick={() => setFilter(filter === s ? "all" : s)}
                                className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center transition-all ${
                                    filter === s
                                        ? "border-orange-500/30 bg-orange-500/[0.08]"
                                        : "border-white/[0.07] bg-white/[0.02] hover:border-white/15"
                                }`}>
                            <p className={`font-black text-xl leading-none mb-1 ${cfg.color}`}
                               style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                {counts[s] ?? 0}
                            </p>
                            <p className="text-[10px] text-white/25">{cfg.label}</p>
                        </button>
                    );
                })}
            </div>

            {/* Тулбар */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1">
                    {sorts.map(({ key, label }) => (
                        <button key={key} onClick={() => setSort(key)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                    sort === key
                                        ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                        : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"
                                }`}>
                            {label}
                        </button>
                    ))}
                </div>

                <div className="ml-auto flex gap-2">
                    {selected.size > 0 && (
                        <button onClick={submitSelected}
                                className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:bg-orange-500/25 transition-all">
                            Індексувати вибрані ({selected.size})
                        </button>
                    )}
                    <button onClick={syncSitemap} disabled={syncing}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/40 hover:text-white/70 hover:border-white/20 transition-all disabled:opacity-40">
                        {syncing ? "Синхронізуємо..." : "↻ Sitemap"}
                    </button>
                    <button onClick={checkAll} disabled={checkingAll}
                            className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/40 hover:text-white/70 hover:border-white/20 transition-all disabled:opacity-40">
                        {checkingAll ? "Перевіряємо..." : "Перевірити всі"}
                    </button>
                </div>
            </div>

            {/* Таблиця */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                        <thead>
                        <tr className="border-b border-white/[0.05]">
                            <th className="px-4 py-3 w-10">
                                <input type="checkbox"
                                       checked={selected.size === filteredPages.length && filteredPages.length > 0}
                                       onChange={toggleSelectAll}
                                       className="accent-orange-500 w-3.5 h-3.5 cursor-pointer" />
                            </th>
                            {["Сторінка", "Статус", "Створено", "Відправлено", "Перевірено", "Дії"].map((h) => (
                                <th key={h} className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-3 py-3">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPages.map((page) => {
                            const cfg = STATUS_CONFIG[page.status];
                            const isSubmitting = submitting[page.path];
                            const isChecking = checking[page.path];

                            return (
                                <tr key={page.path} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3">
                                        <input type="checkbox"
                                               checked={selected.has(page.path)}
                                               onChange={() => toggleSelect(page.path)}
                                               className="accent-orange-500 w-3.5 h-3.5 cursor-pointer" />
                                    </td>
                                    <td className="px-3 py-3">
                                        <p className="text-sm text-white/70 font-medium">{page.title}</p>
                                        <p className="text-[11px] text-white/25 font-mono mt-0.5">{page.path}</p>
                                    </td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${cfg.dot} ${page.status === "pending" ? "animate-pulse" : ""}`} />
                                            <span className={`text-xs font-semibold ${cfg.color}`}>{cfg.label}</span>
                                        </div>
                                        {page.coverage_state && (
                                            <p className="text-[10px] text-white/20 mt-0.5">{page.coverage_state}</p>
                                        )}
                                    </td>
                                    <td className="px-3 py-3 text-xs text-white/30">{formatDate(page.created_at)}</td>
                                    <td className="px-3 py-3 text-xs text-white/30">{formatDate(page.submitted_at)}</td>
                                    <td className="px-3 py-3 text-xs text-white/30">{formatDate(page.checked_at)}</td>
                                    <td className="px-3 py-3">
                                        <div className="flex items-center gap-2">
                                            <button onClick={() => submitPage(page.path, page.url)}
                                                    disabled={isSubmitting || page.status === "pending" || page.status === "indexed"}
                                                    title={page.status === "pending" ? "Вже відправлено" : page.status === "indexed" ? "Вже проіндексовано" : ""}
                                                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all disabled:opacity-40 whitespace-nowrap">
                                                {isSubmitting ? "..." : page.status === "pending" ? "Очікує" : page.status === "indexed" ? "✓ Готово" : "Індексувати"}
                                            </button>
                                            <button onClick={() => checkPage(page.path, page.url)}
                                                    disabled={isChecking}
                                                    className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-white/[0.07] text-white/30 hover:text-white/60 transition-all disabled:opacity-40 whitespace-nowrap">
                                                {isChecking ? "..." : "Перевірити"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}