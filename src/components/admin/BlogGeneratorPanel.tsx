"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface PlanItem {
    topic: string;
    status: "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason: string;
}

type GenStep = "idle" | "fetching" | "searching" | "generating" | "saving" | "notifying" | "done" | "error";

interface GenState {
    running: boolean;
    step: GenStep;
    progress: number;
    message: string;
    error?: string;
    result?: {
        slug: string;
        topic: string;
        reason: string;
        tokens: { input: number; output: number };
    };
}

const STEPS: { key: GenStep; label: string }[] = [
    { key: "fetching",   label: "Завантаження даних" },
    { key: "searching",  label: "Пошук актуальних даних" },
    { key: "generating", label: "Генерація AI" },
    { key: "saving",     label: "Збереження статті" },
    { key: "notifying",  label: "Telegram сповіщення" },
];

const STATUS_LABELS: Record<PlanItem["status"], string> = {
    planned:   "заплановано",
    published: "опубліковано",
    skip:      "пропустити",
};
const STATUS_COLORS: Record<PlanItem["status"], string> = {
    planned:   "text-blue-400/80 bg-blue-400/8 border-blue-400/15",
    published: "text-green-400/80 bg-green-400/8 border-green-400/15",
    skip:      "text-white/20 bg-white/[0.03] border-white/[0.06]",
};
const PRIORITY_COLORS: Record<PlanItem["priority"], string> = {
    high:   "text-orange-400/80 bg-orange-400/8 border-orange-500/15",
    medium: "text-yellow-400/60 bg-yellow-400/6 border-yellow-500/10",
    low:    "text-white/25 bg-white/[0.02] border-white/[0.05]",
};

// ── Icons ─────────────────────────────────────────────────────────────────

function Spinner({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin shrink-0">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function IconCheck({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function IconCircle({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="shrink-0">
            <circle cx="12" cy="12" r="9" />
        </svg>
    );
}

function IconPlus({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="shrink-0">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
        </svg>
    );
}

function IconTrash({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        </svg>
    );
}

function IconEdit({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M12 20h9" />
            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
        </svg>
    );
}

function IconSave({ size = 14 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
            <polyline points="17 21 17 13 7 13 7 21" />
            <polyline points="7 3 7 8 15 8" />
        </svg>
    );
}

function IconChevron({ open }: { open: boolean }) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

// ── Sub-components ────────────────────────────────────────────────────────

function Badge({ className, children }: { className: string; children: React.ReactNode }) {
    return (
        <span className={`text-[9px] font-bold tracking-wider uppercase px-1.5 py-0.5 rounded border shrink-0 ${className}`}>
            {children}
        </span>
    );
}

