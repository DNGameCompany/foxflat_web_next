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

export default function UserList({ onUserSelect }: UserListProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [filterId, setFilterId] = useState("");
    const [filterSubscription, setFilterSubscription] = useState("");

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

    const filteredUsers = users.filter((user) => {
        const matchesId = user.id.includes(filterId);
        const matchesSubscription = filterSubscription
            ? user.subscription === filterSubscription
            : true;
        return matchesId && matchesSubscription;
    });

    return (
        <div className="space-y-6">
            {/* Фільтри */}
            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Фільтр по User ID"
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="min-w-[150px] p-2 rounded border border-gray-600 bg-gray-800 text-gray-200 focus:outline-none focus:border-orange-500"
                />

                <div className="relative min-w-[150px]">
                    <select
                        value={filterSubscription}
                        onChange={(e) => setFilterSubscription(e.target.value)}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-gray-200 appearance-none pr-8 focus:outline-none focus:border-orange-500"
                    >
                        <option value="">Всі підписки</option>
                        <option value="month">Month</option>
                        <option value="trial">Trial</option>
                        <option value="none">None</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">▼</div>
                </div>
            </div>

            {/* Сітка користувачів */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer shadow-sm hover:bg-gray-700/70 hover:border-orange-500/50 transition-all duration-150 active:scale-[0.98]"
                        onClick={() => onUserSelect(user.id)}
                    >
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-400">User ID</p>
                                <p className="font-mono text-sm sm:text-base text-gray-100 break-all font-medium">
                                    {user.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Підписка</p>
                                <p className="text-base sm:text-lg font-medium text-gray-200 capitalize">
                                    {user.subscription}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                    Користувачів за цими фільтрами не знайдено
                </div>
            )}
        </div>
    );
}