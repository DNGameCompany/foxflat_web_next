"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import { motion } from "framer-motion";

interface Blog {
    id: string;
    title: string;
    seoName: string;
    content: string;
    createdAt: Date;
}

export default function BlogsTab() {
    const [blogs, setBlogs] = useState<Blog[]>([
        {
            id: "1",
            title: "Перший блог",
            seoName: "pershiy-blog",
            content: "Це текст першого блогу.",
            createdAt: new Date(),
        },
        {
            id: "2",
            title: "Другий блог",
            seoName: "drugiy-blog",
            content: "Контент другого блогу.",
            createdAt: new Date(),
        },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newSeoName, setNewSeoName] = useState("");
    const [newContent, setNewContent] = useState("");

    const [editBlogId, setEditBlogId] = useState<string | null>(null);

    const openModal = (blog?: Blog) => {
        if (blog) {
            setEditBlogId(blog.id);
            setNewTitle(blog.title);
            setNewSeoName(blog.seoName);
            setNewContent(blog.content);
        } else {
            setEditBlogId(null);
            setNewTitle("");
            setNewSeoName("");
            setNewContent("");
        }
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditBlogId(null);
    };

    const handleSave = () => {
        if (!newTitle.trim() || !newSeoName.trim() || !newContent.trim()) {
            alert("Будь ласка, заповніть всі поля.");
            return;
        }

        if (editBlogId) {
            setBlogs((prev) =>
                prev.map((b) =>
                    b.id === editBlogId
                        ? { ...b, title: newTitle, seoName: newSeoName, content: newContent }
                        : b
                )
            );
        } else {
            const newBlog: Blog = {
                id: Date.now().toString(),
                title: newTitle,
                seoName: newSeoName,
                content: newContent,
                createdAt: new Date(),
            };
            setBlogs((prev) => [newBlog, ...prev]);
        }

        closeModal();
    };

    const handleDelete = (id: string) => {
        if (confirm("Ви впевнені, що хочете видалити блог?")) {
            setBlogs((prev) => prev.filter((b) => b.id !== id));
        }
    };

    return (
        <div className="p-4 sm:p-6 bg-neutral-900 rounded-lg shadow-md max-w-5xl mx-auto text-white space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h2 className="text-2xl font-bold text-orange-400">Блоги</h2>
                <button
                    onClick={() => openModal()}
                    className="bg-orange-500 hover:bg-orange-400 text-black font-semibold px-4 py-2 rounded transition"
                >
                    ➕ Створити блог
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                    <thead>
                    <tr className="text-orange-300 border-b border-orange-500/30">
                        <th className="py-2 px-2 sm:px-4">Дата</th>
                        <th className="py-2 px-2 sm:px-4">Назва</th>
                        <th className="py-2 px-2 sm:px-4">SEO Name</th>
                        <th className="py-2 px-2 sm:px-4 text-right">Дії</th>
                    </tr>
                    </thead>
                    <tbody>
                    {blogs.map((blog) => (
                        <motion.tr
                            key={blog.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="border-b border-orange-500/10 hover:bg-neutral-800/50"
                        >
                            <td className="py-1 px-2 sm:px-4">{format(blog.createdAt, "dd.MM.yyyy HH:mm")}</td>
                            <td className="py-1 px-2 sm:px-4">{blog.title}</td>
                            <td className="py-1 px-2 sm:px-4">{blog.seoName}</td>
                            <td className="py-1 px-2 sm:px-4 flex justify-end gap-2">
                                <button
                                    onClick={() => openModal(blog)}
                                    className="px-2 sm:px-3 py-1 rounded bg-orange-500 hover:bg-orange-400 text-black transition text-sm"
                                >
                                    ✏️ Редагувати
                                </button>
                                <button
                                    onClick={() => handleDelete(blog.id)}
                                    className="px-2 sm:px-3 py-1 rounded bg-red-600 hover:bg-red-500 text-white transition text-sm"
                                >
                                    🗑️ Видалити
                                </button>
                            </td>
                        </motion.tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Модалка створення/редагування */}
            {isModalOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-4"
                    onClick={closeModal}
                >
                    <div
                        className="bg-neutral-900 p-4 sm:p-6 rounded-lg max-w-full sm:max-w-lg w-full"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl sm:text-2xl font-bold text-orange-400 mb-4">
                            {editBlogId ? "Редагувати блог" : "Створити новий блог"}
                        </h3>

                        <input
                            type="text"
                            placeholder="Назва блогу"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white mb-4 text-sm sm:text-base"
                        />

                        <input
                            type="text"
                            placeholder="SEO Name"
                            value={newSeoName}
                            onChange={(e) => setNewSeoName(e.target.value)}
                            className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white mb-4 text-sm sm:text-base"
                        />

                        <textarea
                            placeholder="Контент блогу"
                            value={newContent}
                            onChange={(e) => setNewContent(e.target.value)}
                            className="w-full p-2 rounded border border-orange-400 bg-neutral-800 text-white resize-none h-32 text-sm sm:text-base"
                        />

                        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row justify-end gap-2">
                            <button
                                onClick={closeModal}
                                className="px-4 py-2 rounded bg-red-600 hover:bg-red-500 transition font-semibold text-sm sm:text-base"
                            >
                                Відмінити
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-4 py-2 rounded bg-orange-500 hover:bg-orange-400 transition font-semibold text-sm sm:text-base"
                            >
                                {editBlogId ? "Зберегти зміни" : "Створити"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
