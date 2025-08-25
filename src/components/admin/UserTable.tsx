"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import EditUserModal from "./EditUserModal";
import CreateUserModal from "./CreateUserModal";

interface User {
    id: string;
    subscription: string;
}

const subscriptionOptions = ["month", "trial"];

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    userId: string;
    onClose: () => void;
    onConfirm: (userId: string) => Promise<void>;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
                                                                             isOpen,
                                                                             userId,
                                                                             onClose,
                                                                             onConfirm,
                                                                         }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="bg-gray-800 rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl border border-gray-700"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-lg font-semibold text-gray-100 mb-4">
                            Підтвердження видалення
                        </h3>
                        <p className="text-gray-300 mb-6">
                            Ви впевнені, що хочете видалити користувача з ID{" "}
                            <span className="font-mono text-gray-100">{userId}</span>?
                            Цю дію неможливо скасувати.
                        </p>
                        <div className="flex gap-4 justify-end">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-gray-100 rounded transition"
                            >
                                Скасувати
                            </button>
                            <button
                                onClick={() => onConfirm(userId)}
                                className="px-4 py-2 bg-red-700 hover:bg-red-600 text-gray-100 rounded transition"
                            >
                                Видалити
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default function UserList() {
    const [users, setUsers] = useState<User[]>([]);
    const [filterId, setFilterId] = useState("");
    const [filterSubscription, setFilterSubscription] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<"card" | "table">("card");
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

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

    const handleOpenDeleteModal = (userId: string) => {
        setDeletingUserId(userId);
        setIsDeleteModalOpen(true);
    };

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setDeletingUserId(null);
    };

    const handleDeleteUser = async (userId: string) => {
        try {
            const response = await fetch(`https://api.foxflat.com.ua/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    // Додайте авторизаційні заголовки, якщо потрібні
                    // 'Authorization': `Bearer ${yourToken}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Помилка при видаленні користувача');
            }

            setUsers((prev) => prev.filter((u) => u.id !== userId));
            handleCloseDeleteModal();
        } catch (error) {
            alert("Помилка при видаленні користувача");
            console.error(error);
            handleCloseDeleteModal();
        }
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
                <div>
                    <h2 className="text-xl font-semibold text-gray-300">
                        Користувачі{" "}
                        <span className="text-sm text-gray-500 ml-2">({filteredUsers.length})</span>
                    </h2>
                    <p className="text-sm text-gray-500">Усього: {users.length}</p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative flex bg-gray-700 rounded-full p-1 border border-gray-600 w-[140px]">
                        <button
                            onClick={() => setViewMode("card")}
                            className={`flex-1 text-sm py-1 rounded-full z-10 transition-colors duration-200 ${
                                viewMode === "card" ? "bg-gray-300 text-gray-900" : "text-gray-300"
                            }`}
                        >
                            Плитка
                        </button>
                        <button
                            onClick={() => setViewMode("table")}
                            className={`flex-1 text-sm py-1 rounded-full z-10 transition-colors duration-200 ${
                                viewMode === "table" ? "bg-gray-300 text-gray-900" : "text-gray-300"
                            }`}
                        >
                            Таблиця
                        </button>
                        <div
                            className={`absolute top-1 left-1 h-[26px] w-[64px] rounded-full bg-gray-300 transition-transform duration-300 ease-in-out ${
                                viewMode === "table" ? "translate-x-[70px]" : "translate-x-0"
                            }`}
                        />
                    </div>

                    <button
                        onClick={handleAddUser}
                        className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-semibold px-4 py-2 rounded transition"
                    >
                        Додати користувача
                    </button>
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Фільтр по User ID"
                    value={filterId}
                    onChange={(e) => setFilterId(e.target.value)}
                    className="w-[150px] p-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
                />
                <div className="relative w-[150px]">
                    <select
                        value={filterSubscription}
                        onChange={(e) => setFilterSubscription(e.target.value)}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-gray-200 appearance-none pr-8"
                    >
                        <option value="">Всі підписки</option>
                        {subscriptionOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400">
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

            {viewMode === "card" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredUsers.map((user) => (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex flex-col justify-between shadow-sm hover:shadow-md transition"
                        >
                            <div className="space-y-2">
                                <p className="text-sm text-gray-400">User ID</p>
                                <p className="text-lg font-mono text-gray-200 break-all">{user.id}</p>
                                <p className="text-sm text-gray-400 mt-2">Статус підписки</p>
                                <p className="text-base text-gray-300">{user.subscription}</p>
                            </div>
                            <div className="flex gap-2 mt-4">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="flex-1 bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium py-2 rounded transition"
                                >
                                    Редагувати
                                </button>
                                <button
                                    onClick={() => handleOpenDeleteModal(user.id)}
                                    className="flex-1 bg-red-700 hover:bg-red-600 text-gray-100 font-medium py-2 rounded transition"
                                >
                                    Видалити
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-gray-300 bg-gray-800 rounded-xl border border-gray-700">
                        <thead>
                        <tr className="border-b border-gray-700">
                            <th className="px-6 py-3">User ID</th>
                            <th className="px-6 py-3">Статус підписки</th>
                            <th className="px-6 py-3">Дії</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filteredUsers.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-gray-700 hover:bg-gray-700 transition"
                            >
                                <td className="px-6 py-4 font-mono break-all">{user.id}</td>
                                <td className="px-6 py-4">{user.subscription}</td>
                                <td className="px-6 py-4 flex gap-2">
                                    <button
                                        onClick={() => handleEditUser(user)}
                                        className="bg-gray-600 hover:bg-gray-500 text-gray-100 font-medium py-1 px-3 rounded transition"
                                    >
                                        Редагувати
                                    </button>
                                    <button
                                        onClick={() => handleOpenDeleteModal(user.id)}
                                        className="bg-red-700 hover:bg-red-600 text-gray-100 font-medium py-1 px-3 rounded transition"
                                    >
                                        Видалити
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

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                userId={deletingUserId || ""}
                onClose={handleCloseDeleteModal}
                onConfirm={handleDeleteUser}
            />
        </div>
    );
}