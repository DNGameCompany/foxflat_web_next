"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface EditUserModalProps {
    isOpen: boolean;
    user: { id: string; subscription: string } | null;
    subscriptionOptions: string[];
    onClose: () => void;
    onSave: (newSubscription: string) => void;
}

export default function EditUserModal({
                                          isOpen,
                                          user,
                                          subscriptionOptions,
                                          onClose,
                                          onSave,
                                      }: EditUserModalProps) {
    const [editedSubscription, setEditedSubscription] = React.useState<string>(
        user?.subscription || ""
    );

    React.useEffect(() => {
        if (user) {
            setEditedSubscription(user.subscription);
        }
    }, [user]);

    if (!isOpen || !user) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-neutral-900 rounded-lg p-6 w-80 max-w-full"
                >
                    <h3 className="text-xl font-bold mb-4 text-orange-400">
                        Редагування користувача
                    </h3>
                    <p className="mb-2 text-neutral-400">User ID:</p>
                    <p className="mb-4 font-mono text-orange-300 break-all">{user.id}</p>

                    <label className="block mb-2 text-neutral-400">Статус підписки</label>
                    <div className="relative">
                        <select
                            value={editedSubscription}
                            onChange={(e) => setEditedSubscription(e.target.value)}
                            className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white appearance-none pr-8"
                        >
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

                    <div className="mt-6 flex justify-end gap-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white transition"
                        >
                            Відміна
                        </button>
                        <button
                            onClick={() => onSave(editedSubscription)}
                            className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-400 text-black font-semibold transition"
                        >
                            Зберегти
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
