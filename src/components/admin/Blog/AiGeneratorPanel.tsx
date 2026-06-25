"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Category = "tips" | "news" | "guide";

interface PlanItem {
    topic: string;
    status: "planned" | "published" | "skip";
    priority: "high" | "medium" | "low";
    reason: string;
}

export interface GeneratedPost {
    title: string;
    excerpt: string;
    content: string;
    category: Category;
    slug: string;
}

type GenStep = "idle" | "fetching" | "searching" | "generating" | "done" | "error";

interface GenState {
    running: boolean;
    step: GenStep;
    progress: number;
    message: string;
    error?: string;
    tokens?: { input: number; output: number };
}

const GEN_STEPS: { key: GenStep; label: string }[] = [
    { key: "fetching",   label: "Завантаження даних" },
    { key: "searching",  label: "Пошук актуальних даних" },
    { key: "generating", label: "Генерація AI контенту" },
];

const PRIORITY = {
    high:   { label: "Висока",  dot: "bg-orange-400", badge: "text-orange-400/80 bg-orange-400/8 border-orange-500/20" },
    medium: { label: "Середня", dot: "bg-yellow-400/70", badge: "text-yellow-400/70 bg-yellow-400/6 border-yellow-500/15" },
    low:    { label: "Низька",  dot: "bg-white/25", badge: "text-white/30 bg-white/[0.03] border-white/[0.07]" },
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
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="shrink-0">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function ChevronDown({ open }: { open: boolean }) {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            className={`shrink-0 text-white/30 transition-transform duration-200 ${open ? "rotate-180" : ""}`}>
            <polyline points="6 9 12 15 18 9" />
        </svg>
    );
}

// ── Main component ────────────────────────────────────────────────────────

