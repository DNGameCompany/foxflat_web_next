"use client";

import React, { useState } from "react";

export default function MessageTab() {
    const [sendToAll, setSendToAll] = useState(false);
    const [userIds, setUserIds] = useState<string[]>([""]);
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleUserIdChange = (index: number, value: string) => {
        const newUserIds = [...userIds];
        newUserIds[index] = value;
        setUserIds(newUserIds);
    };

    const addUserIdField = () => setUserIds((prev) => [...prev, ""]);
    const removeUserIdField = (index: number) => setUserIds((prev) => prev.filter((_, i) => i !== index));

    const handleSendMessage = async () => {
        if (!sendToAll && userIds.some((id) => id.trim() === "")) {
            alert("Будь ласка, введіть всі User ID або видаліть порожні поля");
            return;
        }
        if (!message.trim()) {
            alert("Будь ласка, введіть текст повідомлення");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch("https://api.foxflat.com.ua/send-message", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sendToAll,
                    userIds: sendToAll ? [] : userIds,
                    message,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(`Помилка: ${(data as { error?: string }).error || "Щось пішло не так"}`);
            } else {
                alert((data as { message: string }).message);
                setMessage("");
                if (!sendToAll) setUserIds([""]);
            }
        } catch (err) {
            let errorMessage = "Помилка під час відправки";
            if (err instanceof Error) {
                errorMessage = err.message;
            }
            alert(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 space-y-6 bg-neutral-900 rounded-lg shadow-md text-white w-full max-w-full sm:max-w-xl">
            <h2 className="text-2xl font-bold text-orange-400">Повідомлення</h2>

            <div className="space-y-2">
                <label className="inline-flex items-center space-x-2">
                    <input
                        type="checkbox"
                        checked={sendToAll}
                        onChange={(e) => setSendToAll(e.target.checked)}
                        className="form-checkbox h-5 w-5 text-orange-500"
                    />
                    <span className="text-sm sm:text-base">Всім користувачам</span>
                </label>
            </div>

            {!sendToAll && (
                <div className="space-y-3">
                    <label className="font-semibold text-sm sm:text-base">User ID отримувачів</label>
                    {userIds.map((id, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={id}
                                onChange={(e) => handleUserIdChange(idx, e.target.value)}
                                placeholder="Введіть User ID"
                                className="flex-grow p-2 rounded border border-orange-400 bg-neutral-800 text-white text-sm sm:text-base"
                            />
                            {userIds.length > 1 && (
                                <button
                                    onClick={() => removeUserIdField(idx)}
                                    className="px-2 py-1 bg-red-600 rounded hover:bg-red-500 transition text-sm"
                                    aria-label="Видалити отримувача"
                                >
                                    ✖
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        onClick={addUserIdField}
                        className="mt-2 inline-block px-3 sm:px-4 py-2 bg-orange-500 rounded hover:bg-orange-400 transition font-semibold text-sm sm:text-base"
                    >
                        ➕ Додати отримувача
                    </button>
                </div>
            )}

            {sendToAll && (
                <div className="opacity-50 pointer-events-none">
                    <label className="font-semibold text-sm sm:text-base">User ID отримувачів</label>
                    <input
                        type="text"
                        disabled
                        value=""
                        placeholder="User ID недоступний при виборі всім користувачам"
                        className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white cursor-not-allowed text-sm sm:text-base"
                    />
                </div>
            )}

            <div className="space-y-2">
                <label className="font-semibold text-sm sm:text-base">Текст повідомлення</label>
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Введіть текст повідомлення..."
                    className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white resize-none h-32 sm:h-40 text-sm sm:text-base"
                />
            </div>

            <button
                onClick={handleSendMessage}
                disabled={loading}
                className="mt-4 w-full bg-orange-500 hover:bg-orange-400 text-black font-semibold py-2 rounded transition disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
                {loading ? "Відправляємо..." : "Відправити повідомлення"}
            </button>
        </div>
    );
}
