"use client";

import { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface TGPost {
    id: string;
    label: string;
    messageUrl: string;
    date: string;
}

export default function TGChannel() {
    const [posts, setPosts] = useState<TGPost[]>([]);
    const [newLabel, setNewLabel] = useState("");
    const [newUrl, setNewUrl] = useState("");
    const [newDate, setNewDate] = useState("");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingLabel, setEditingLabel] = useState("");
    const [editingUrl, setEditingUrl] = useState("");
    const [editingDate, setEditingDate] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "TGChanel"), (snapshot) => {
            const data: TGPost[] = snapshot.docs.map((doc) => ({
                id: doc.id,
                label: doc.data().label,
                messageUrl: doc.data().messageUrl,
                date: doc.data().date || "",
            }));
            setPosts(data);
        });
        return () => unsubscribe();
    }, []);

    const isValidTelegramUrl = (url: string) => {
        const regex = /^https:\/\/t\.me\/FoxFlatNews\/\d+$/;
        return regex.test(url);
    };

    const handleSaveNew = async () => {
        if (!newLabel.trim() || !newUrl.trim() || !newDate.trim()) return;

        if (!isValidTelegramUrl(newUrl)) {
            setError("URL має бути у форматі https://t.me/FoxFlatNews/номер");
            return;
        }

        await addDoc(collection(db, "TGChanel"), {
            label: newLabel,
            messageUrl: newUrl,
            date: newDate,
        });

        setNewLabel("");
        setNewUrl("");
        setNewDate("");
        setError("");
    };

    const handleSaveEdit = async (id: string) => {
        if (!editingLabel.trim() || !editingUrl.trim() || !editingDate.trim()) return;

        if (!isValidTelegramUrl(editingUrl)) {
            setError("URL має бути у форматі https://t.me/FoxFlatNews/номер");
            return;
        }

        const docRef = doc(db, "TGChanel", id);
        await updateDoc(docRef, {
            label: editingLabel,
            messageUrl: editingUrl,
            date: editingDate,
        });

        setEditingId(null);
        setEditingLabel("");
        setEditingUrl("");
        setEditingDate("");
        setError("");
    };

    const handleDelete = async (id: string) => {
        const docRef = doc(db, "TGChanel", id);
        await deleteDoc(docRef);
    };

    return (
        <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
            <h2 className="text-3xl font-bold text-gray-100 text-center mb-4">Телеграм Канал</h2>

            {/* Форма створення */}
            <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row gap-4 items-center">
                <input
                    type="text"
                    placeholder="Назва"
                    value={newLabel}
                    onChange={(e) => setNewLabel(e.target.value)}
                    className="flex-1 min-w-[150px] max-w-[300px] p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                    type="text"
                    placeholder="Посилання"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    className="flex-1 min-w-[200px] max-w-[400px] p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <input
                    type="date"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="flex-1 min-w-[150px] max-w-[200px] p-3 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                />
                <button
                    onClick={handleSaveNew}
                    className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition whitespace-nowrap"
                >
                    Додати
                </button>
            </div>

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            {/* Список постів */}
            {posts.length === 0 ? (
                <p className="text-gray-400 text-center py-10">Пости відсутні</p>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden md:block bg-gray-900 border border-gray-700 rounded-xl overflow-hidden">
                        <div className="grid grid-cols-4 gap-4 p-4 bg-gray-800 font-semibold text-gray-200">
                            <span>Назва</span>
                            <span>Посилання</span>
                            <span>Дата</span>
                            <span className="text-right">Дії</span>
                        </div>
                        <div className="divide-y divide-gray-700">
                            {posts.map((post) => (
                                <div
                                    key={post.id}
                                    className="grid grid-cols-4 gap-4 p-4 items-center hover:bg-gray-800 transition"
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
                                            <input
                                                type="date"
                                                value={editingDate}
                                                onChange={(e) => setEditingDate(e.target.value)}
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
                                            <span className="text-gray-300">{post.date}</span>
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingId(post.id);
                                                        setEditingLabel(post.label);
                                                        setEditingUrl(post.messageUrl);
                                                        setEditingDate(post.date);
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

                    {/* Mobile cards */}
                    <div className="md:hidden flex flex-col gap-4">
                        {posts.map((post) => (
                            <div
                                key={post.id}
                                className="bg-gray-900 border border-gray-700 rounded-xl p-4 flex flex-col gap-2 hover:bg-gray-800 transition"
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
                                        <input
                                            type="date"
                                            value={editingDate}
                                            onChange={(e) => setEditingDate(e.target.value)}
                                            className="p-2 rounded-lg border border-gray-700 bg-gray-900 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
                                        />
                                        <div className="flex gap-2 justify-end mt-2">
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
                                        <span className="text-gray-300">{post.date}</span>
                                        <div className="flex gap-2 justify-end mt-2">
                                            <button
                                                onClick={() => {
                                                    setEditingId(post.id);
                                                    setEditingLabel(post.label);
                                                    setEditingUrl(post.messageUrl);
                                                    setEditingDate(post.date);
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
                </>
            )}
        </div>
    );
}
