"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { db } from "@/lib/firebase";
import RegistrationsChart from "./RegistrationsChart";
import ConversionChart from "./ConversionChart";

interface CityStats {
    city: string;
    count: number;
}

function Section({ title, children, action }: { title: string; children: React.ReactNode; action?: React.ReactNode }) {
    return (
        <section className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    {title}
                </p>
                {action}
            </div>
            <div className="p-5">{children}</div>
        </section>
    );
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) {
        return (
            <div className="px-3 py-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] text-xs">
                <p className="text-white/40 mb-0.5">{label}</p>
                <p className="text-orange-400 font-bold">{payload[0].value} користувачів</p>
            </div>
        );
    }
    return null;
};

export default function StatsTab() {
    const [usersByCity, setUsersByCity] = useState<CityStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getDocs(collection(db, "Users_Filter"))
            .then((snapshot) => {
                const map: Record<string, number> = {};
                snapshot.docs.forEach((doc) => {
                    const geo = doc.data().geo_name as string | undefined;
                    if (geo) map[geo] = (map[geo] || 0) + 1;
                });
                setUsersByCity(
                    Object.entries(map)
                        .map(([city, count]) => ({ city, count }))
                        .sort((a, b) => b.count - a.count)
                );
            })
            .catch((e) => console.error(e))
            .finally(() => setLoading(false));
    }, []);

    const exportCSV = () => {
        const blob = new Blob(["\uFEFF" + Papa.unparse(usersByCity)], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "users_by_city.csv";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(usersByCity);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "UsersByCity");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "users_by_city.xlsx");
    };

    const total = usersByCity.reduce((s, c) => s + c.count, 0);

    if (loading) return (
        <div className="flex items-center gap-3 py-12 justify-center text-orange-400">
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm font-medium">Завантаження статистики...</span>
        </div>
    );

    const exportActions = (
        <div className="flex gap-2">
            {[{ label: "CSV", fn: exportCSV }, { label: "Excel", fn: exportExcel }].map(({ label, fn }) => (
                <button key={label} onClick={fn}
                        className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-orange-500/40 hover:text-orange-400 transition-all duration-150">
                    {label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="space-y-4">
            <RegistrationsChart />
            <ConversionChart />

            {/* Топ міста — картки */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {usersByCity.slice(0, 5).map((c, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] text-center">
                        <p className="font-black text-xl text-orange-400 leading-none mb-1"
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            {c.count}
                        </p>
                        <p className="text-[10px] text-white/30 font-medium truncate w-full text-center">{c.city}</p>
                        <p className="text-[9px] text-white/15 mt-0.5">{Math.round(c.count / total * 100)}%</p>
                    </div>
                ))}
            </div>

            {/* Графік */}
            <Section title="Користувачі по містах" action={exportActions}>
                {usersByCity.length === 0 ? (
                    <p className="text-sm text-white/25 text-center py-8">Немає даних</p>
                ) : (
                    <div className="hidden sm:block">
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={usersByCity} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                <XAxis dataKey="city" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                                <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.05)" }} />
                                <Bar dataKey="count" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                )}
            </Section>

            {/* Таблиця */}
            <Section title="Деталі по містах">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[300px]">
                        <thead>
                        <tr className="border-b border-white/[0.05]">
                            <th className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-3 py-2">#</th>
                            <th className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-3 py-2">Місто</th>
                            <th className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-3 py-2">Користувачів</th>
                            <th className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-3 py-2">Частка</th>
                        </tr>
                        </thead>
                        <tbody>
                        {usersByCity.map((item, idx) => (
                            <tr key={idx} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="px-3 py-2.5 text-xs text-white/20">{idx + 1}</td>
                                <td className="px-3 py-2.5 text-sm text-white/70 font-medium">{item.city}</td>
                                <td className="px-3 py-2.5 text-sm text-orange-400 font-bold">{item.count}</td>
                                <td className="px-3 py-2.5">
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 rounded-full bg-white/[0.05] max-w-[80px]">
                                            <div className="h-full rounded-full bg-orange-500"
                                                 style={{ width: `${Math.round(item.count / total * 100)}%` }} />
                                        </div>
                                        <span className="text-xs text-white/25">{Math.round(item.count / total * 100)}%</span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Section>
        </div>
    );
}