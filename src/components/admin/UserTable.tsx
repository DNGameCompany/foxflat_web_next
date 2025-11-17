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
                        onClick={(event) => event.stopPropagation()}
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
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(false);

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

        const handleResize = () => setIsMobile(window.innerWidth < 640);
        handleResize();
        window.addEventListener("resize", handleResize);

        return () => {
            unsubscribe();
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleAddUser = () => setIsCreateModalOpen(true);

    const handleCreateUser = (newUser: User) => {
        setUsers((prev) => [...prev, newUser]);
        setIsCreateModalOpen(false);
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
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            });

            if (!response.ok) throw new Error("Помилка при видаленні");

            setUsers((prev) => prev.filter((u) => u.id !== userId));
            handleCloseDeleteModal();
        } catch {
            alert("Помилка при видаленні користувача");
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
            {/* HEADER */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-gray-300">
                        Користувачі{" "}
                        <span className="text-sm text-gray-500 ml-2">
                            ({filteredUsers.length})
                        </span>
                    </h2>
                    <p className="text-sm text-gray-500">Усього: {users.length}</p>
                </div>

                {!isMobile && (
                    <div className="flex items-center gap-4">
                        <div className="relative flex bg-gray-700 rounded-full p-1 border border-gray-600 w-[140px]">
                            <button
                                onClick={() => setViewMode("card")}
                                className={`flex-1 text-sm py-1 rounded-full ${
                                    viewMode === "card" ? "bg-gray-300 text-gray-900" : "text-gray-300"
                                }`}
                            >
                                Плитка
                            </button>
                            <button
                                onClick={() => setViewMode("table")}
                                className={`flex-1 text-sm py-1 rounded-full ${
                                    viewMode === "table" ? "bg-gray-300 text-gray-900" : "text-gray-300"
                                }`}
                            >
                                Таблиця
                            </button>

                            <div
                                className={`absolute top-1 left-1 h-[26px] w-[64px] bg-gray-300 rounded-full transition-transform ${
                                    viewMode === "table" ? "translate-x-[70px]" : ""
                                }`}
                            />
                        </div>

                        <button
                            onClick={handleAddUser}
                            className="bg-gray-600 hover:bg-gray-500 text-gray-100 px-4 py-2 rounded"
                        >
                            Додати користувача
                        </button>
                    </div>
                )}
            </div>

            {/* FILTERS */}
            <div className="flex gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Фільтр по User ID"
                    value={filterId}
                    onChange={(event) => setFilterId(event.target.value)}
                    className="w-[150px] p-2 rounded border border-gray-600 bg-gray-800 text-gray-200"
                />

                <div className="relative w-[150px]">
                    <select
                        value={filterSubscription}
                        onChange={(event) => setFilterSubscription(event.target.value)}
                        className="w-full p-2 rounded border border-gray-600 bg-gray-800 text-gray-200 appearance-none pr-8"
                    >
                        <option value="">Всі підписки</option>
                        {subscriptionOptions.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>

                    <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
                        ▼
                    </div>
                </div>
            </div>

            {/* MOBILE CARD VIEW */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUsers.map((user) => {
                    const isExpanded = expandedUserId === user.id;

                    return (
                        <motion.div
                            key={user.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="relative bg-gray-800 border border-gray-700 rounded-xl p-4 cursor-pointer shadow-sm"
                            onClick={() =>
                                setExpandedUserId(isExpanded ? null : user.id)
                            }
                        >
                            {/* Arrow SVG */}
                            <motion.div
                                initial={false}
                                animate={{ rotate: isExpanded ? 90 : 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                className="absolute top-2 right-2 w-5 h-5"
                            >
                                <svg
                                    width="18"
                                    height="10"
                                    viewBox="0 0 24 13"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-full h-full"
                                    style={{ transform: "rotate(90deg)" }}
                                >
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M10.8477 0.45524C11.4841 -0.151747 12.5159 -0.151747 13.1523 0.45524L23.5227 10.3467C24.1591 10.9537 24.1591 11.9378 23.5227 12.5448C22.8863 13.1517 21.8546 13.1517 21.2182 12.5448L12.1398 3.88572H11.8602L2.78183 12.5448C2.14545 13.1517 1.11367 13.1517 0.477287 12.5448C-0.159096 11.9378 -0.159096 10.9537 0.477287 10.3467L10.8477 0.45524Z"
                                        fill="#e5e7eb"
                                    />
                                </svg>
                            </motion.div>

                            {/* BASIC INFO */}
                            <div className="space-y-1">
                                <p className="text-xs text-gray-400">User ID</p>
                                <p className="text-base font-mono text-gray-200 break-all">
                                    {user.id}
                                </p>

                                <p className="text-xs text-gray-400 mt-1">Підписка</p>
                                <p className="text-base text-gray-300">{user.subscription}</p>
                            </div>

                            {/* EXPANDED BUTTONS */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="overflow-hidden mt-4"
                                    >
                                        <div className="flex flex-col gap-2">
                                            <button
                                                className="bg-gray-600 hover:bg-gray-500 text-gray-100 py-2 rounded"
                                                onClick={() => handleEditUser(user)}
                                            >
                                                Редагувати
                                            </button>

                                            <button
                                                className="bg-red-700 hover:bg-red-600 text-gray-100 py-2 rounded"
                                                onClick={() => handleOpenDeleteModal(user.id)}
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* EDIT / CREATE / DELETE MODALS */}
            <EditUserModal
                isOpen={isModalOpen}
                user={editingUser}
                subscriptionOptions={subscriptionOptions}
                onClose={() => setIsModalOpen(false)}
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
