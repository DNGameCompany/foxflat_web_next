// src/components/admin/UserTab.tsx
"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import UserList from "./UserList";
import UserDetail from "./UserDetail";

export default function UserTab() {
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

    return (
        <div className="space-y-6">
            {/* Заголовок + кнопка назад */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-orange-400">
                    {selectedUserId ? "Інформація про користувача" : "Список користувачів"}
                </h2>

                {selectedUserId && (
                    <button
                        onClick={() => setSelectedUserId(null)}
                        className="px-6 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-100 rounded-lg transition flex items-center gap-2 text-sm sm:text-base"
                    >
                        ← Назад до списку
                    </button>
                )}
            </div>

            {/* Контент з анімацією */}
            <motion.div
                key={selectedUserId || "list"}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="min-h-[60vh]"
            >
                {selectedUserId ? (
                    <UserDetail userId={selectedUserId} />
                ) : (
                    <UserList onUserSelect={setSelectedUserId} />
                )}
            </motion.div>
        </div>
    );
}