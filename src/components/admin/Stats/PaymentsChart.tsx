"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

interface DayStats { date: string; count: number; }

type RangeMode = "7" | "30" | "90" | "all";

const API_URL = "https://api.foxflat.com.ua/payment/get-payments";

const MS_DAY = 24 * 60 * 60 * 1000;

// Будує суцільний ряд дат від першої оплати до СЬОГОДНІ, підставляючи 0 там, де оплат не було.
// Важливо рахувати "до сьогодні", а не "до останньої оплати" — інакше дні без оплат
// випадають з ряду, і фільтри 7/30/90 днів від поточної дати лишаються без даних.
function fillGaps(raw: Record<string, number>): DayStats[] {
    const dates = Object.keys(raw).sort();

    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const first = dates.length ? new Date(dates[0] + "T00:00:00Z") : today;
    const result: DayStats[] = [];

    for (let t = first.getTime(); t <= today.getTime(); t += MS_DAY) {
        const iso = new Date(t).toISOString().slice(0, 10);
        result.push({ date: iso, count: raw[iso] ?? 0 });
    }
    return result;
}

function formatShort(iso: string) {
    const [, m, d] = iso.split("-");
    return `${d}.${m}`;
}

function formatLong(iso: string) {
    const date = new Date(iso + "T00:00:00Z");
    return date.toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length && label) return (
        <div className="px-3.5 py-2.5 rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl text-xs">
            <p className="text-white/40 mb-1">{formatLong(label)}</p>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-orange-400" />
                <span className="text-white/90 font-semibold">{payload[0].value} оплат</span>
            </div>
        </div>
    );
    return null;
};

// Стрілка тренду — як у GA: зелена вгору, червона вниз
function TrendBadge({ delta }: { delta: number | null }) {
    if (delta === null) return null;
    const up = delta >= 0;
    return (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" className={up ? "" : "rotate-180"}>
                <path d="M6 2v8M6 2l4 4M6 2L2 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {Math.abs(delta).toFixed(0)}%
        </span>
    );
}

