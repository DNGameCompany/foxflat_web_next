"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { db } from "@/lib/firebase";

interface CityStats {
    city: string;
    count: number;
}

export default function StatsTab() {
    const [usersByCity, setUsersByCity] = useState<CityStats[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUsersByCity = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Users_Filter"));
                const cityCountMap: Record<string, number> = {};

                querySnapshot.docs.forEach((doc) => {
                    const geoName = doc.data().geo_name as string | undefined;
                    if (geoName) {
                        cityCountMap[geoName] = (cityCountMap[geoName] || 0) + 1;
                    }
                });

                const cityStats: CityStats[] = Object.entries(cityCountMap).map(([city, count]) => ({ city, count }));

                setUsersByCity(cityStats);
            } catch (error) {
                console.error("Помилка завантаження користувачів:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersByCity();
    }, []);

    const exportCSV = () => {
        const csv = Papa.unparse(usersByCity);
        const csvWithBom = "\uFEFF" + csv;
        const blob = new Blob([csvWithBom], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "users_by_city.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const exportExcel = () => {
        const ws = XLSX.utils.json_to_sheet(usersByCity);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "UsersByCity");
        const buf = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        saveAs(new Blob([buf], { type: "application/octet-stream" }), "users_by_city.xlsx");
    };

    if (loading) return <p className="text-white">Завантаження статистики...</p>;

    return (
        <div className="space-y-6">
            <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3 sm:gap-0">
                    <h3 className="text-2xl font-bold text-orange-400">Користувачі по містах</h3>

                    <div className="flex gap-2 sm:gap-3 flex-wrap">
                        <button
                            onClick={exportCSV}
                            className="px-3 py-2 sm:px-5 sm:py-2 bg-neutral-800 text-orange-400 font-semibold border border-orange-400 hover:bg-orange-500 hover:text-black transition-colors duration-200 rounded-lg shadow-sm text-sm sm:text-base"
                        >
                            CSV
                        </button>
                        <button
                            onClick={exportExcel}
                            className="px-3 py-2 sm:px-5 sm:py-2 bg-neutral-800 text-orange-400 font-semibold border border-orange-400 hover:bg-orange-500 hover:text-black transition-colors duration-200 rounded-lg shadow-sm text-sm sm:text-base"
                        >
                            Excel
                        </button>
                    </div>
                </div>

                {usersByCity.length === 0 ? (
                    <p className="text-white">Немає даних для відображення.</p>
                ) : (
                    <>
                        {/* 📊 Графік (тільки на sm і більше) */}
                        <div className="hidden sm:block bg-neutral-800 p-3 sm:p-4 rounded-lg shadow-md mb-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={usersByCity} margin={{ top: 10, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="city" tick={{ fontSize: 12 }} />
                                    <YAxis tick={{ fontSize: 12 }} />
                                    <Tooltip />
                                    <Legend wrapperStyle={{ fontSize: 12 }} />
                                    <Bar dataKey="count" fill="#FFA500" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* 📋 Таблиця */}
                        <div className="bg-neutral-800 p-3 sm:p-4 rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full text-left border-collapse min-w-[300px] sm:min-w-full">
                                <thead>
                                <tr className="border-b border-orange-500/50">
                                    <th className="px-3 sm:px-4 py-2 text-sm sm:text-base">Місто</th>
                                    <th className="px-3 sm:px-4 py-2 text-sm sm:text-base">Кількість користувачів</th>
                                </tr>
                                </thead>
                                <tbody>
                                {usersByCity.map((item, idx) => (
                                    <tr key={idx} className="border-b border-orange-500/20">
                                        <td className="px-3 sm:px-4 py-2 text-sm sm:text-base">{item.city}</td>
                                        <td className="px-3 sm:px-4 py-2 text-sm sm:text-base">{item.count}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
