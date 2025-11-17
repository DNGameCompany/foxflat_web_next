"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TGPost {
    id: string;
    label: string;
    messageUrl: string;
}

export default function TGChannel() {
    const [posts, setPosts] = useState<TGPost[]>([]);
    const [newLabel, setNewLabel] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingLabel, setEditingLabel] = useState("");
    const [editingUrl, setEditingUrl] = useState("");
    const [error, setError] = useState(""); // для повідомлень про помилки

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "TGChanel"), (snapshot) => {
            const data: TGPost[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                label: doc.data().label,
                messageUrl: doc.data().messageUrl,
            }));
            setPosts(data);
        });
        return () => unsubscribe();
    }, []);

    // Валідація URL
    const isValidTelegramUrl = (url: string) => {
        const regex = /^https:\/\/t\.me\/FoxFlatNews\/\d+$/;
        return regex.test(url);
    };

    const handleSaveNew = async () => {
        if (!newLabel.trim() || !newUrl.trim()) return;

        if (!isValidTelegramUrl(newUrl)) {
            setError("URL має бути у форматі https://t.me/канал/номер");
            return;
        }

        await addDoc(collection(db, "TGChanel"), {
            label: newLabel,
            messageUrl: newUrl,
        });

        setNewLabel("");
        setNewUrl("");
        setError("");
    };

    const handleSaveEdit = async (id: string) => {
        if (!editingLabel.trim() || !editingUrl.trim()) return;

        if (!isValidTelegramUrl(editingUrl)) {
            setError("URL має бути у форматі https://t.me/канал/номер");
            return;
        }

        const docRef = doc(db, "TGChanel", id);
        await updateDoc(docRef, {
            label: editingLabel,
            messageUrl: editingUrl,
        });

        setEditingId(null);
        setEditingLabel("");
        setEditingUrl("");
        setError("");
    };

    const handleDelete = async (id: string) => {
        const docRef = doc(db, "TGChanel", id);
        await deleteDoc(docRef);
    };

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-100 text-center mb-4">Телеграм Канал</h2>

            {/* Форма створення */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-5 flex flex-col sm:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Назва"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                    type="text"
                    placeholder="Посилання"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                    onClick={handleSaveNew}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                >
                    Додати
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Таблиця постів */}
            {posts.length === 0 ? (
                <p className="text-gray-400 text-center py-10">Пости відсутні</p>
            ) : (
                <div className="bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                    {/* Заголовок таблиці */}
                    <div className="grid grid-cols-3 gap-4 p-4 bg-gray-800 font-semibold text-gray-200">
                        <span>Назва</span>
                        <span>Посилання</span>
                        <span className="text-right">Дії</span>
                    </div>
                    <div className="divide-y divide-gray-700">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="grid grid-cols-3 gap-4 p-4 items-center hover:bg-gray-800 transition"
                            >
                                {editingId === post.id ? (
                                    <>
                                        <input
                                            type="text"
                                            value={editingLabel}
                                            onChange={(e) => setEditingLabel(e.target.value)}
                                            placeholder="Назва"
                                            className="p-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                        <input
                                            type="text"
                                            value={editingUrl}
                                            onChange={(e) => setEditingUrl(e.target.value)}
                                            placeholder="Посилання"
                                            className="p-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => handleSaveEdit(post.id)}
                                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                                            >
                                                Зберегти
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <span className="text-gray-100 font-semibold">{post.label}</span>
                                        <a
                                            href={post.messageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-gray-300 underline hover:text-gray-100 break-words"
                                        >
                                            {post.messageUrl}
                                        </a>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(post.id);
                                                    setEditingLabel(post.label);
                                                    setEditingUrl(post.messageUrl);
                                                }}
                                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                                            >
                                                Редагувати
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                                            >
                                                Видалити
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
