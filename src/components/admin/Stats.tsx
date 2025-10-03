"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import {db} from "@/lib/firebase";

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
                    const geoName = doc.data().geo_name;
                    if (geoName) {
                        cityCountMap[geoName] = (cityCountMap[geoName] || 0) + 1;
                    }
                });

                const cityStats: CityStats[] = Object.entries(cityCountMap).map(
                    ([city, count]) => ({ city, count })
                );

                setUsersByCity(cityStats);
            } catch (error) {
                console.error("Помилка завантаження користувачів:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsersByCity();
    }, []);

    if (loading) return <p className="text-white">Завантаження статистики...</p>;

    return (
        <div className="space-y-6">
            {/* --- Користувачі по містах --- */}
            <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Користувачі по містах</h3>

                {usersByCity.length === 0 ? (
                    <p className="text-white">Немає даних для відображення.</p>
                ) : (
                    <>
                        {/* Графік */}
                        <div className="bg-neutral-800 p-4 rounded-lg shadow-md mb-6">
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={usersByCity}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="city" />
                                    <YAxis />
                                    <Tooltip />
                                    <Legend />
                                    <Bar dataKey="count" fill="#FFA500" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Таблиця */}
                        <div className="bg-neutral-800 p-4 rounded-lg shadow-md overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                <tr className="border-b border-orange-500/50">
                                    <th className="px-4 py-2">Місто</th>
                                    <th className="px-4 py-2">Кількість користувачів</th>
                                </tr>
                                </thead>
                                <tbody>
                                {usersByCity.map((item, idx) => (
                                    <tr key={idx} className="border-b border-orange-500/20">
                                        <td className="px-4 py-2">{item.city}</td>
                                        <td className="px-4 py-2">{item.count}</td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </section>

            {/* --- Тут можна додавати інші статистики --- */}
            <section className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-6">
                <h3 className="text-2xl font-bold text-orange-400 mb-4">Інші статистики (порожньо)</h3>
                <p className="text-neutral-300">Тут згодом будуть додані інші графіки та метрики.</p>
            </section>
        </div>
    );
}