export default function AiGeneratorPanel({
    isOpen,
    onClose,
    onGenerated,
}: {
    isOpen: boolean;
    onClose: () => void;
    onGenerated: (post: GeneratedPost) => void;
}) {
    const [plan, setPlan] = useState<PlanItem[]>([]);
    const [planLoading, setPlanLoading] = useState(false);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState("");
    const [gen, setGen] = useState<GenState>({ running: false, step: "idle", progress: 0, message: "" });

    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchPlan = useCallback(async () => {
        setPlanLoading(true);
        try {
            const res = await fetch("/api/admin/content-plan");
            const data = await res.json();
            setPlan((data.items ?? []).filter((i: PlanItem) => i.status === "planned"));
        } catch {
            setPlan([]);
        } finally {
            setPlanLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            fetchPlan();
            setGen({ running: false, step: "idle", progress: 0, message: "" });
            setSelectedTopic("");
            setDropdownOpen(false);
        }
    }, [isOpen, fetchPlan]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const handleGenerate = async () => {
        setGen({ running: true, step: "fetching", progress: 0, message: "Підготовка..." });

        try {
            const res = await fetch("/api/admin/generate-blog", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ topic: selectedTopic || undefined, dry_run: true }),
            });
            if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

            const reader = res.body.getReader();
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
                        setGen({ running: false, step: "done", progress: 100, message: "Готово!", tokens: evt.tokens });
                        onGenerated(evt.post as GeneratedPost);
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
                error: e instanceof Error ? e.message : String(e),
            }));
        }
    };

    if (!isOpen) return null;

    const selectedItem = plan.find((i) => i.topic === selectedTopic);
    const stepOrder: GenStep[] = ["fetching", "searching", "generating"];
    const currentStepIdx = stepOrder.indexOf(gen.step);

    const isIdle = !gen.running && gen.step !== "done" && gen.step !== "error";

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/65 backdrop-blur-sm"
                onClick={!gen.running ? onClose : undefined}
            />

            {/* Panel */}
            <div className="relative w-full sm:max-w-[440px] rounded-t-2xl sm:rounded-2xl border-t sm:border border-white/[0.09] bg-[#0a0a0a] shadow-2xl">

                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06] rounded-t-2xl sm:rounded-t-2xl">
                    <div className="flex items-center gap-2.5">
                        <span className="text-orange-400 text-base leading-none">✦</span>
                        <div>
                            <p className="text-sm font-bold text-white/85">AI Генератор</p>
                            <p className="text-[10px] text-white/25 mt-0.5">поля заповляться автоматично</p>
                        </div>
                    </div>
                    {!gen.running && (
                        <button
                            onClick={onClose}
                            className="w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/[0.06] transition-all text-xl leading-none"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* Body */}
                <div className="p-5 space-y-5">

                    {isIdle && (
                        <>
                            {/* Custom topic dropdown */}
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold tracking-[0.15em] text-white/25 uppercase">Тема статті</p>
                                <div ref={dropdownRef} className="relative">
                                    <button
                                        onClick={() => setDropdownOpen((v) => !v)}
                                        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.025] hover:border-white/[0.15] hover:bg-white/[0.04] transition-all text-left"
                                    >
                                        <div className="flex items-center gap-2.5 min-w-0">
                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${selectedItem ? PRIORITY[selectedItem.priority].dot : "bg-orange-400/50"}`} />
                                            <span className="text-xs text-white/60 truncate">
                                                {selectedItem ? selectedItem.topic : "Автоматично (AI обирає)"}
                                            </span>
                                        </div>
                                        <ChevronDown open={dropdownOpen} />
                                    </button>

                                    {dropdownOpen && (
                                        <div className="absolute top-full left-0 right-0 mt-1.5 rounded-xl border border-white/[0.08] bg-[#0f0f0f] shadow-2xl z-[200] overflow-hidden">
                                            {/* Auto option */}
                                            <button
                                                onClick={() => { setSelectedTopic(""); setDropdownOpen(false); }}
                                                className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${!selectedTopic ? "bg-orange-500/[0.07]" : "hover:bg-white/[0.03]"}`}
                                            >
                                                <span className="w-2 h-2 rounded-full bg-orange-400/50 flex-shrink-0 mt-0.5" />
                                                <div className="min-w-0">
                                                    <p className="text-xs text-white/65">Автоматично (AI обирає)</p>
                                                    <p className="text-[10px] text-white/25 mt-0.5">Найкраща тема з контент-плану</p>
                                                </div>
                                            </button>

                                            {planLoading ? (
                                                <div className="flex items-center gap-2 px-4 py-3 border-t border-white/[0.05] text-[11px] text-white/25">
                                                    <Spinner size={11} /> Завантаження...
                                                </div>
                                            ) : plan.length === 0 ? (
                                                <p className="px-4 py-3 border-t border-white/[0.05] text-[11px] text-white/20">Немає запланованих тем</p>
                                            ) : (
                                                <div className="border-t border-white/[0.05] max-h-52 overflow-y-auto">
                                                    {plan.map((item, idx) => (
                                                        <button
                                                            key={idx}
                                                            onClick={() => { setSelectedTopic(item.topic); setDropdownOpen(false); }}
                                                            className={`w-full flex items-start gap-3 px-4 py-2.5 text-left transition-colors ${selectedTopic === item.topic ? "bg-orange-500/[0.07]" : "hover:bg-white/[0.03]"}`}
                                                        >
                                                            <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${PRIORITY[item.priority].dot}`} />
                                                            <div className="min-w-0 flex-1">
                                                                <div className="flex items-start gap-2">
                                                                    <p className="text-xs text-white/65 flex-1 leading-snug">{item.topic}</p>
                                                                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex-shrink-0 mt-0.5 ${PRIORITY[item.priority].badge}`}>
                                                                        {PRIORITY[item.priority].label}
                                                                    </span>
                                                                </div>
                                                                {item.reason && (
                                                                    <p className="text-[10px] text-white/22 mt-0.5 leading-snug">{item.reason}</p>
                                                                )}
                                                            </div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {selectedItem && (
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${PRIORITY[selectedItem.priority].badge}`}>
                                            {PRIORITY[selectedItem.priority].label} пріоритет
                                        </span>
                                        {selectedItem.reason && (
                                            <p className="text-[10px] text-white/25 truncate">{selectedItem.reason}</p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Generate button */}
                            <button
                                onClick={handleGenerate}
                                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl font-bold text-sm text-black bg-gradient-to-r from-orange-500 to-amber-400 hover:from-orange-400 hover:to-amber-300 transition-all active:scale-[0.98] shadow-lg shadow-orange-500/15"
                            >
                                <span className="text-base leading-none">✦</span>
                                Згенерувати статтю
                            </button>

                            <p className="text-[10px] text-white/20 text-center leading-relaxed">
                                Займає 20–40 секунд · поля форми заповляться автоматично
                            </p>
                        </>
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
                                    <div
                                        className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-400 transition-all duration-700 ease-out"
                                        style={{ width: `${gen.progress}%` }}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2.5">
                                {stepOrder.map((key, idx) => {
                                    const isDone = idx < currentStepIdx;
                                    const isActive = key === gen.step;
                                    const label = GEN_STEPS.find((s) => s.key === key)?.label ?? key;
                                    return (
                                        <div key={key} className={`flex items-center gap-3 transition-opacity ${isDone || isActive ? "opacity-100" : "opacity-20"}`}>
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isDone ? "bg-green-500/15 border border-green-500/20" : isActive ? "bg-orange-500/15 border border-orange-500/20" : "bg-white/[0.04] border border-white/[0.07]"}`}>
                                                {isDone ? (
                                                    <span className="text-green-400"><Check /></span>
                                                ) : isActive ? (
                                                    <span className="text-orange-400"><Spinner /></span>
                                                ) : (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-white/15 block" />
                                                )}
                                            </div>
                                            <span className={`text-xs leading-none ${isDone ? "text-white/35 line-through" : isActive ? "text-white/75 font-semibold" : "text-white/20"}`}>
                                                {label}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Done */}
                    {gen.step === "done" && (
                        <div className="space-y-4">
                            <div className="rounded-xl border border-green-500/20 bg-green-500/[0.04] px-4 py-3.5 space-y-3">
                                <div className="flex items-center gap-2">
                                    <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
                                        <Check size={9} />
                                    </div>
                                    <p className="text-xs font-bold text-green-400/80">Контент згенеровано</p>
                                </div>
                                <p className="text-[11px] text-white/40 leading-relaxed">
                                    Поля форми заповнено. Перегляньте зміст та натисніть «Зберегти» коли будете готові.
                                </p>
                                {gen.tokens && (
                                    <div className="flex gap-4 pt-2.5 border-t border-white/[0.06]">
                                        {[
                                            { label: "Вхідні токени",  value: gen.tokens.input },
                                            { label: "Вихідні токени", value: gen.tokens.output },
                                            { label: "Всього",         value: gen.tokens.input + gen.tokens.output, accent: true },
                                        ].map(({ label, value, accent }) => (
                                            <div key={label}>
                                                <p className="text-[9px] text-white/20 uppercase tracking-wider">{label}</p>
                                                <p className={`text-xs font-mono mt-0.5 ${accent ? "text-orange-400/70" : "text-white/40"}`}>
                                                    {value.toLocaleString()}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={onClose}
                                className="w-full py-2.5 rounded-xl bg-green-500/10 border border-green-500/25 text-sm font-bold text-green-400 hover:bg-green-500/20 transition-all"
                            >
                                Перейти до редагування
                            </button>
                        </div>
                    )}

                    {/* Error */}
                    {gen.step === "error" && (
                        <div className="space-y-3">
                            <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] px-4 py-3">
                                <p className="text-[10px] font-bold text-red-400/70 uppercase tracking-wider mb-1.5">Помилка</p>
                                <p className="text-xs text-red-400/60 font-mono break-all leading-relaxed">{gen.error}</p>
                            </div>
                            <button
                                onClick={() => setGen({ running: false, step: "idle", progress: 0, message: "" })}
                                className="w-full py-2 rounded-xl border border-white/[0.08] text-xs text-white/40 hover:text-white/60 hover:border-white/[0.15] transition-all"
                            >
                                Спробувати знову
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
