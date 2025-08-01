"use client";

import React, { useState } from "react";

export default function MessageTab() {
    const [sendToAll, setSendToAll] = useState(false);
    const [userIds, setUserIds] = useState<string[]>([""]);
    const [message, setMessage] = useState("");

    const handleUserIdChange = (index: number, value: string) => {
        const newUserIds = [...userIds];
        newUserIds[index] = value;
        setUserIds(newUserIds);
    };

    const addUserIdField = () => {
        setUserIds((prev) => [...prev, ""]);
    };

    const removeUserIdField = (index: number) => {
        setUserIds((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className="p-4 space-y-6 bg-neutral-900 rounded-lg shadow-md text-white max-w-xl">
            <h2 className="text-2xl font-bold text-orange-400">Повідомлення</h2>

            <div className="space-y-2">
                <label className="inline-flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={sendToAll}
                        onChange={(e) => setSendToAll(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-orange-500"
                    />
                    <span>Всім користувачам</span>
                </label>
            </div>

            {!sendToAll && (
                <div className="space-y-4">
                    <label className="font-semibold">User ID отримувачів</label>
                    {userIds.map((id, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => handleUserIdChange(idx, e.target.value)}
                                placeholder="Введіть User ID"
                                className="flex-grow p-2 rounded border border-orange-400 bg-neutral-800 text-white"
                            />
                            {userIds.length > 1 && (
                                <button
                                    onClick={() => removeUserIdField(idx)}
                                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 transition"
                                    aria-label="Видалити отримувача"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addUserIdField}
                        className="mt-2 inline-block px-4 py-2 bg-orange-500 rounded hover:bg-orange-400 transition font-semibold"
                    >
                        ➕ Додати отримувача
                    </button>
                </div>
            )}

            {sendToAll && (
                <div className="opacity-50 pointer-events-none">
                    <label className="font-semibold">User ID отримувачів</label>
                    <input
                        type="text"
                        disabled
                        value=""
                        placeholder="User ID недоступний при виборі всім користувачам"
                        className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white cursor-not-allowed"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="font-semibold">Текст повідомлення</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введіть текст повідомлення..."
                    className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white resize-none h-40"
                />
            </div>

            <button
                onClick={() => {
                    if (!sendToAll && userIds.some((id) => id.trim() === "")) {
                        alert("Будь ласка, введіть всі User ID або видаліть порожні поля");
                        return;
                    }
                    if (!message.trim()) {
                        alert("Будь ласка, введіть текст повідомлення");
                        return;
                    }
                    // Тут можна додати логіку відправки повідомлення
                    alert("Повідомлення готове до відправки!");
                }}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold py-2 rounded transition"
            >
                Відправити повідомлення
            </button>
        </div>
    );
}
