"use client";

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { db } from "@/lib/firebase";

type Period = "day" | "week" | "month";

interface DataPoint {
    label: string;
    count: number;
}

interface Timestamp {
    seconds: number;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) {
        return (
            <div className="px-3 py-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] text-xs">
                <p className="text-white/40 mb-0.5">{label}</p>
                <p className="text-orange-400 font-bold">{payload[0].value} реєстрацій</p>
            </div>
        );
    }
    return null;
};

export default function RegistrationsChart() {
    const [data, setData] = useState<DataPoint[]>([]);
    const [period, setPeriod] = useState<Period>("day");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        getDocs(collection(db, "Users"))
            .then((snapshot) => {
                const dates: Date[] = [];

                snapshot.docs.forEach((doc) => {
                    const raw = doc.data().created_at;
                    if (!raw) return;
                    const date = typeof raw === "string"
                        ? new Date(raw)
                        : new Date((raw as Timestamp).seconds * 1000);
                    if (!isNaN(date.getTime())) dates.push(date);
                });

                const map: Record<string, number> = {};

                dates.forEach((date) => {
                    let key = "";
                    if (period === "day") {
                        key = date.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
                    } else if (period === "week") {
                        // Початок тижня (понеділок)
                        const d = new Date(date);
                        const day = d.getDay() || 7;
                        d.setDate(d.getDate() - day + 1);
                        key = d.toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit" });
                    } else {
                        key = date.toLocaleDateString("uk-UA", { month: "short", year: "2-digit" });
                    }
                    map[key] = (map[key] || 0) + 1;
                });

                // Сортуємо по даті
                const sorted = Object.entries(map)
                    .map(([label, count]) => ({ label, count }))
                    .slice(-30); // останні 30 точок

                setData(sorted);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [period]);

    const total = data.reduce((s, d) => s + d.count, 0);
    const max = Math.max(...data.map((d) => d.count));
    const avg = data.length ? Math.round(total / data.length) : 0;

    const periods: { key: Period; label: string }[] = [
        { key: "day", label: "По днях" },
        { key: "week", label: "По тижнях" },
        { key: "month", label: "По місяцях" },
    ];

    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Динаміка реєстрацій
                </p>
                {/* Перемикач періоду */}
                <div className="flex gap-1">
                    {periods.map(({ key, label }) => (
                        <button
                            key={key}
                            onClick={() => setPeriod(key)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                                period === key
                                    ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                    : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="p-5">
                {/* Міні-статистика */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    {[
                        { label: "Всього", value: total },
                        { label: "Максимум", value: max },
                        { label: "В середньому", value: avg },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-3 rounded-xl border border-white/[0.05] bg-white/[0.02] text-center">
                            <p className="font-black text-lg text-orange-400 leading-none mb-1"
                               style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                {s.value}
                            </p>
                            <p className="text-[10px] text-white/25">{s.label}</p>
                        </div>
                    ))}
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-16 gap-3 text-orange-400">
                        <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                            <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <span className="text-sm">Завантаження...</span>
                    </div>
                ) : data.length === 0 ? (
                    <p className="text-sm text-white/25 text-center py-8">Немає даних</p>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                            <XAxis
                                dataKey="label"
                                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.25)" }}
                                axisLine={false}
                                tickLine={false}
                                interval="preserveStartEnd"
                            />
                            <YAxis
                                tick={{ fontSize: 11, fill: "rgba(255,255,255,0.25)" }}
                                axisLine={false}
                                tickLine={false}
                            />
                            <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(249,115,22,0.15)", strokeWidth: 1 }} />
                            <Line
                                type="monotone"
                                dataKey="count"
                                stroke="#F97316"
                                strokeWidth={2}
                                dot={false}
                                activeDot={{ r: 4, fill: "#F97316", strokeWidth: 0 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>
        </section>
    );
}