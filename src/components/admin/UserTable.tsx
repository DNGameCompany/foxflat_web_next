"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";

interface User {
    id: string;
    subscription: string;
}

const subscriptionOptions = ["month", "trial"];

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [filterId, setFilterId] = useState("");
    const [filterSubscription, setFilterSubscription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"card" | "table">("card");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "Users"), (snapshot) => {
            const usersData: User[] = snapshot.docs.map((doc) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    subscription: data.active_subscription?.sub_name || "none",
                };
            });
            setUsers(usersData);
        });

        return () => unsubscribe();
    }, []);

    const handleAddUser = () => setIsCreateModalOpen(true);
    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleSave = (newSubscription: string) => {
        if (!editingUser) return;
        setUsers((prev) =>
            prev.map((u) =>
                u.id === editingUser.id ? { ...u, subscription: newSubscription } : u
            )
        );
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingUser(null);
    };

    const handleCreateUser = (newUser: User) => {
        setUsers((prev) => [...prev, newUser]);
        setIsCreateModalOpen(false);
    };

    const filteredUsers = users.filter((user) => {
        const matchesId = user.id.includes(filterId);
        const matchesSubscription = filterSubscription
            ? user.subscription === filterSubscription
            : true;
        return matchesId && matchesSubscription;
    });

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-orange-400">Користувачі</h2>

                <div className="flex items-center gap-4">
                    {/* Перемикач виду */}
                    <div className="relative flex bg-neutral-800 rounded-full p-1 border border-orange-500/30 w-[140px]">
                        <button
                            onClick={() => setViewMode("card")}
                            className={`flex-1 text-sm py-1 rounded-full z-10 transition-colors duration-200 ${
                                viewMode === "card" ? "text-black" : "text-white"
                            }`}
                        >
                            Плитка
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`flex-1 text-sm py-1 rounded-full z-10 transition-colors duration-200 ${
                                viewMode === "table" ? "text-black" : "text-white"
                            }`}
                        >
                            Таблиця
                        </button>
                        <div
                            className={`absolute top-1 left-1 h-[26px] w-[64px] rounded-full bg-orange-400 transition-transform duration-300 ease-in-out ${
                                viewMode === "table" ? "translate-x-[70px]" : "translate-x-0"
                            }`}
                        />
                    </div>

                    <button
                        onClick={handleAddUser}
                        className="bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-400 hover:to-orange-300 text-black font-semibold px-4 py-2 rounded transition"
                    >
                        Додати користувача
                    </button>
                </div>
            </div>

            {/* Фільтри */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Фільтр по User ID"
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="w-[150px] p-2 rounded border border-orange-400 bg-neutral-900 text-white"
                />
                <div className="relative w-[150px]">
                    <select
                        value={filterSubscription}
                        onChange={(e) => setFilterSubscription(e.target.value)}
                        className="w-full p-2 rounded border border-orange-400 bg-neutral-900 text-white appearance-none pr-8"
                    >
                        <option value="">Всі підписки</option>
                        {subscriptionOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-orange-400">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                        >
                            <path
                                fillRule="evenodd"
                                d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.27a.75.75 0 01-.02-1.06z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                </div>
            </div>

            {/* Відображення залежно від viewMode */}
            {viewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-neutral-900/70 backdrop-blur-md border border-orange-500/20 rounded-xl p-4 flex flex-col justify-between shadow hover:shadow-orange-500/20 transition"
                        >
                            <div className="space-y-2">
                                <p className="text-sm text-neutral-400">User ID</p>
                                <p className="text-lg font-mono text-orange-300 break-all">{user.id}</p>

                                <p className="text-sm text-neutral-400 mt-2">Статус підписки</p>
                                <p className="text-base text-white">{user.subscription}</p>
                            </div>
                            <button
                                onClick={() => handleEditUser(user)}
                                className="mt-4 bg-orange-500 hover:bg-orange-400 text-black font-medium py-2 rounded transition"
                            >
                                Редагувати
                            </button>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-white bg-neutral-900/70 rounded-xl border border-orange-500/20">
                        <thead>
                        <tr className="border-b border-orange-500/50">
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">Статус підписки</th>
                            <th className="px-6 py-3">Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-orange-500/20 hover:bg-orange-500/10 transition"
                            >
                                <td className="px-6 py-4 font-mono break-all">{user.id}</td>
                                <td className="px-6 py-4">{user.subscription}</td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="bg-orange-500 hover:bg-orange-400 text-black font-medium py-1 px-3 rounded transition"
                                    >
                                        Редагувати
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            <EditUserModal
                isOpen={isModalOpen}
                user={editingUser}
                subscriptionOptions={subscriptionOptions}
                onClose={handleCloseModal}
                onSave={handleSave}
            />

            <CreateUserModal
                isOpen={isCreateModalOpen}
                subscriptionOptions={subscriptionOptions}
                onClose={() => setIsCreateModalOpen(false)}
                onCreate={handleCreateUser}
            />
        </div>
    );
}
