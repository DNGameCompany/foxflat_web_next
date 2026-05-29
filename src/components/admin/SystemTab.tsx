"use client";

import { useEffect, useState, useCallback } from "react";

const API_URL = "https://api.foxflat.com.ua";

type Section = "bot" | "site" | "content";

interface BotStatus {
    online: boolean;
    uptime?: string;
    last_ping?: string;
}

interface LogEntry {
    id: string;
    level: "info" | "warning" | "error";
    message: string;
    timestamp: string;
}

interface SiteInfo {
    version?: string;
    deployed_at?: string;
    git_commit?: string;
    git_branch?: string;
}

interface ActionState {
    loading: boolean;
    success: boolean | null;
    message: string;
}

interface CronResult {
    ok: boolean;
    slug?: string;
    topic?: string;
}



const EMPTY_ACTION: ActionState = { loading: false, success: null, message: "" };

// ── Icons ──────────────────────────────────────────────────────────────────

function IconRefresh({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
        </svg>
    );
}

function IconRestart({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
        </svg>
    );
}

function IconMap({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/>
            <line x1="9" y1="3" x2="9" y2="18"/><line x1="15" y1="6" x2="15" y2="21"/>
        </svg>
    );
}

function IconTrash({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
            <path d="M10 11v6"/><path d="M14 11v6"/>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
        </svg>
    );
}

function IconSpinner({ className }: { className?: string }) {
    return (
        <svg className={`animate-spin ${className}`} width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2"/>
            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
    );
}

function IconPen({ className }: { className?: string }) {
    return (
        <svg className={className} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
    );
}

// ── Status dot ──────────────────────────────────────────────────────────────

