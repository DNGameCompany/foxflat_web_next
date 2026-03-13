"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { db } from "@/lib/firebase";

interface CityStats { city: string; count: number; lat: number; lng: number; }

// Координати 22 міст FoxFlat
const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
    "Київ":            { lat: 50.45, lng: 30.52 },
    "Львів":           { lat: 49.84, lng: 24.03 },
    "Одеса":           { lat: 46.48, lng: 30.73 },
    "Харків":          { lat: 49.99, lng: 36.23 },
    "Дніпро":          { lat: 48.46, lng: 35.04 },
    "Запоріжжя":       { lat: 47.84, lng: 35.14 },
    "Вінниця":         { lat: 49.23, lng: 28.47 },
    "Миколаїв":        { lat: 46.97, lng: 32.00 },
    "Херсон":          { lat: 46.64, lng: 32.62 },
    "Чернігів":        { lat: 51.50, lng: 31.29 },
    "Полтава":         { lat: 49.59, lng: 34.54 },
    "Черкаси":         { lat: 49.44, lng: 32.06 },
    "Суми":            { lat: 50.91, lng: 34.80 },
    "Житомир":         { lat: 50.25, lng: 28.66 },
    "Рівне":           { lat: 50.62, lng: 26.25 },
    "Луцьк":           { lat: 50.75, lng: 25.34 },
    "Тернопіль":       { lat: 49.55, lng: 25.59 },
    "Хмельницький":    { lat: 49.42, lng: 26.99 },
    "Кропивницький":   { lat: 48.51, lng: 32.27 },
    "Ужгород":         { lat: 48.62, lng: 22.30 },
    "Івано-Франківськ":{ lat: 48.92, lng: 24.71 },
    "Чернівці":        { lat: 48.29, lng: 25.94 },
};

type ViewMode = "chart" | "table";

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) => {
    if (active && payload?.length) return (
        <div className="px-3 py-2 rounded-xl border border-white/[0.07] bg-[#0f0f0f] text-xs">
            <p className="text-white/40 mb-0.5">{label}</p>
            <p className="text-orange-400 font-bold">{payload[0].value} користувачів</p>
        </div>
    );
    return null;
};


export default function CitiesChart() {
    const [data, setData] = useState<CityStats[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState<ViewMode>("chart");

    useEffect(() => {
        getDocs(collection(db, "Users_Filter"))
            .then((snapshot) => {
                const map: Record<string, number> = {};
                snapshot.docs.forEach((doc) => {
                    const geo = doc.data().geo_name as string | undefined;
                    if (geo) map[geo] = (map[geo] || 0) + 1;
                });
                const result: CityStats[] = Object.entries(map)
                    .map(([city, count]) => ({
                        city, count,
                        lat: CITY_COORDS[city]?.lat ?? 49,
                        lng: CITY_COORDS[city]?.lng ?? 32,
                    }))
                    .sort((a, b) => b.count - a.count);
                setData(result);
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const total = data.reduce((s, c) => s + c.count, 0);

    const exportCSV = () => {
        const blob = new Blob(["\uFEFF" + Papa.unparse(data.map(({ city, count }) => ({ city, count })))], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = "users_by_city.csv";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(data.map(({ city, count }) => ({ city, count })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "UsersByCity");
        saveAs(new Blob([XLSX.write(wb, { bookType: "xlsx", type: "array" })], { type: "application/octet-stream" }), "users_by_city.xlsx");
    };

    if (loading) return (
        <div className="flex items-center justify-center py-16 gap-3 text-orange-400">
            <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-sm">Завантаження...</span>
        </div>
    );

    const views: { key: ViewMode; label: string }[] = [
        { key: "chart", label: "Графік" },
        { key: "table", label: "Таблиця" },
    ];

    return (
        <div className="space-y-4">
            {/* Топ 5 міст */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {data.slice(0, 5).map((c, i) => (
                    <div key={i} className="flex flex-col items-center justify-center p-4 rounded-xl border border-white/[0.07] bg-white/[0.02] text-center">
                        <p className="font-black text-xl text-orange-400 leading-none mb-1"
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>{c.count}</p>
                        <p className="text-[10px] text-white/50 font-medium truncate w-full">{c.city}</p>
                        <p className="text-[9px] text-white/20 mt-0.5">{Math.round(c.count / total * 100)}%</p>
                    </div>
                ))}
            </div>

            {/* Вʼюпорт з перемикачем */}
            <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.05]">
                    {/* Перемикач вигляду */}
                    <div className="flex gap-1">
                        {views.map(({ key, label }) => (
                            <button key={key} onClick={() => setView(key)}
                                    className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all duration-150 ${
                                        view === key
                                            ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                            : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"
                                    }`}>
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Експорт */}
                    <div className="flex gap-2">
                        {[{ label: "CSV", fn: exportCSV }, { label: "Excel", fn: exportExcel }].map(({ label, fn }) => (
                            <button key={label} onClick={fn}
                                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/40 hover:border-orange-500/40 hover:text-orange-400 transition-all duration-150">
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-5">
                    {data.length === 0 ? (
                        <p className="text-sm text-white/25 text-center py-8">Немає даних</p>
                    ) : (
                        <>
                            {view === "chart" && (
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                                        <XAxis dataKey="city" tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                                        <YAxis tick={{ fontSize: 11, fill: "rgba(255,255,255,0.3)" }} axisLine={false} tickLine={false} />
                                        <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(249,115,22,0.05)" }} />
                                        <Bar dataKey="count" fill="#F97316" radius={[6, 6, 0, 0]} maxBarSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}

                            {view === "table" && (
                                <div className="overflow-x-auto">
                                    <table className="w-full min-w-[300px]">
                                        <thead>
                                        <tr className="border-b border-white/[0.05]">
                                            {["#", "Місто", "Користувачів", "Частка"].map((h) => (
                                                <th key={h} className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-3 py-2">{h}</th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {data.map((item, idx) => (
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
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}