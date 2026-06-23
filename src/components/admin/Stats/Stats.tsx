"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import RegistrationsChart from "./RegistrationsChart";
import ConversionChart from "./ConversionChart";
import FiltersChart from "./FiltersChart";
import CitiesChart from "./CitiesChart";

/* ──────────────────────────────────────────────────────────────────────────
   Дані
   ────────────────────────────────────────────────────────────────────────── */

interface DayPoint { date: string; count: number; }

type RangeMode = "7" | "30" | "90" | "all";
type MetricKey = "payments" | "registrations" | "conversion" | "cities" | "filters";

const API_URL = "https://api.foxflat.com.ua/payment/get-payments";
const MS_DAY = 24 * 60 * 60 * 1000;

// Будує суцільний ряд дат від першої події до СЬОГОДНІ, підставляючи 0 де подій не було.
// Рахувати до "сьогодні", а не до останньої події — інакше дні без подій випадають
// з ряду і фільтри 7/30/90 днів від поточної дати лишаються без даних.
function fillGaps(raw: Record<string, number>): DayPoint[] {
    const dates = Object.keys(raw).sort();
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const first = dates.length ? new Date(dates[0] + "T00:00:00Z") : today;
    const result: DayPoint[] = [];

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
    return new Date(iso + "T00:00:00Z").toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" });
}

function rangeSlice(series: DayPoint[], range: RangeMode): { current: DayPoint[]; previous: DayPoint[] } {
    if (range === "all" || series.length === 0) return { current: series, previous: [] };

    const days = Number(range);
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    const cutoffCurrent = today.getTime() - (days - 1) * MS_DAY;
    const cutoffPrevious = cutoffCurrent - days * MS_DAY;

    const current = series.filter((d) => new Date(d.date + "T00:00:00Z").getTime() >= cutoffCurrent);
    const previous = series.filter((d) => {
        const t = new Date(d.date + "T00:00:00Z").getTime();
        return t >= cutoffPrevious && t < cutoffCurrent;
    });
    return { current, previous };
}

/* ──────────────────────────────────────────────────────────────────────────
   Дрібні візуальні примітиви
   ────────────────────────────────────────────────────────────────────────── */

function Sparkline({ values, color }: { values: number[]; color: string }) {
    const max = Math.max(...values, 1);
    const w = 100, h = 32;
    const step = values.length > 1 ? w / (values.length - 1) : w;
    const points = values.map((v, i) => `${i * step},${h - (v / max) * (h - 4) - 2}`).join(" ");

    return (
        <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none">
            <polyline points={points} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );
}