function StepRow({ stepKey, current, done }: { stepKey: GenStep; current: GenStep; done: boolean }) {
    const label = STEPS.find((s) => s.key === stepKey)?.label ?? stepKey;
    const isActive = current === stepKey;

    return (
        <div className={`flex items-center gap-2 transition-opacity ${done || isActive ? "opacity-100" : "opacity-25"}`}>
            <span className={`${done ? "text-green-400" : isActive ? "text-orange-400" : "text-white/20"}`}>
                {done ? <IconCheck size={12} /> : isActive ? <Spinner size={12} /> : <IconCircle size={12} />}
            </span>
            <span className={`text-[11px] ${done ? "text-white/50 line-through" : isActive ? "text-white/80 font-semibold" : "text-white/25"}`}>
                {label}
            </span>
        </div>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function BlogGeneratorPanel() {
    const [gen, setGen] = useState<GenState>({ running: false, step: "idle", progress: 0, message: "" });
    const [selectedTopic, setSelectedTopic] = useState<string>("");

    const [plan, setPlan] = useState<PlanItem[]>([]);
    const [planLoading, setPlanLoading] = useState(true);
    const [planSaving, setPlanSaving] = useState(false);
    const [planSaved, setPlanSaved] = useState(false);
    const [planOpen, setPlanOpen] = useState(false);

    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<PlanItem | null>(null);
    const [newItem, setNewItem] = useState<PlanItem | null>(null);

    const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

    const fetchPlan = useCallback(async () => {
        setPlanLoading(true);
        try {
            const res = await fetch("/api/admin/content-plan");
            const data = await res.json();
            setPlan(data.items ?? []);
        } catch {
            setPlan([]);
        } finally {
            setPlanLoading(false);
        }
    }, []);

    useEffect(() => { fetchPlan(); }, [fetchPlan]);

    const handleGenerate = async () => {
        setGen({ running: true, step: "fetching", progress: 0, message: "Старт..." });

        try {
            const res = await fetch("/api/admin/generate-blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: selectedTopic || undefined }),
            });

            if (!res.ok || !res.body) {
                throw new Error(`HTTP ${res.status}`);
            }

            const reader = res.body.getReader();
            readerRef.current = reader;
            const dec = new TextDecoder();
            let buf = "";

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                buf += dec.decode(value, { stream: true });
                const lines = buf.split("\n");
                buf = lines.pop() ?? "";

                for (const line of lines) {
                    if (!line.startsWith("data: ")) continue;
                    const evt = JSON.parse(line.slice(6));

                    if (evt.type === "progress") {
                        setGen((g) => ({ ...g, step: evt.step, progress: evt.progress, message: evt.message }));
                    } else if (evt.type === "done") {
                        setGen({
                            running: false,
                            step: "done",
                            progress: 100,
                            message: "Готово!",
                            result: {
                                slug:   evt.slug,
                                topic:  evt.topic,
                                reason: evt.reason,
                                tokens: evt.tokens,
                            },
                        });
                        await fetchPlan();
                    } else if (evt.type === "error") {
                        throw new Error(evt.message);
                    }
                }
            }
        } catch (e) {
            setGen((g) => ({
                ...g,
                running: false,
                step: "error",
                progress: 0,
                error: e instanceof Error ? e.message : String(e),
            }));
        }
    };

    const savePlan = async (items: PlanItem[]) => {
        setPlanSaving(true);
        try {
            await fetch("/api/admin/content-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });
            setPlan(items);
            setPlanSaved(true);
            setTimeout(() => setPlanSaved(false), 3000);
        } finally {
            setPlanSaving(false);
        }
    };

    const startEdit = (idx: number) => {
        setEditingIdx(idx);
        setEditDraft({ ...plan[idx] });
        setNewItem(null);
    };

    const cancelEdit = () => { setEditingIdx(null); setEditDraft(null); };

    const commitEdit = () => {
        if (editingIdx === null || !editDraft) return;
        const updated = plan.map((it, i) => (i === editingIdx ? editDraft : it));
        savePlan(updated);
        setEditingIdx(null);
        setEditDraft(null);
    };

    const deleteItem = (idx: number) => {
        savePlan(plan.filter((_, i) => i !== idx));
        if (editingIdx === idx) cancelEdit();
    };

    const commitNew = () => {
        if (!newItem || !newItem.topic.trim()) return;
        savePlan([newItem, ...plan]);
        setNewItem(null);
    };

    const plannedTopics = plan.filter((i) => i.status === "planned");
    const stepOrder: GenStep[] = ["fetching", "searching", "generating", "saving", "notifying"];
    const currentStepIdx = stepOrder.indexOf(gen.step);

    return (
        <div className="space-y-4">

            {/* ── Генератор ─────────────────────────────────────────── */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="px-5 py-3.5 border-b border-white/[0.05]">
                    <p className="text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase">Генерація статті</p>
                </div>
                <div className="px-5 py-4 space-y-4">

                    {/* Вибір теми */}
                    <div className="space-y-1.5">
                        <p className="text-[10px] text-white/30 font-semibold tracking-wide uppercase">Тема</p>
                        <select
                            value={selectedTopic}
                            onChange={(e) => setSelectedTopic(e.target.value)}
                            disabled={gen.running}
                            className="w-full text-xs text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500/40 disabled:opacity-40 disabled:cursor-not-allowed appearance-none"
                        >
                            <option value="">Автоматично (AI обирає)</option>
                            {planLoading && <option disabled>Завантаження...</option>}
                            {plannedTopics.length > 0 && (
                                <optgroup label="Заплановані теми">
                                    {plannedTopics.map((it, i) => (
                                        <option key={i} value={it.topic}>{it.topic}</option>
                                    ))}
                                </optgroup>
                            )}
                        </select>
                        {selectedTopic && (
                            <p className="text-[10px] text-orange-400/60">
                                AI напише саме про цю тему
                            </p>
                        )}
                    </div>

                    {/* Кнопка */}
                    <button
                        onClick={handleGenerate}
                        disabled={gen.running}
                        className="w-full flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-lg border transition-all disabled:opacity-40 disabled:cursor-not-allowed border-orange-500/30 text-orange-400/80 hover:bg-orange-500/10 hover:text-orange-400 hover:border-orange-500/50 active:scale-[0.98]"
                    >
                        {gen.running ? <Spinner size={15} /> : null}
                        {gen.running ? gen.message : "Згенерувати статтю"}
                    </button>

                    {/* Прогрес */}
                    {gen.running && (
                        <div className="space-y-3 pt-1">
                            {/* Progress bar */}
                            <div className="h-1 rounded-full bg-white/[0.06] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-orange-500/60 transition-all duration-700 ease-out"
                                    style={{ width: `${gen.progress}%` }}
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-[10px] text-white/30">{gen.message}</p>
                                <p className="text-[10px] text-white/20 font-mono">{gen.progress}%</p>
                            </div>

                            {/* Кроки */}
                            <div className="space-y-1.5 pt-1 border-t border-white/[0.04]">
                                {stepOrder.map((key, idx) => (
                                    <StepRow
                                        key={key}
                                        stepKey={key}
                                        current={gen.step}
                                        done={idx < currentStepIdx}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Результат */}
                    {gen.step === "done" && gen.result && (
                        <div className="rounded-lg border border-green-500/15 bg-green-500/[0.04] px-4 py-3 space-y-3">
                            <p className="text-[10px] font-bold tracking-[0.12em] text-green-400/60 uppercase">Статтю створено</p>

                            <div className="space-y-1.5">
                                <p className="text-xs text-white/70 font-medium">{gen.result.topic}</p>
                                <p className="text-[11px] text-white/40 leading-relaxed">{gen.result.reason}</p>
                                <p className="text-[11px] font-mono text-white/30">/{gen.result.slug}</p>
                            </div>

                            {/* Токени */}
                            <div className="flex gap-3 pt-1 border-t border-white/[0.06]">
                                <div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-wider">Вхідні токени</p>
                                    <p className="text-xs font-mono text-white/50">{gen.result.tokens.input.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-wider">Вихідні токени</p>
                                    <p className="text-xs font-mono text-white/50">{gen.result.tokens.output.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-[9px] text-white/20 uppercase tracking-wider">Всього</p>
                                    <p className="text-xs font-mono text-orange-400/60">
                                        {(gen.result.tokens.input + gen.result.tokens.output).toLocaleString()}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Помилка */}
                    {gen.step === "error" && gen.error && (
                        <div className="rounded-lg border border-red-500/15 bg-red-500/[0.04] px-4 py-3">
                            <p className="text-[10px] font-bold tracking-[0.12em] text-red-400/60 uppercase mb-1">Помилка</p>
                            <p className="text-[11px] text-red-400/70 font-mono break-all">{gen.error}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ── Контент-план ──────────────────────────────────────── */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <button
                    onClick={() => setPlanOpen((v) => !v)}
                    className="w-full flex items-center justify-between px-5 py-3.5 border-b border-white/[0.05] hover:bg-white/[0.015] transition-colors"
                >
                    <div className="flex items-center gap-2">
                        <p className="text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase">Контент-план</p>
                        {!planLoading && (
                            <span className="text-[9px] text-white/20 font-mono">
                                {plan.filter((i) => i.status === "planned").length} заплановано · {plan.length} всього
                            </span>
                        )}
                    </div>
                    <span className="text-white/20"><IconChevron open={planOpen} /></span>
                </button>

                {planOpen && (
                    <div className="px-5 py-4 space-y-3">
                        {/* Додати нову тему */}
                        {newItem ? (
                            <div className="rounded-lg border border-orange-500/20 bg-orange-500/[0.03] p-3 space-y-2">
                                <p className="text-[10px] font-bold tracking-wider text-orange-400/50 uppercase">Нова тема</p>
                                <input
                                    autoFocus
                                    value={newItem.topic}
                                    onChange={(e) => setNewItem({ ...newItem, topic: e.target.value })}
                                    placeholder="Назва теми..."
                                    className="w-full text-xs text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-orange-500/30 placeholder:text-white/20"
                                />
                                <input
                                    value={newItem.reason}
                                    onChange={(e) => setNewItem({ ...newItem, reason: e.target.value })}
                                    placeholder="Причина / SEO обґрунтування..."
                                    className="w-full text-xs text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-orange-500/30 placeholder:text-white/20"
                                />
                                <div className="flex gap-2">
                                    <select
                                        value={newItem.priority}
                                        onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as PlanItem["priority"] })}
                                        className="text-[11px] text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1 focus:outline-none"
                                    >
                                        <option value="high">Висока</option>
                                        <option value="medium">Середня</option>
                                        <option value="low">Низька</option>
                                    </select>
                                    <select
                                        value={newItem.status}
                                        onChange={(e) => setNewItem({ ...newItem, status: e.target.value as PlanItem["status"] })}
                                        className="text-[11px] text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1 focus:outline-none"
                                    >
                                        <option value="planned">Заплановано</option>
                                        <option value="published">Опубліковано</option>
                                        <option value="skip">Пропустити</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={commitNew}
                                        disabled={!newItem.topic.trim() || planSaving}
                                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-green-500/25 text-green-400/70 hover:bg-green-500/8 hover:text-green-400 disabled:opacity-40 transition-all"
                                    >
                                        <IconSave size={12} /> Зберегти
                                    </button>
                                    <button
                                        onClick={() => setNewItem(null)}
                                        className="text-[11px] text-white/30 hover:text-white/60 px-2 transition-colors"
                                    >
                                        Скасувати
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setNewItem({ topic: "", status: "planned", priority: "medium", reason: "" })}
                                className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-white/[0.08] text-white/30 hover:bg-white/[0.04] hover:text-white/60 hover:border-white/[0.15] transition-all w-full justify-center"
                            >
                                <IconPlus size={12} /> Додати тему
                            </button>
                        )}

                        {/* Список тем */}
                        {planLoading ? (
                            <div className="space-y-2">
                                {[70, 85, 60, 75, 55].map((w, i) => (
                                    <div key={i} className="h-8 rounded bg-white/[0.03] animate-pulse" style={{ width: `${w}%` }} />
                                ))}
                            </div>
                        ) : plan.length === 0 ? (
                            <p className="text-center text-white/20 text-xs py-6">Контент-план порожній</p>
                        ) : (
                            <div className="space-y-1">
                                {plan.map((item, idx) => (
                                    <div key={idx} className="rounded-lg border border-white/[0.04] overflow-hidden">
                                        {editingIdx === idx && editDraft ? (
                                            /* ── Inline edit form ── */
                                            <div className="p-3 space-y-2 bg-white/[0.02]">
                                                <input
                                                    autoFocus
                                                    value={editDraft.topic}
                                                    onChange={(e) => setEditDraft({ ...editDraft, topic: e.target.value })}
                                                    className="w-full text-xs text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-orange-500/30"
                                                />
                                                <input
                                                    value={editDraft.reason}
                                                    onChange={(e) => setEditDraft({ ...editDraft, reason: e.target.value })}
                                                    placeholder="Причина..."
                                                    className="w-full text-xs text-white/50 bg-white/[0.04] border border-white/[0.08] rounded-md px-2.5 py-1.5 focus:outline-none focus:border-orange-500/30 placeholder:text-white/20"
                                                />
                                                <div className="flex gap-2">
                                                    <select
                                                        value={editDraft.priority}
                                                        onChange={(e) => setEditDraft({ ...editDraft, priority: e.target.value as PlanItem["priority"] })}
                                                        className="text-[11px] text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1 focus:outline-none"
                                                    >
                                                        <option value="high">Висока</option>
                                                        <option value="medium">Середня</option>
                                                        <option value="low">Низька</option>
                                                    </select>
                                                    <select
                                                        value={editDraft.status}
                                                        onChange={(e) => setEditDraft({ ...editDraft, status: e.target.value as PlanItem["status"] })}
                                                        className="text-[11px] text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-md px-2 py-1 focus:outline-none"
                                                    >
                                                        <option value="planned">Заплановано</option>
                                                        <option value="published">Опубліковано</option>
                                                        <option value="skip">Пропустити</option>
                                                    </select>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={commitEdit}
                                                        disabled={planSaving}
                                                        className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-green-500/25 text-green-400/70 hover:bg-green-500/8 hover:text-green-400 disabled:opacity-40 transition-all"
                                                    >
                                                        {planSaving ? <Spinner size={12} /> : <IconSave size={12} />}
                                                        Зберегти
                                                    </button>
                                                    <button onClick={cancelEdit} className="text-[11px] text-white/30 hover:text-white/60 px-2 transition-colors">
                                                        Скасувати
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            /* ── Display row ── */
                                            <div className="flex items-center gap-2 px-3 py-2 hover:bg-white/[0.015] transition-colors group">
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-center gap-1.5 flex-wrap">
                                                        <Badge className={STATUS_COLORS[item.status]}>
                                                            {STATUS_LABELS[item.status]}
                                                        </Badge>
                                                        <Badge className={PRIORITY_COLORS[item.priority]}>
                                                            {item.priority}
                                                        </Badge>
                                                    </div>
                                                    <p className="text-xs text-white/60 mt-1 truncate">{item.topic}</p>
                                                    {item.reason && (
                                                        <p className="text-[10px] text-white/25 mt-0.5 truncate">{item.reason}</p>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                    <button
                                                        onClick={() => startEdit(idx)}
                                                        className="p-1.5 text-white/30 hover:text-white/70 transition-colors rounded"
                                                    >
                                                        <IconEdit size={12} />
                                                    </button>
                                                    <button
                                                        onClick={() => deleteItem(idx)}
                                                        className="p-1.5 text-white/20 hover:text-red-400/70 transition-colors rounded"
                                                    >
                                                        <IconTrash size={12} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}

                        {planSaved && (
                            <p className="text-[10px] text-green-400/60 font-semibold text-center">Збережено</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
