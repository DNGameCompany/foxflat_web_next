"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface User {
    id: string;
    subscription: string;
}

export default function UserList() {
    const router = useRouter();

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
            {/* Заголовок */}
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-300">
                        Користувачі{" "}
                        <span className="text-sm text-gray-500 ml-2">({filteredUsers.length})</span>
                    </h2>
                    <p className="text-sm text-gray-500">Усього: {users.length}</p>
                </div>
            </div>

            {/* Фільтри */}
            <div className="flex flex-wrap gap-4">
                <input
                    type="text"
                    placeholder="Фільтр по User ID"
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="min-w-[150px] p-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
                />

                <div className="relative min-w-[150px]">
                    <select
                        value={filterSubscription}
                        onChange={(e) => setFilterSubscription(e.target.value)}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-gray-200 appearance-none pr-8"
                    >
                        <option value="">Всі підписки</option>
                        <option value="month">Month</option>
                        <option value="trial">Trial</option>
                        <option value="none">None</option>
                    </select>
                    <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        ▼
                    </div>
                </div>
            </div>

            {/* Сітка користувачів */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredUsers.map((user) => (
                    <motion.div
                        key={user.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gray-800 border border-gray-700 rounded-xl p-5 cursor-pointer shadow-sm hover:bg-gray-700/70 hover:border-gray-500 transition-all duration-150"
                        onClick={() => router.push(`/admin/users/${user.id}`)}
                    >
                        <div className="space-y-3">
                            <div>
                                <p className="text-xs text-gray-400">User ID</p>
                                <p className="font-mono text-base text-gray-100 break-all font-medium">
                                    {user.id}
                                </p>
                            </div>

                            <div>
                                <p className="text-xs text-gray-400">Підписка</p>
                                <p className="text-lg font-medium text-gray-200 capitalize">
                                    {user.subscription}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}