function TrendTag({ delta }: { delta: number | null }) {
    if (delta === null) return <span className="text-[11px] text-white/20">—</span>;
    const up = delta >= 0;
    return (
        <span className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${up ? "text-emerald-400" : "text-red-400"}`}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none" className={up ? "" : "rotate-180"}>
                <path d="M6 2v8M6 2l4 4M6 2L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {Math.abs(delta).toFixed(0)}%
        </span>
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   Картка-метрика (як у GA-зведенні: число, тренд, спарклайн, клік для фокусу)
   ────────────────────────────────────────────────────────────────────────── */

interface MetricCardProps {
    label: string;
    value: string;
    delta: number | null;
    spark: number[];
    color: string;
    active: boolean;
    onClick: () => void;
}

function MetricCard({ label, value, delta, spark, color, active, onClick }: MetricCardProps) {
    return (
        <button
            onClick={onClick}
            className={`text-left rounded-xl border px-4 py-3.5 transition-all duration-150 ${
                active
                    ? "border-orange-500/45 bg-orange-500/[0.06]"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.035]"
            }`}
        >
            <p className="text-[11px] font-medium text-white/40 mb-1.5 truncate">{label}</p>
            <div className="flex items-center justify-between gap-2">
                <p className="font-black text-2xl leading-none tabular-nums"
                   style={{ fontFamily: "'Unbounded', sans-serif", color: active ? color : "rgba(255,255,255,0.92)" }}>
                    {value}
                </p>
                <TrendTag delta={delta} />
            </div>
            <div className="mt-2 opacity-70">
                <Sparkline values={spark} color={color} />
            </div>
        </button>
    );
}

/* ──────────────────────────────────────────────────────────────────────────
   Тултіп головного графіка
   ────────────────────────────────────────────────────────────────────────── */

const ChartTooltip = ({ active, payload, label, color, unit }: {
    active?: boolean; payload?: { value: number }[]; label?: string; color: string; unit: string;
}) => {
    if (active && payload?.length && label) return (
        <div className="px-3.5 py-2.5 rounded-lg border border-white/10 bg-[#1a1a1a] shadow-xl text-xs">
            <p className="text-white/40 mb-1">{formatLong(label)}</p>
            <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
                <span className="text-white/90 font-semibold">{payload[0].value} {unit}</span>
            </div>
        </div>
    );
    return null;
};

/* ──────────────────────────────────────────────────────────────────────────
   Головна сторінка
   ────────────────────────────────────────────────────────────────────────── */

const METRIC_META: Record<MetricKey, { label: string; unit: string; color: string }> = {
    payments:      { label: "Оплати",      unit: "оплат",     color: "#F97316" },
    registrations: { label: "Реєстрації",  unit: "реєстрацій", color: "#38BDF8" },
    conversion:    { label: "Конверсія",   unit: "%",          color: "#A78BFA" },
    cities:        { label: "Міста",       unit: "міст",       color: "#34D399" },
    filters:       { label: "Фільтри",     unit: "фільтрів",   color: "#F472B6" },
};

const RANGE_OPTIONS: { key: RangeMode; label: string }[] = [
    { key: "7", label: "7 днів" },
    { key: "30", label: "30 днів" },
    { key: "90", label: "90 днів" },
    { key: "all", label: "Весь час" },
];

export default function StatsTab() {
    const [paymentsSeries, setPaymentsSeries] = useState<DayPoint[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [range, setRange] = useState<RangeMode>("30");
    const [focusMetric, setFocusMetric] = useState<MetricKey>("payments");
    const [hovered, setHovered] = useState<DayPoint | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    useEffect(() => {
        fetch(API_URL)
            .then((res) => {
                if (!res.ok) throw new Error(`Помилка запиту: ${res.status}`);
                return res.json();
            })
            .then((raw: Record<string, number>) => setPaymentsSeries(fillGaps(raw)))
            .catch((e) => setError(e.message))
            .finally(() => setLoading(false));
    }, []);

    const { current, previous } = useMemo(() => rangeSlice(paymentsSeries, range), [paymentsSeries, range]);

    const total = current.reduce((s, d) => s + d.count, 0);
    const prevTotal = previous.reduce((s, d) => s + d.count, 0);
    const delta = previous.length ? ((total - prevTotal) / Math.max(prevTotal, 1)) * 100 : null;
    const avgPerDay = current.length ? total / current.length : 0;
    const best = current.reduce((max, d) => (d.count > (max?.count ?? -1) ? d : max), null as DayPoint | null);

    const display = hovered ?? { date: current[current.length - 1]?.date ?? "", count: total };
    const sparkValues = current.length ? current.map((d) => d.count) : [0, 0, 0];

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

    const meta = METRIC_META[focusMetric];

    return (
        <div className="space-y-5">
            {/* Шапка: заголовок + єдиний селектор періоду для всієї сторінки */}
            <div className="flex flex-wrap items-center justify-between gap-3">
                <h1 className="text-lg font-bold text-white/90" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Статистика
                </h1>
                <div className="flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.02] p-1">
                    {RANGE_OPTIONS.map(({ key, label }) => (
                        <button key={key} onClick={() => setRange(key)}
                                className={`text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all duration-150 ${
                                    range === key
                                        ? "bg-orange-500/15 text-orange-400"
                                        : "text-white/35 hover:text-white/60"
                                }`}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Ряд карток-метрик — клік на картку фокусує головний графік на ній */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                <MetricCard
                    label="Оплати"
                    value={loading ? "—" : String(total)}
                    delta={delta}
                    spark={sparkValues}
                    color={METRIC_META.payments.color}
                    active={focusMetric === "payments"}
                    onClick={() => setFocusMetric("payments")}
                />
                <MetricCard
                    label="Реєстрації"
                    value="—"
                    delta={null}
                    spark={[3, 7, 5, 12, 8, 15, 10, 18, 14, 20]}
                    color={METRIC_META.registrations.color}
                    active={focusMetric === "registrations"}
                    onClick={() => setFocusMetric("registrations")}
                />
                <MetricCard
                    label="Конверсія"
                    value="34%"
                    delta={null}
                    spark={[28, 30, 29, 31, 33, 32, 34]}
                    color={METRIC_META.conversion.color}
                    active={focusMetric === "conversion"}
                    onClick={() => setFocusMetric("conversion")}
                />
                <MetricCard
                    label="Міста"
                    value="22"
                    delta={null}
                    spark={[33, 11, 8, 6, 4, 2, 2, 2, 1, 1]}
                    color={METRIC_META.cities.color}
                    active={focusMetric === "cities"}
                    onClick={() => setFocusMetric("cities")}
                />
                <MetricCard
                    label="Фільтри"
                    value="—"
                    delta={null}
                    spark={[20, 15, 18, 8, 12, 5, 9, 14, 6, 10]}
                    color={METRIC_META.filters.color}
                    active={focusMetric === "filters"}
                    onClick={() => setFocusMetric("filters")}
                />
            </div>

            {/* Головна панель: великий графік для обраної метрики */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="flex flex-wrap items-start justify-between gap-3 px-5 pt-4">
                    <div>
                        <div className="flex items-baseline gap-3 flex-wrap">
                            <p className="font-black text-3xl leading-none tabular-nums"
                               style={{ fontFamily: "'Unbounded', sans-serif", color: meta.color }}>
                                {focusMetric === "payments" ? display.count : "—"}
                            </p>
                            <span className="text-xs text-white/30">
                                {focusMetric === "payments"
                                    ? (hovered ? formatLong(hovered.date) : `${meta.unit} за період`)
                                    : `${meta.label} — детальний вигляд нижче`}
                            </span>
                        </div>
                        {focusMetric === "payments" && (
                            <div className="flex items-center gap-4 mt-1.5 text-[11px] text-white/30">
                                <span>Середнє: <span className="text-white/60 font-medium">{avgPerDay.toFixed(1)}/день</span></span>
                                {best && <span>Пік: <span className="text-white/60 font-medium">{best.count}</span> ({formatShort(best.date)})</span>}
                                {previous.length > 0 && <span>Попередній період: <span className="text-white/60 font-medium">{prevTotal}</span></span>}
                            </div>
                        )}
                    </div>

                    {focusMetric === "payments" && (
                        <div className="flex gap-2">
                            <button onClick={exportCSV}
                                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.07] text-white/35 hover:border-orange-500/40 hover:text-orange-400 transition-all duration-150">
                                CSV
                            </button>
                            <button onClick={exportExcel}
                                    className="text-[11px] font-semibold px-3 py-1.5 rounded-full border border-white/[0.07] text-white/35 hover:border-orange-500/40 hover:text-orange-400 transition-all duration-150">
                                Excel
                            </button>
                        </div>
                    )}
                </div>

                <div className="px-2 pb-2 pt-3">
                    {focusMetric === "payments" ? (
                        loading ? (
                            <div className="flex items-center justify-center py-20 gap-3 text-orange-400">
                                <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                                    <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                </svg>
                                <span className="text-sm">Завантаження...</span>
                            </div>
                        ) : error ? (
                            <div className="px-5 py-10 text-center">
                                <p className="text-sm text-red-400 font-medium">Не вдалося завантажити дані</p>
                                <p className="text-xs text-white/30 mt-1">{error}</p>
                            </div>
                        ) : current.length === 0 ? (
                            <p className="text-sm text-white/25 text-center py-16">Немає даних за обраний період</p>
                        ) : (
                            <ResponsiveContainer width="100%" height={280}>
                                <AreaChart
                                    data={current}
                                    margin={{ top: 10, right: 16, left: 0, bottom: 0 }}
                                    onMouseMove={(s: unknown) => {
                                        const payload = (s as { activePayload?: { payload: DayPoint }[] })?.activePayload;
                                        if (payload?.[0]) setHovered(payload[0].payload);
                                    }}
                                    onMouseLeave={() => setHovered(null)}
                                >
                                    <defs>
                                        <linearGradient id="metricFill" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={meta.color} stopOpacity={0.35} />
                                            <stop offset="100%" stopColor={meta.color} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.045)" />
                                    <XAxis dataKey="date" tickFormatter={formatShort}
                                           tick={{ fontSize: 11, fill: "rgba(255,255,255,0.28)" }} axisLine={false} tickLine={false} minTickGap={28} />
                                    <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "rgba(255,255,255,0.28)" }}
                                           axisLine={false} tickLine={false} width={28} />
                                    <Tooltip content={<ChartTooltip color={meta.color} unit={meta.unit} />}
                                             cursor={{ stroke: `${meta.color}55`, strokeWidth: 1 }} />
                                    <Area type="monotone" dataKey="count" stroke={meta.color} strokeWidth={2}
                                          fill="url(#metricFill)" dot={false}
                                          activeDot={{ r: 4, fill: meta.color, stroke: "#0f0f0f", strokeWidth: 2 }} />
                                </AreaChart>
                            </ResponsiveContainer>
                        )
                    ) : (
                        // Для метрик, де графік ще не переведений на формат "день → значення",
                        // показуємо існуючий детальний компонент напряму.
                        <div className="px-3 pb-2">
                            {focusMetric === "registrations" && <RegistrationsChart />}
                            {focusMetric === "conversion" && <ConversionChart />}
                            {focusMetric === "cities" && <CitiesChart />}
                            {focusMetric === "filters" && <FiltersChart />}
                        </div>
                    )}
                </div>
            </div>

            {/* Детальний вигляд оплат (таблиця) — згорнутий за умовчанням, як "View details" у GA */}
            {focusMetric === "payments" && current.length > 0 && (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                    <button onClick={() => setDetailOpen((v) => !v)}
                            className="w-full flex items-center justify-between px-5 py-3.5 text-left">
                        <span className="text-[11px] font-bold tracking-widest text-white/30 uppercase">
                            Деталі по днях
                        </span>
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                             className={`transition-transform duration-200 ${detailOpen ? "rotate-180 text-orange-400" : "text-white/20"}`}>
                            <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                    {detailOpen && (
                        <div className="overflow-x-auto border-t border-white/[0.05]">
                            <table className="w-full min-w-[300px]">
                                <thead>
                                <tr className="border-b border-white/[0.05]">
                                    {["#", "Дата", "Оплат"].map((h) => (
                                        <th key={h} className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-5 py-2">{h}</th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody>
                                {current.slice().reverse().map((item, idx) => (
                                    <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                        <td className="px-5 py-2.5 text-xs text-white/20">{idx + 1}</td>
                                        <td className="px-5 py-2.5 text-sm text-white/70 font-medium">{item.date}</td>
                                        <td className="px-5 py-2.5 text-sm font-bold" style={{ color: meta.color }}>{item.count}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}