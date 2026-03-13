"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { db } from "@/lib/firebase";

interface FilterDoc {
    price_min?: number;
    price_max?: number;
    area_min?: number | string;
    area_max?: number | string;
    floor_min?: number;
    floor_max?: number;
    room_count?: string | number | (string | number)[];
    sub_geo_name?: string | string[];
}

interface BarData { label: string; count: number; }

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) return (
        <div className="px-3 py-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] text-xs">
            <p className="text-white/40 mb-0.5">{label}</p>
            <p className="text-orange-400 font-bold">{payload[0].value} юзерів</p>
        </div>
    );
    return null;
};

function MiniBarChart({ data }: { data: BarData[] }) {
    return (
        <ResponsiveContainer width="100%" height={160}>
            <BarChart data={data} margin={{ top: 5, right: 5, left: -28, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: "rgba(255,255,255,0.25)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.05)" }} />
                <Bar dataKey="count" fill="#F97316" radius={[4, 4, 0, 0]} maxBarSize={32} />
            </BarChart>
        </ResponsiveContainer>
    );
}

function ProgressList({ data, max }: { data: BarData[]; max?: number }) {
    const peak = max ?? (data[0]?.count || 1);
    return (
        <div className="flex flex-col gap-2 mt-1">
            {data.map(({ label, count }, i) => (
                <div key={i} className="flex items-center gap-3">
                    <p className="text-xs text-white/50 w-28 truncate flex-shrink-0">{label}</p>
                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.05]">
                        <div className="h-full rounded-full bg-orange-500 transition-all duration-500"
                             style={{ width: `${Math.round(count / peak * 100)}%` }} />
                    </div>
                    <p className="text-xs text-orange-400 font-bold w-8 text-right">{count}</p>
                </div>
            ))}
        </div>
    );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.05] bg-white/[0.02]">
                <p className="text-[11px] font-bold tracking-wide text-white/60"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>{title}</p>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

const toArr = <T,>(v: T | T[] | undefined): T[] =>
    Array.isArray(v) ? v : v != null ? [v] : [];