export default function PaymentsChart() {
    const [series, setSeries] = useState<DayStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [range, setRange] = useState<RangeMode>("30");
    const [hovered, setHovered] = useState<DayStats | null>(null);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`Помилка запиту: ${res.status}`);
                return res.json();
            })
            .then((raw: Record<string, number>) => setSeries(fillGaps(raw)))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    // Фільтрація по реальних календарних днях від "сьогодні", а не по індексу масиву —
    // саме тут була причина, чому таби 7/30/90 раніше показували однакові дані.
    const { current, previous } = useMemo(() => {
        if (range === "all") return { current: series, previous: [] as DayStats[] };

        const days = Number(range);
        const today = new Date();
        today.setUTCHours(0, 0, 0, 0);

        const cutoffCurrent = today.getTime() - (days - 1) * MS_DAY;
        const cutoffPrevious = cutoffCurrent - days * MS_DAY;

        const cur = series.filter((d) => new Date(d.date + "T00:00:00Z").getTime() >= cutoffCurrent);
        const prev = series.filter((d) => {
            const t = new Date(d.date + "T00:00:00Z").getTime();
            return t >= cutoffPrevious && t < cutoffCurrent;
        });
        return { current: cur, previous: prev };
    }, [series, range]);

    const total = current.reduce((s, d) => s + d.count, 0);
    const prevTotal = previous.reduce((s, d) => s + d.count, 0);
    const totalDelta = previous.length ? ((total - prevTotal) / Math.max(prevTotal, 1)) * 100 : null;

    const avgPerDay = current.length ? total / current.length : 0;
    const best = current.reduce((max, d) => (d.count > (max?.count ?? -1) ? d : max), null as DayStats | null);

    const display = hovered ?? { date: current[current.length - 1]?.date ?? "", count: total };

    const exportCSV = () => {
        const blob = new Blob(["\uFEFF" + Papa.unparse(current)], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "payments_by_day.csv";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(current);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "PaymentsByDay");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "payments_by_day.xlsx");
    };

    const ranges: { key: RangeMode; label: string }[] = [
        { key: "7", label: "7 днів" },
        { key: "30", label: "30 днів" },
        { key: "90", label: "90 днів" },
        { key: "all", label: "Весь час" },
    ];

    if (loading) return (
        <div className="flex items-center justify-center py-20 gap-3 text-orange-400">
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm">Завантаження...</span>
        </div>
    );

    if (error) return (
        <div className="rounded-xl border border-red-500/20 bg-red-500/[0.04] p-5 text-center">
            <p className="text-sm text-red-400 font-medium">Не вдалося завантажити дані</p>
            <p className="text-xs text-white/30 mt-1">{error}</p>
        </div>
    );

    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            {/* Хедер: таби діапазону + експорт, як стрічка інструментів у GA */}
            <div className="flex flex-wrap items-center justify-between gap-2 px-5 pt-4">
                <div className="flex gap-1">
                    {ranges.map(({ key, label }) => (
                        <button key={key} onClick={() => setRange(key)}
                                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full border transition-all duration-150 ${
                                    range === key
                                        ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                        : "border-transparent text-white/35 hover:text-white/60 hover:bg-white/[0.04]"
                                }`}>
                            {label}
                        </button>
                    ))}
                </div>
                <div className="flex gap-2">
                    {[{ label: "CSV", fn: exportCSV }, { label: "Excel", fn: exportExcel }].map(({ label, fn }) => (
                        <button key={label} onClick={fn}
                                className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.07] text-white/35 hover:border-orange-500/40 hover:text-orange-400 transition-all duration-150">
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Великий KPI-блок зліва, як заголовна цифра в GA-звіті */}
            <div className="px-5 pt-5 pb-1">
                <div className="flex items-baseline gap-3 flex-wrap">
                    <p className="font-black text-4xl text-white/95 leading-none tabular-nums"
                       style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        {display.count}
                    </p>
                    <span className="text-xs text-white/30 mb-1">
                        {hovered ? formatLong(hovered.date) : "оплат за період"}
                    </span>
                    {!hovered && <TrendBadge delta={totalDelta} />}
                </div>
                <div className="flex items-center gap-4 mt-2 text-[11px] text-white/30">
                    <span>Середнє: <span className="text-white/60 font-medium">{avgPerDay.toFixed(1)}/день</span></span>
                    {best && (
                        <span>Пік: <span className="text-white/60 font-medium">{best.count}</span> ({formatShort(best.date)})</span>
                    )}
                    {previous.length > 0 && (
                        <span>Попередній період: <span className="text-white/60 font-medium">{prevTotal}</span></span>
                    )}
                </div>
            </div>

            {/* Графік-area, фірмовий вигляд аналітичних дашбордів */}
            <div className="px-2 pb-2">
                {current.length === 0 ? (
                    <p className="text-sm text-white/25 text-center py-16">Немає даних за обраний період</p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <AreaChart
                            data={current}
                            margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                            onMouseMove={(s: unknown) => {
                                const payload = (s as { activePayload?: { payload: DayStats }[] })?.activePayload;
                                if (payload?.[0]) setHovered(payload[0].payload);
                            }}
                            onMouseLeave={() => setHovered(null)}
                        >
                            <defs>
                                <linearGradient id="paymentsFill" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#F97316" stopOpacity={0.35} />
                                    <stop offset="100%" stopColor="#F97316" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.045)" />
                            <XAxis
                                dataKey="date"
                                tickFormatter={formatShort}
                                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.28)" }}
                                axisLine={false}
                                tickLine={false}
                                minTickGap={28}
                            />
                            <YAxis
                                allowDecimals={false}
                                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.28)" }}
                                axisLine={false}
                                tickLine={false}
                                width={28}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(249,115,22,0.3)", strokeWidth: 1 }} />
                            <Area
                                type="monotone"
                                dataKey="count"
                                stroke="#F97316"
                                strokeWidth={2}
                                fill="url(#paymentsFill)"
                                dot={false}
                                activeDot={{ r: 4, fill: "#F97316", stroke: "#0f0f0f", strokeWidth: 2 }}
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}