function StatusDot({ online }: { online: boolean }) {
    return (
        <div className="flex items-center gap-2">
            <span className="relative flex w-2 h-2">
                <span className={`w-2 h-2 rounded-full ${online ? "bg-green-400" : "bg-red-400"}`} />
                {online && <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-50" />}
            </span>
            <span className={`text-sm font-semibold ${online ? "text-green-400" : "text-red-400"}`}>
                {online ? "Online" : "Offline"}
            </span>
        </div>
    );
}

// ── Log level badge ─────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: LogEntry["level"] }) {
    const s = {
        info:    "text-blue-400/80 bg-blue-400/8 border-blue-400/15",
        warning: "text-yellow-400/80 bg-yellow-400/8 border-yellow-400/15",
        error:   "text-red-400/80 bg-red-400/8 border-red-400/15",
    }[level];
    return (
        <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border ${s} shrink-0`}>
            {level}
        </span>
    );
}

// ── Action button ───────────────────────────────────────────────────────────

function ActionRow({ label, description, icon, onClick, state, danger }: {
    label: string;
    description?: string;
    icon: React.ReactNode;
    onClick: () => void;
    state: ActionState;
    danger?: boolean;
}) {
    return (
        <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
            <div>
                <p className="text-sm text-white/70 font-medium">{label}</p>
                {description && <p className="text-[11px] text-white/25 mt-0.5">{description}</p>}
            </div>
            <div className="flex items-center gap-3 shrink-0">
                {state.message && (
                    <span className={`text-[10px] font-semibold ${state.success ? "text-green-400" : "text-red-400"}`}>
                        {state.success ? "Виконано" : state.message}
                    </span>
                )}
                <button
                    onClick={onClick}
                    disabled={state.loading}
                    className={`flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                        danger
                            ? "border-red-500/20 text-red-400/70 hover:bg-red-500/8 hover:text-red-400 hover:border-red-500/35"
                            : "border-white/[0.08] text-white/40 hover:bg-white/[0.04] hover:text-white/70 hover:border-white/[0.15]"
                    }`}
                >
                    {state.loading ? <IconSpinner /> : icon}
                    {state.loading ? "Виконується" : label}
                </button>
            </div>
        </div>
    );
}

// ── Card ────────────────────────────────────────────────────────────────────

function Card({ title, children, onRefresh }: {
    title: string;
    children: React.ReactNode;
    onRefresh?: () => void;
}) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase">{title}</p>
                {onRefresh && (
                    <button onClick={onRefresh} className="text-white/20 hover:text-white/50 transition-colors">
                        <IconRefresh />
                    </button>
                )}
            </div>
            <div className="px-5 py-4">{children}</div>
        </div>
    );
}

// ── Main ────────────────────────────────────────────────────────────────────

export default function SystemTab() {
    const [section, setSection] = useState<Section>("bot");

    const [botStatus, setBotStatus] = useState<BotStatus | null>(null);
    const [botLoading, setBotLoading] = useState(true);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [logsLoading, setLogsLoading] = useState(true);
    const [restartAction, setRestartAction] = useState<ActionState>(EMPTY_ACTION);

    const [siteInfo, setSiteInfo] = useState<SiteInfo | null>(null);
    const [siteLoading, setSiteLoading] = useState(true);
    const [sitemapAction, setSitemapAction] = useState<ActionState>(EMPTY_ACTION);
    const [cacheAction, setCacheAction] = useState<ActionState>(EMPTY_ACTION);

    // ── Content cron state ──
    const [cronAction, setCronAction] = useState<ActionState>(EMPTY_ACTION);
    const [cronResult, setCronResult] = useState<CronResult | null>(null);

    const fetchBotStatus = useCallback(async () => {
        setBotLoading(true);
        try {
            const r = await fetch(`${API_URL}/system/bot/status`);
            setBotStatus(await r.json());
        } catch { setBotStatus({ online: false }); }
        finally { setBotLoading(false); }
    }, []);

    const fetchLogs = useCallback(async () => {
        setLogsLoading(true);
        try {
            const r = await fetch(`${API_URL}/system/bot/logs?limit=30`);
            setLogs(await r.json());
        } catch { setLogs([]); }
        finally { setLogsLoading(false); }
    }, []);

    const fetchSiteInfo = useCallback(async () => {
        setSiteLoading(true);
        try {
            const r = await fetch(`${API_URL}/system/site/info`);
            setSiteInfo(await r.json());
        } catch { setSiteInfo({}); }
        finally { setSiteLoading(false); }
    }, []);

    useEffect(() => {
        fetchBotStatus();
        fetchLogs();
        fetchSiteInfo();
        const t = setInterval(fetchBotStatus, 30000);
        return () => clearInterval(t);
    }, [fetchBotStatus, fetchLogs, fetchSiteInfo]);

    const runAction = async (url: string, setter: (s: ActionState) => void, successMsg: string, cb?: () => void) => {
        setter({ loading: true, success: null, message: "" });
        try {
            const r = await fetch(`${API_URL}${url}`, { method: "POST" });
            if (!r.ok) throw new Error(await r.text());
            setter({ loading: false, success: true, message: successMsg });
            cb?.();
            setTimeout(() => setter(EMPTY_ACTION), 4000);
        } catch (e) {
            setter({ loading: false, success: false, message: e instanceof Error ? e.message : "Помилка" });
            setTimeout(() => setter(EMPTY_ACTION), 5000);
        }
    };

    // ── Cron runner (GET + Bearer, relative URL) ──
    const runCron = async () => {
        setCronAction({ loading: true, success: null, message: "" });
        setCronResult(null);
        try {
            const r = await fetch("/api/admin/run-cron", { method: "POST" });
            if (!r.ok) throw new Error(`${r.status} ${await r.text()}`);
            const data: CronResult = await r.json();
            setCronResult(data);
            setCronAction({ loading: false, success: true, message: "Статтю створено" });
            setTimeout(() => setCronAction(EMPTY_ACTION), 6000);
        } catch (e) {
            setCronAction({
                loading: false,
                success: false,
                message: e instanceof Error ? e.message : "Помилка",
            });
            setTimeout(() => setCronAction(EMPTY_ACTION), 6000);
        }
    };

    const fmt = (iso?: string | null) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
    };

    const Skeleton = ({ w }: { w: string }) => (
        <div className="h-4 bg-white/[0.04] rounded animate-pulse" style={{ width: w }} />
    );

    return (
        <div className="space-y-4">

            {/* Таби */}
            <div className="flex gap-1">
                {([["bot", "Бот"], ["site", "Сайт"], ["content", "Контент"]] as const).map(([key, label]) => (
                    <button key={key} onClick={() => setSection(key)}
                            className={`text-[11px] font-bold px-4 py-1.5 rounded-lg border transition-all ${
                                section === key
                                    ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                    : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/60"
                            }`}>
                        {label}
                    </button>
                ))}
            </div>

            {/* ── БОТ ── */}
            {section === "bot" && (
                <div className="space-y-4">
                    <Card title="Статус" onRefresh={fetchBotStatus}>
                        {botLoading ? (
                            <div className="space-y-2"><Skeleton w="120px" /><Skeleton w="180px" /></div>
                        ) : (
                            <div className="space-y-3">
                                <StatusDot online={botStatus?.online ?? false} />
                                <div className="flex gap-6">
                                    {botStatus?.uptime && (
                                        <div>
                                            <p className="text-[10px] text-white/25 mb-0.5">Uptime</p>
                                            <p className="text-xs text-white/60 font-mono">{botStatus.uptime}</p>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-[10px] text-white/25 mb-0.5">Останній пінг</p>
                                        <p className="text-xs text-white/60 font-mono">{fmt(botStatus?.last_ping)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card title="Керування">
                        <ActionRow
                            label="Перезапустити бота"
                            description="Зупиняє і запускає процес бота"
                            icon={<IconRestart />}
                            state={restartAction}
                            danger
                            onClick={() => runAction("/system/bot/restart", setRestartAction, "Перезапущено", fetchBotStatus)}
                        />
                    </Card>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                        <div className="flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05]">
                            <p className="text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase">Останні події</p>
                            <button onClick={fetchLogs} className="text-white/20 hover:text-white/50 transition-colors">
                                <IconRefresh />
                            </button>
                        </div>
                        {logsLoading ? (
                            <div className="p-5 space-y-2.5">
                                {[80, 60, 90, 70, 55].map((w, i) => <Skeleton key={i} w={`${w}%`} />)}
                            </div>
                        ) : logs.length === 0 ? (
                            <p className="text-center text-white/20 text-xs py-10">Логів немає</p>
                        ) : (
                            <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
                                {logs.map((log) => (
                                    <div key={log.id} className="flex items-start gap-3 px-5 py-2.5 hover:bg-white/[0.015] transition-colors">
                                        <LevelBadge level={log.level} />
                                        <p className="text-[11px] text-white/50 flex-1 leading-relaxed">{log.message}</p>
                                        <span className="text-[10px] text-white/20 shrink-0 font-mono">{fmt(log.timestamp)}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* ── САЙТ ── */}
            {section === "site" && (
                <div className="space-y-4">
                    <Card title="Поточний деплой" onRefresh={fetchSiteInfo}>
                        {siteLoading ? (
                            <div className="space-y-2">
                                {[140, 200, 120, 100].map((w, i) => <Skeleton key={i} w={`${w}px`} />)}
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                {[
                                    { label: "Версія",      value: siteInfo?.version },
                                    { label: "Гілка",       value: siteInfo?.git_branch },
                                    { label: "Git commit",  value: siteInfo?.git_commit },
                                    { label: "Задеплоєно",  value: fmt(siteInfo?.deployed_at) },
                                ].map(({ label, value }) => (
                                    <div key={label}>
                                        <p className="text-[10px] text-white/25 mb-0.5">{label}</p>
                                        <p className="text-xs text-white/60 font-mono">{value || "—"}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card>

                    <Card title="Керування">
                        <ActionRow
                            label="Перебудувати Sitemap"
                            description="Генерує новий sitemap.xml і відправляє в Google Indexing API"
                            icon={<IconMap />}
                            state={sitemapAction}
                            onClick={() => runAction("/system/site/rebuild-sitemap", setSitemapAction, "Sitemap оновлено")}
                        />
                        <ActionRow
                            label="Очистити кеш"
                            description="Інвалідує ISR кеш — сторінки перерендеряться при наступному запиті"
                            icon={<IconTrash />}
                            state={cacheAction}
                            onClick={() => runAction("/system/site/clear-cache", setCacheAction, "Кеш очищено")}
                        />
                    </Card>
                </div>
            )}

            {/* ── КОНТЕНТ ── */}
            {section === "content" && (
                <div className="space-y-4">
                    <Card title="Генерація статті">
                        <div className="space-y-4">
                            <p className="text-[11px] text-white/30 leading-relaxed">
                                Запускає AI-крон вручну: аналізує контент-план, обирає тему, генерує статтю і зберігає її як чернетку. Після завершення надходить Telegram-сповіщення.
                            </p>

                            <div className="flex items-center justify-between py-3 border-t border-white/[0.04]">
                                <div>
                                    <p className="text-sm text-white/70 font-medium">Згенерувати нову статтю</p>
                                    <p className="text-[11px] text-white/25 mt-0.5">
                                        Займає 20–60 секунд — очікуйте до завершення
                                    </p>
                                </div>
                                <div className="flex items-center gap-3 shrink-0">
                                    {cronAction.message && (
                                        <span className={`text-[10px] font-semibold ${cronAction.success ? "text-green-400" : "text-red-400"}`}>
                                            {cronAction.success ? "Виконано" : cronAction.message}
                                        </span>
                                    )}
                                    <button
                                        onClick={runCron}
                                        disabled={cronAction.loading}
                                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-orange-500/25 text-orange-400/70 hover:bg-orange-500/8 hover:text-orange-400 hover:border-orange-500/50"
                                    >
                                        {cronAction.loading ? <IconSpinner /> : <IconPen />}
                                        {cronAction.loading ? "Генерується" : "Запустити"}
                                    </button>
                                </div>
                            </div>

                            {/* Результат після успішного запуску */}
                            {cronAction.success && cronResult && (
                                <div className="rounded-lg border border-green-500/15 bg-green-500/[0.04] px-4 py-3 space-y-1.5">
                                    <p className="text-[10px] font-bold tracking-[0.12em] text-green-400/60 uppercase">Результат</p>
                                    {cronResult.topic && (
                                        <p className="text-xs text-white/60">
                                            <span className="text-white/25">Тема: </span>{cronResult.topic}
                                        </p>
                                    )}
                                    {cronResult.slug && (
                                        <p className="text-xs font-mono text-white/40">/{cronResult.slug}</p>
                                    )}
                                </div>
                            )}
                        </div>
                    </Card>

                    <Card title="Інформація">
                        <div className="space-y-2.5">
                            {[
                                { label: "Маршрут",   value: "POST /api/admin/run-cron" },
                                { label: "Проксі до",  value: "GET /api/cron/generate" },
                                { label: "Розклад",     value: "Автоматично — раз на день" },
                            ].map(({ label, value }) => (
                                <div key={label} className="flex justify-between items-center">
                                    <p className="text-[11px] text-white/25">{label}</p>
                                    <p className="text-[11px] text-white/50 font-mono">{value}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}