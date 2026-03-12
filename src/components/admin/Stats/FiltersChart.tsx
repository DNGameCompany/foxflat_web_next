"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { db } from "@/lib/firebase";

interface FilterDoc {
    price_min?: number;
    price_max?: number;
    area_min?: number | string;
    room_count?: (string | number)[];
    pets?: string;
    geo_name?: string;
    sub_geo_name?: string[];
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

function Card({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-4 py-2.5 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>{title}</p>
            </div>
            <div className="p-4">{children}</div>
        </div>
    );
}

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
        (d.room_count ?? []).forEach((r) => {
            const key = r === "any" ? "Будь-яка" : `${r} кімн.`;
            roomMap[key] = (roomMap[key] || 0) + 1;
        });
    });
    const roomData = Object.entries(roomMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);

    // ── Бюджет (price_max) ──
    const priceRanges: Record<string, number> = {
        "до 5к": 0, "5–10к": 0, "10–15к": 0, "15–20к": 0, "20к+": 0,
    };
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

    // ── Pets ──
    const petsMap: Record<string, number> = {};
    docs.forEach((d) => {
        const key = d.pets === "not_selected" || !d.pets ? "Не важливо" : d.pets === "yes" ? "З тваринами" : "Без тварин";
        petsMap[key] = (petsMap[key] || 0) + 1;
    });
    const petsTotal = Object.values(petsMap).reduce((s, v) => s + v, 0);

    // ── Топ райони ──
    const districtMap: Record<string, number> = {};
    docs.forEach((d) => {
        (d.sub_geo_name ?? []).forEach((r) => {
            districtMap[r] = (districtMap[r] || 0) + 1;
        });
    });
    const districtData = Object.entries(districtMap)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 8);

    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Аналітика фільтрів
                </p>
            </div>

            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">

                {/* Кімнати */}
                <Card title="Кількість кімнат">
                    <MiniBarChart data={roomData} />
                </Card>

                {/* Бюджет */}
                <Card title="Максимальний бюджет (грн)">
                    <MiniBarChart data={priceData} />
                </Card>

                {/* Тварини */}
                <Card title="Фільтр по тваринах">
                    <div className="flex flex-col gap-2 mt-1">
                        {Object.entries(petsMap).map(([label, count]) => (
                            <div key={label} className="flex items-center gap-3">
                                <p className="text-xs text-white/50 w-28 flex-shrink-0">{label}</p>
                                <div className="flex-1 h-1.5 rounded-full bg-white/[0.05]">
                                    <div className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                         style={{ width: `${Math.round(count / petsTotal * 100)}%` }} />
                                </div>
                                <p className="text-xs text-orange-400 font-bold w-8 text-right">{count}</p>
                            </div>
                        ))}
                    </div>
                </Card>

                {/* Топ райони */}
                <Card title="Топ райони">
                    {districtData.length === 0 ? (
                        <p className="text-xs text-white/25 py-4 text-center">Немає даних</p>
                    ) : (
                        <div className="flex flex-col gap-2 mt-1">
                            {districtData.map(({ label, count }, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <p className="text-xs text-white/50 w-28 truncate flex-shrink-0">{label}</p>
                                    <div className="flex-1 h-1.5 rounded-full bg-white/[0.05]">
                                        <div className="h-full rounded-full bg-orange-500 transition-all duration-500"
                                             style={{ width: `${Math.round(count / (districtData[0]?.count || 1) * 100)}%` }} />
                                    </div>
                                    <p className="text-xs text-orange-400 font-bold w-8 text-right">{count}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </section>
    );
}