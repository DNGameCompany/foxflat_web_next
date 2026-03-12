// src/components/admin/UserList.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
    id: string;
    subscription: string;
    isActive: boolean;
}

interface UserListProps {
    onUserSelect: (userId: string) => void;
}

const statCards = (users: User[]) => [
    {
        label: "Всього",
        value: users.length,
        color: "text-white",
        border: "border-white/10",
    },
    {
        label: "З підпискою",
        value: users.filter((u) => u.subscription !== "none").length,
        color: "text-orange-400",
        border: "border-orange-500/20",
    },
    {
        label: "Без підписки",
        value: users.filter((u) => u.subscription === "none").length,
        color: "text-white/50",
        border: "border-white/10",
    },
    {
        label: "Активних",
        value: users.filter((u) => u.isActive).length,
        color: "text-green-400",
        border: "border-green-500/20",
    },
    {
        label: "Неактивних",
        value: users.filter((u) => !u.isActive).length,
        color: "text-red-400",
        border: "border-red-500/20",
    },
];

export default function UserList({ onUserSelect }: UserListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filterId, setFilterId] = useState("");
    const [filterSubscription, setFilterSubscription] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
            const usersData: User[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    subscription: data.active_subscription?.sub_name || "none",
                    isActive: data.is_active === true,
                };
            });
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesId = user.id.includes(filterId);
        const matchesSubscription = filterSubscription
            ? user.subscription === filterSubscription
            : true;
        return matchesId && matchesSubscription;
    });

    const stats = statCards(users);

    return (
        <div className="space-y-6">

            {/* Статистика */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {stats.map((s, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex flex-col items-center justify-center p-4 rounded-xl border ${s.border} bg-white/[0.02] text-center`}
                    >
                        <p className={`font-black text-2xl leading-none mb-1 ${s.color}`}
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>
                            {s.value}
                        </p>
                        <p className="text-xs text-white/30 font-medium">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Фільтри */}
            <div className="flex flex-wrap gap-3">
                <input
                    type="text"
                    placeholder="Фільтр по User ID"
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="min-w-[180px] px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-200 text-sm placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
                <div className="relative min-w-[160px]">
                    <select
                        value={filterSubscription}
                        onChange={(e) => setFilterSubscription(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] text-gray-200 text-sm appearance-none pr-8 focus:outline-none focus:border-orange-500/50 transition-colors"
                    >
                        <option value="">Всі підписки</option>
                        <option value="month">Month</option>
                        <option value="trial">Trial</option>
                        <option value="none">None</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-white/30 text-xs">▼</div>
                </div>

                {/* Лічильник результатів */}
                <div className="flex items-center px-4 py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02]">
                    <span className="text-xs text-white/30">
                        Показано: <span className="text-white/60 font-semibold">{filteredUsers.length}</span>
                    </span>
                </div>
            </div>

            {/* Сітка користувачів */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredUsers.map((user, i) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="group relative flex flex-col gap-3 p-5 rounded-xl border border-white/[0.07] bg-white/[0.02] cursor-pointer hover:border-orange-500/30 hover:bg-white/[0.04] transition-all duration-150 active:scale-[0.98]"
                        onClick={() => onUserSelect(user.id)}
                    >
                        {/* Статус індикатор */}
                        <div className="absolute top-4 right-4">
                            <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-400' : 'bg-white/20'}`} />
                        </div>

                        <div>
                            <p className="text-[10px] text-white/25 uppercase tracking-widest mb-1">User ID</p>
                            <p className="font-mono text-sm text-white/80 break-all font-medium leading-snug">
                                {user.id}
                            </p>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
                            <div>
                                <p className="text-[10px] text-white/25 uppercase tracking-widest mb-0.5">Підписка</p>
                                <p className={`text-sm font-semibold capitalize ${
                                    user.subscription === 'none' ? 'text-white/30' : 'text-orange-400'
                                }`}>
                                    {user.subscription}
                                </p>
                            </div>
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none"
                                 className="text-white/10 group-hover:text-orange-500/40 transition-colors">
                                <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-white/20 text-sm">
                    Користувачів за цими фільтрами не знайдено
                </div>
            )}
        </div>
    );
}