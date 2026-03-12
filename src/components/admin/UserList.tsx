// src/components/admin/UserList.tsx
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
    id: string;
    subscription: string;
}

interface UserListProps {
    onUserSelect: (userId: string) => void;
}

type TabKey = "all" | "subscribed" | "none";

const tabs: { key: TabKey; label: string; filter: (u: User) => boolean }[] = [
    { key: "all",        label: "Всі",           filter: () => true },
    { key: "subscribed", label: "З підпискою",   filter: (u) => u.subscription === "month" },
    { key: "none",       label: "Без підписки",  filter: (u) => u.subscription === "trial" },
];

export default function UserList({ onUserSelect }: UserListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filterId, setFilterId] = useState("");
    const [activeTab, setActiveTab] = useState<TabKey>("all");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
            const usersData: User[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                subscription: doc.data().active_subscription?.sub_name || "none",
            }));
            setUsers(usersData);
        });
        return () => unsubscribe();
    }, []);

    const currentTab = tabs.find((t) => t.key === activeTab)!;
    const filteredUsers = users.filter(
        (u) => u.id.includes(filterId) && currentTab.filter(u)
    );

    return (
        <div className="space-y-6">

            {/* Таби */}
            <div className="flex flex-wrap items-center gap-2">
                {tabs.map((tab) => {
                    const count = users.filter(tab.filter).length;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 border ${
                                isActive
                                    ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                    : "bg-white/[0.02] border-white/[0.07] text-white/35 hover:text-white/60 hover:border-white/15"
                            }`}
                        >
                            {tab.label}
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                                isActive ? "bg-orange-500/20 text-orange-400" : "bg-white/[0.05] text-white/25"
                            }`}>
                                {count}
                            </span>
                        </button>
                    );
                })}

                {/* ID фільтр */}
                <input
                    type="text"
                    placeholder="Пошук по ID..."
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="ml-auto min-w-[180px] px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/70 text-xs placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
                />
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