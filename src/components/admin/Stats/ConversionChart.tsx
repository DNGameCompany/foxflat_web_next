"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { db } from "@/lib/firebase";

interface Stats {
    premium: number;
    free: number;
    total: number;
}

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { name: string; value: number }[] }) => {
    if (active && payload?.length) {
        return (
            <div className="px-3 py-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] text-xs">
                <p className="text-white/40 mb-0.5">{payload[0].name}</p>
                <p className="text-orange-400 font-bold">{payload[0].value} юзерів</p>
            </div>
        );
    }
    return null;
};

export default function ConversionChart() {
    const [stats, setStats] = useState<Stats>({ premium: 0, free: 0, total: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDocs(collection(db, "Users"))
            .then((snapshot) => {
                let premium = 0, free = 0;
                snapshot.docs.forEach((doc) => {
                    const sub = doc.data().active_subscription?.sub_name;
                    if (sub === "month") premium++;
                    else free++;
                });
                setStats({ premium, free, total: premium + free });
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const conversion = stats.total ? ((stats.premium / stats.total) * 100).toFixed(1) : "0";

    const pieData = [
        { name: "Premium", value: stats.premium },
        { name: "Free", value: stats.free },
    ];

    const kpis = [
        { label: "Всього юзерів", value: stats.total, accent: false },
        { label: "Premium (month)", value: stats.premium, accent: true },
        { label: "Free (trial)", value: stats.free, accent: false },
        { label: "Конверсія", value: `${conversion}%`, accent: true },
    ];

    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="px-5 py-3 border-b border-white/[0.05]">
                <p className="text-[11px] font-bold tracking-wide text-white/60"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Конверсія Free → Premium
                </p>
            </div>

            <div className="p-5">
                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-3 text-orange-400">
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm">Завантаження...</span>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-6 items-center">

                        {/* Pie chart */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={80}
                                        paddingAngle={3}
                                        dataKey="value"
                                        strokeWidth={0}
                                    >
                                        <Cell fill="#F97316" />
                                        <Cell fill="rgba(255,255,255,0.06)" />
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            {/* Центр */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <p className="font-black text-orange-400 leading-none"
                                   style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "22px" }}>
                                    {conversion}%
                                </p>
                                <p className="text-[11px] text-white/25 mt-1">конверсія</p>
                            </div>
                        </div>

                        {/* KPI картки */}
                        <div className="grid grid-cols-2 gap-3 flex-1 w-full">
                            {kpis.map((k, i) => (
                                <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/[0.05] bg-white/[0.02] text-center">
                                    <p className={`font-black text-xl leading-none mb-1 ${k.accent ? "text-orange-400" : "text-white/60"}`}
                                       style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                        {k.value}
                                    </p>
                                    <p className="text-[11px] text-white/25">{k.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Прогрес бар */}
                        <div className="w-full lg:hidden">
                            <div className="flex justify-between text-[11px] text-white/25 mb-2">
                                <span>Free</span>
                                <span>Premium</span>
                            </div>
                            <div className="h-2 rounded-full bg-white/[0.05] overflow-hidden">
                                <div
                                    className="h-full rounded-full bg-orange-500 transition-all duration-700"
                                    style={{ width: `${conversion}%` }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}