export default function FiltersChart() {
    const [docs, setDocs] = useState<FilterDoc[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDocs(collection(db, "Users_Filter"))
            .then((snap) => setDocs(snap.docs.map((d) => d.data() as FilterDoc)))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return (
        <div className="flex items-center justify-center py-16 gap-3 text-orange-400">
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm">Завантаження...</span>
        </div>
    );

    // ── Кімнати ──
    const roomMap: Record<string, number> = {};
    docs.forEach((d) => {
        toArr(d.room_count).forEach((r) => {
            const key = r === "any" ? "Будь-яка" : `${r} кімн.`;
            roomMap[key] = (roomMap[key] || 0) + 1;
        });
    });
    const roomData = Object.entries(roomMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);

    // ── Бюджет (price_max) ──
    const priceRanges: Record<string, number> = { "до 5к": 0, "5–10к": 0, "10–15к": 0, "15–20к": 0, "20к+": 0 };
    docs.forEach((d) => {
        const p = d.price_max;
        if (!p) return;
        if (p <= 5000) priceRanges["до 5к"]++;
        else if (p <= 10000) priceRanges["5–10к"]++;
        else if (p <= 15000) priceRanges["10–15к"]++;
        else if (p <= 20000) priceRanges["15–20к"]++;
        else priceRanges["20к+"]++;
    });
    const priceData = Object.entries(priceRanges).map(([label, count]) => ({ label, count }));

    // ── Мінімальна ціна ──
    const priceMinRanges: Record<string, number> = { "до 3к": 0, "3–6к": 0, "6–10к": 0, "10к+": 0 };
    docs.forEach((d) => {
        const p = d.price_min;
        if (!p) return;
        if (p <= 3000) priceMinRanges["до 3к"]++;
        else if (p <= 6000) priceMinRanges["3–6к"]++;
        else if (p <= 10000) priceMinRanges["6–10к"]++;
        else priceMinRanges["10к+"]++;
    });
    const priceMinData = Object.entries(priceMinRanges).map(([label, count]) => ({ label, count }));

    // ── Площа max ──
    const areaMaxRanges: Record<string, number> = { "до 40м²": 0, "40–60м²": 0, "60–90м²": 0, "90м²+": 0 };
    docs.forEach((d) => {
        const a = Number(d.area_max);
        if (!a || a >= 9999) return;
        if (a <= 40) areaMaxRanges["до 40м²"]++;
        else if (a <= 60) areaMaxRanges["40–60м²"]++;
        else if (a <= 90) areaMaxRanges["60–90м²"]++;
        else areaMaxRanges["90м²+"]++;
    });
    const areaMaxData = Object.entries(areaMaxRanges).map(([label, count]) => ({ label, count }));

    // ── Площа min ──
    const areaMinRanges: Record<string, number> = { "до 20м²": 0, "20–35м²": 0, "35–50м²": 0, "50м²+": 0 };
    docs.forEach((d) => {
        const a = Number(d.area_min);
        if (!a) return;
        if (a <= 20) areaMinRanges["до 20м²"]++;
        else if (a <= 35) areaMinRanges["20–35м²"]++;
        else if (a <= 50) areaMinRanges["35–50м²"]++;
        else areaMinRanges["50м²+"]++;
    });
    const areaMinData = Object.entries(areaMinRanges).map(([label, count]) => ({ label, count }));

    // ── Поверх min ──
    const floorMinRanges: Record<string, number> = { "1": 0, "2–3": 0, "4–5": 0, "6+": 0 };
    docs.forEach((d) => {
        const f = d.floor_min;
        if (!f || f <= 0) return;
        if (f === 1) floorMinRanges["1"]++;
        else if (f <= 3) floorMinRanges["2–3"]++;
        else if (f <= 5) floorMinRanges["4–5"]++;
        else floorMinRanges["6+"]++;
    });
    const floorMinData = Object.entries(floorMinRanges).map(([label, count]) => ({ label, count }));

    // ── Поверх max ──
    const floorMaxRanges: Record<string, number> = { "до 5": 0, "6–10": 0, "11–15": 0, "16+": 0 };
    docs.forEach((d) => {
        const f = d.floor_max;
        if (!f || f >= 999) return;
        if (f <= 5) floorMaxRanges["до 5"]++;
        else if (f <= 10) floorMaxRanges["6–10"]++;
        else if (f <= 15) floorMaxRanges["11–15"]++;
        else floorMaxRanges["16+"]++;
    });
    const floorMaxData = Object.entries(floorMaxRanges).map(([label, count]) => ({ label, count }));

    // ── Топ райони ──
    const districtMap: Record<string, number> = {};
    docs.forEach((d) => {
        toArr(d.sub_geo_name).forEach((r) => {
            districtMap[r] = (districtMap[r] || 0) + 1;
        });
    });
    const districtData = Object.entries(districtMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Аналітика фільтрів
                </p>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card title="Кількість кімнат">
                    <MiniBarChart data={roomData} />
                </Card>

                <Card title="Максимальна ціна (грн)">
                    <MiniBarChart data={priceData} />
                </Card>

                <Card title="Мінімальна ціна (грн)">
                    <MiniBarChart data={priceMinData} />
                </Card>

                <Card title="Максимальна площа (м²)">
                    <MiniBarChart data={areaMaxData} />
                </Card>

                <Card title="Мінімальна площа (м²)">
                    <MiniBarChart data={areaMinData} />
                </Card>

                <Card title="Мінімальний поверх">
                    <MiniBarChart data={floorMinData} />
                </Card>

                <Card title="Максимальний поверх">
                    <MiniBarChart data={floorMaxData} />
                </Card>

                <Card title="Топ райони">
                    {districtData.length === 0
                        ? <p className="text-xs text-white/25 py-4 text-center">Немає даних</p>
                        : <ProgressList data={districtData} />
                    }
                </Card>
            </div>
        </section>
    );
}