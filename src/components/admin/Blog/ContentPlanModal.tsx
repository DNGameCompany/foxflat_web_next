"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface PlanItem {
    topic: string;
    status: "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason: string;
}

type Step = "idle" | "fetching" | "analyzing" | "done" | "error";

interface GenState {
    running: boolean;
    step: Step;
    progress: number;
    message: string;
    error?: string;
    tokens?: { input: number; output: number };
    analysis?: string;
    previousCount?: number;
}

const PRIORITY = {
    high:   { label: "Висока",  cls: "text-orange-400/80 bg-orange-400/8 border-orange-500/20" },
    medium: { label: "Середня", cls: "text-yellow-400/70 bg-yellow-400/6 border-yellow-500/15" },
    low:    { label: "Низька",  cls: "text-white/30 bg-white/[0.03] border-white/[0.07]" },
};

// ── Icons ─────────────────────────────────────────────────────────────────

function Spinner({ size = 12 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className="animate-spin shrink-0">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.2" />
            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
    );
}

function Check({ size = 10 }: { size?: number }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function IconEdit() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
        </svg>
    );
}

function IconTrash() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
        </svg>
    );
}

function IconPlus() {
    return (
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
    );
}

// ── Main ──────────────────────────────────────────────────────────────────

export default function ContentPlanModal({
    isOpen,
    onClose,
}: {
    isOpen: boolean;
    onClose: () => void;
}) {
    const [gen, setGen] = useState<GenState>({ running: false, step: "idle", progress: 0, message: "" });
    const [items, setItems] = useState<PlanItem[]>([]);
    const [oldTopics, setOldTopics] = useState<Set<string>>(new Set());
    const [editingIdx, setEditingIdx] = useState<number | null>(null);
    const [editDraft, setEditDraft] = useState<PlanItem | null>(null);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);
    const [addingNew, setAddingNew] = useState(false);
    const [newItem, setNewItem] = useState<PlanItem>({ topic: "", status: "planned", priority: "medium", reason: "" });

    const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);

    useEffect(() => {
        if (isOpen) {
            setGen({ running: false, step: "idle", progress: 0, message: "" });
            setItems([]);
            setEditingIdx(null);
            setAddingNew(false);
            setSaved(false);
        }
    }, [isOpen]);

    const handleAnalyze = useCallback(async () => {
        setGen({ running: true, step: "fetching", progress: 5, message: "Завантаження статей..." });
        setItems([]);

        try {
            const res = await fetch("/api/admin/refresh-content-plan", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({}),
            });
            if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

            // snapshot old planned topics for diff
            const planRes = await fetch("/api/admin/content-plan");
            const planData = await planRes.json();
            setOldTopics(new Set((planData.items ?? []).filter((i: PlanItem) => i.status === "planned").map((i: PlanItem) => i.topic)));

            readerRef.current = res.body.getReader();
            const dec = new TextDecoder();
            let buf = "";

            while (true) {
                const { done, value } = await readerRef.current.read();
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
                            running: false, step: "done", progress: 100,
                            message: "Аналіз завершено",
                            analysis: evt.analysis,
                            tokens: evt.tokens,
                            previousCount: evt.previousCount,
                        });
                        setItems(evt.items ?? []);
                    } else if (evt.type === "error") {
                        throw new Error(evt.message);
                    }
                }
            }
        } catch (e) {
            setGen((g) => ({ ...g, running: false, step: "error", error: e instanceof Error ? e.message : String(e) }));
        }
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await fetch("/api/admin/refresh-content-plan", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items }),
            });
            setSaved(true);
            setTimeout(onClose, 1200);
        } finally {
            setSaving(false);
        }
    };

    const startEdit = (idx: number) => { setEditingIdx(idx); setEditDraft({ ...items[idx] }); };
    const cancelEdit = () => { setEditingIdx(null); setEditDraft(null); };
    const commitEdit = () => {
        if (editDraft === null || editingIdx === null) return;
        setItems((prev) => prev.map((it, i) => (i === editingIdx ? editDraft : it)));
        setEditingIdx(null); setEditDraft(null);
    };
    const deleteItem = (idx: number) => {
        setItems((prev) => prev.filter((_, i) => i !== idx));
        if (editingIdx === idx) cancelEdit();
    };
    const commitNew = () => {
        if (!newItem.topic.trim()) return;
        setItems((prev) => [{ ...newItem, status: "planned" }, ...prev]);
        setNewItem({ topic: "", status: "planned", priority: "medium", reason: "" });
        setAddingNew(false);
    };

    const [mounted, setMounted] = useState(false);
    useEffect(() => { setMounted(true); }, []);

    if (!isOpen || !mounted) return null;

    const GEN_STEPS: { key: Step; label: string }[] = [
        { key: "fetching",  label: "Завантаження статей і плану" },
        { key: "analyzing", label: "AI аналізує актуальність тем" },
    ];
    const stepOrder: Step[] = ["fetching", "analyzing"];
    const currentStepIdx = stepOrder.indexOf(gen.step);

    const newCount = items.filter((i) => !oldTopics.has(i.topic)).length;
    const keptCount = items.filter((i) => oldTopics.has(i.topic)).length;
    const removedCount = Math.max(0, (gen.previousCount ?? 0) - keptCount);

    return createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            <div className="absolute inset-0 bg-black/65 backdrop-blur-sm" onClick={!gen.running ? onClose : undefined} />

            <div className="relative w-full sm:max-w-2xl rounded-t-2xl sm:rounded-2xl border-t sm:border border-white/[0.09] bg-[#0a0a0a] shadow-2xl flex flex-col max-h-[90dvh]">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] rounded-t-2xl shrink-0">
                    <div className="flex items-center gap-2.5">
                        <span className="text-orange-400 text-base leading-none">✦</span>
                        <div>
                            <p className="text-sm font-bold text-white/85">AI Перегляд тем</p>
                            <p className="text-[10px] text-white/25 mt-0.5">аналіз актуальності та перегенерація контент-плану</p>
                        </div>
                    </div>
                    {!gen.running && (
                        <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all text-xl leading-none">
                            ×
                        </button>
                    )}
                </div>

                {/* Scrollable body */}
                <div className="overflow-y-auto flex-1 p-5 space-y-5">

                    {/* Idle */}
                    {gen.step === "idle" && (
                        <div className="space-y-5">
                            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-4 space-y-2">
                                <p className="text-xs font-semibold text-white/60">Що зробить AI:</p>
                                <ul className="space-y-1.5">
                                    {[
                                        "Перегляне всі опубліковані статті та теми в плані",
                                        "Оцінить актуальність кожної запланованої теми",
                                        "Видалить теми, що втратили relevance або вже охоплені",
                                        "Додасть нові теми для кращого SEO-покриття",
                                        "Оновить пріоритети відповідно до поточної ситуації",
                                    ].map((text, i) => (
                                        <li key={i} className="flex items-start gap-2 text-[11px] text-white/40">
                                            <span className="text-orange-400/50 shrink-0 mt-0.5">·</span>
                                            {text}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <button
                                onClick={handleAnalyze}
                                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/15"
                            >
                                <span className="text-base leading-none">✦</span>
                                Запустити AI аналіз
                            </button>
                        </div>
                    )}

                    {/* Progress */}
                    {gen.running && (
                        <div className="space-y-5">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <p className="text-xs text-white/50">{gen.message}</p>
                                    <p className="text-[11px] font-mono text-white/25">{gen.progress}%</p>
                                </div>
                                <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
                                    <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700 ease-out" style={{ width: `${gen.progress}%` }} />
                                </div>
                            </div>
                            <div className="space-y-2.5">
                                {GEN_STEPS.map(({ key, label }, idx) => {
                                    const isDone = idx < currentStepIdx;
                                    const isActive = key === gen.step;
                                    return (
                                        <div key={key} className={`flex items-center gap-3 transition-opacity ${isDone || isActive ? "opacity-100" : "opacity-20"}`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${isDone ? "bg-green-500/15 border border-green-500/20" : isActive ? "bg-orange-500/15 border border-orange-500/20" : "bg-white/[0.04] border border-white/[0.07]"}`}>
                                                {isDone ? <span className="text-green-400"><Check /></span> : isActive ? <span className="text-orange-400"><Spinner /></span> : <span className="w-1.5 h-1.5 rounded-full bg-white/15 block" />}
                                            </div>
                                            <span className={`text-xs ${isDone ? "text-white/35 line-through" : isActive ? "text-white/75 font-semibold" : "text-white/20"}`}>{label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Error */}
                    {gen.step === "error" && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                                <p className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider mb-1.5">Помилка</p>
                                <p className="text-xs text-red-400/60 font-mono break-all">{gen.error}</p>
                            </div>
                            <button onClick={() => setGen({ running: false, step: "idle", progress: 0, message: "" })}
                                className="w-full py-2 rounded-xl border border-white/[0.08] text-xs text-white/40 hover:text-white/60 transition-all">
                                Спробувати знову
                            </button>
                        </div>
                    )}

                    {/* Done — show result */}
                    {gen.step === "done" && (
                        <div className="space-y-4">

                            {/* Analysis summary */}
                            {gen.analysis && (
                                <div className="rounded-xl border border-orange-500/15 bg-orange-500/[0.04] px-4 py-3 space-y-1.5">
                                    <p className="text-[10px] font-bold text-orange-400/60 uppercase tracking-wider">Висновок AI</p>
                                    <p className="text-xs text-white/55 leading-relaxed">{gen.analysis}</p>
                                </div>
                            )}

                            {/* Diff stats */}
                            <div className="flex gap-3">
                                {[
                                    { label: "Нові теми",    value: newCount,     cls: "text-green-400" },
                                    { label: "Залишено",     value: keptCount,    cls: "text-white/50" },
                                    { label: "Видалено",     value: removedCount, cls: "text-red-400/60" },
                                    { label: "Всього токенів", value: gen.tokens ? gen.tokens.input + gen.tokens.output : 0, cls: "text-orange-400/60" },
                                ].map(({ label, value, cls }) => (
                                    <div key={label} className="flex-1 rounded-lg border border-white/[0.06] bg-white/[0.02] px-3 py-2.5 text-center">
                                        <p className={`text-base font-bold font-mono ${cls}`}>{value.toLocaleString()}</p>
                                        <p className="text-[9px] text-white/25 mt-0.5 uppercase tracking-wide">{label}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Add new item */}
                            {addingNew ? (
                                <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.03] p-3 space-y-2">
                                    <p className="text-[10px] font-bold text-orange-400/50 uppercase tracking-wider">Нова тема</p>
                                    <input autoFocus value={newItem.topic} onChange={(e) => setNewItem({ ...newItem, topic: e.target.value })}
                                        placeholder="Назва теми..."
                                        className="w-full text-xs text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500/30 placeholder:text-white/20" />
                                    <input value={newItem.reason} onChange={(e) => setNewItem({ ...newItem, reason: e.target.value })}
                                        placeholder="SEO обґрунтування..."
                                        className="w-full text-xs text-white/50 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-2 focus:outline-none focus:border-orange-500/30 placeholder:text-white/20" />
                                    <div className="flex gap-2">
                                        <select value={newItem.priority} onChange={(e) => setNewItem({ ...newItem, priority: e.target.value as PlanItem["priority"] })}
                                            className="text-[11px] text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1.5 focus:outline-none">
                                            <option value="high">Висока</option>
                                            <option value="medium">Середня</option>
                                            <option value="low">Низька</option>
                                        </select>
                                        <button onClick={commitNew} disabled={!newItem.topic.trim()}
                                            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1.5 rounded-lg border border-green-500/25 text-green-400/70 hover:bg-green-500/8 hover:text-green-400 disabled:opacity-40 transition-all">
                                            Додати
                                        </button>
                                        <button onClick={() => setAddingNew(false)} className="text-[11px] text-white/30 hover:text-white/60 px-2 transition-colors">
                                            Скасувати
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <button onClick={() => setAddingNew(true)}
                                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-white/[0.08] text-[11px] text-white/30 hover:text-white/60 hover:border-white/[0.15] transition-all">
                                    <IconPlus /> Додати тему вручну
                                </button>
                            )}

                            {/* Items list */}
                            <div className="space-y-1.5">
                                <p className="text-[10px] font-bold tracking-[0.15em] text-white/20 uppercase">
                                    Оновлений план ({items.length} тем)
                                </p>
                                {items.map((item, idx) => {
                                    const isNew = !oldTopics.has(item.topic);
                                    return (
                                        <div key={idx} className={`rounded-lg border overflow-hidden ${isNew ? "border-green-500/15" : "border-white/[0.05]"}`}>
                                            {editingIdx === idx && editDraft ? (
                                                <div className="p-3 space-y-2 bg-white/[0.02]">
                                                    <input autoFocus value={editDraft.topic} onChange={(e) => setEditDraft({ ...editDraft, topic: e.target.value })}
                                                        className="w-full text-xs text-white/70 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500/30" />
                                                    <input value={editDraft.reason} onChange={(e) => setEditDraft({ ...editDraft, reason: e.target.value })}
                                                        placeholder="SEO обґрунтування..."
                                                        className="w-full text-xs text-white/50 bg-white/[0.04] border border-white/[0.08] rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500/30 placeholder:text-white/20" />
                                                    <div className="flex gap-2">
                                                        <select value={editDraft.priority} onChange={(e) => setEditDraft({ ...editDraft, priority: e.target.value as PlanItem["priority"] })}
                                                            className="text-[11px] text-white/60 bg-white/[0.04] border border-white/[0.08] rounded-lg px-2 py-1 focus:outline-none">
                                                            <option value="high">Висока</option>
                                                            <option value="medium">Середня</option>
                                                            <option value="low">Низька</option>
                                                        </select>
                                                        <button onClick={commitEdit}
                                                            className="flex items-center gap-1.5 text-[11px] font-bold px-3 py-1 rounded-lg border border-green-500/25 text-green-400/70 hover:bg-green-500/8 hover:text-green-400 transition-all">
                                                            Зберегти
                                                        </button>
                                                        <button onClick={cancelEdit} className="text-[11px] text-white/30 hover:text-white/60 px-2 transition-colors">
                                                            Скасувати
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className={`flex items-start gap-2.5 px-3 py-2.5 group transition-colors ${isNew ? "bg-green-500/[0.03]" : "hover:bg-white/[0.015]"}`}>
                                                    {isNew && (
                                                        <span className="text-[8px] font-bold text-green-400/70 bg-green-500/10 border border-green-500/15 px-1.5 py-0.5 rounded mt-0.5 shrink-0 uppercase tracking-wider">
                                                            нова
                                                        </span>
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border shrink-0 ${PRIORITY[item.priority].cls}`}>
                                                                {PRIORITY[item.priority].label}
                                                            </span>
                                                            <p className="text-xs text-white/65">{item.topic}</p>
                                                        </div>
                                                        {item.reason && (
                                                            <p className="text-[10px] text-white/25 mt-0.5 leading-snug">{item.reason}</p>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                        <button onClick={() => startEdit(idx)} className="p-1.5 text-white/30 hover:text-white/70 transition-colors rounded">
                                                            <IconEdit />
                                                        </button>
                                                        <button onClick={() => deleteItem(idx)} className="p-1.5 text-white/20 hover:text-red-400/70 transition-colors rounded">
                                                            <IconTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer — save button */}
                {gen.step === "done" && (
                    <div className="px-5 py-4 border-t border-white/[0.06] shrink-0">
                        {saved ? (
                            <p className="text-center text-sm font-bold text-green-400">✓ Збережено</p>
                        ) : (
                            <button onClick={handleSave} disabled={saving}
                                className="w-full py-2.5 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all disabled:opacity-50 active:scale-[0.98]">
                                {saving ? "Збереження..." : `Зберегти план (${items.length} тем)`}
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>,
        document.body
    );
}
