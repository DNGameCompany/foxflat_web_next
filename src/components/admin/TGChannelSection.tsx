"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc, deleteDoc, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

type TGStatus = "published" | "scheduled" | "needs_review" | "blocked";

interface TGPost {
    id: string;
    label: string;
    excerpt: string;
    text: string;
    messageUrl: string;
    date: string;
    status: TGStatus;
    blogSlug?: string;
}

const STATUS_CONFIG: Record<TGStatus, { label: string; color: string }> = {
    published:    { label: "Опубліковано",     color: "text-green-400 bg-green-400/10 border-green-400/20" },
    scheduled:    { label: "Заплановано",       color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    needs_review: { label: "Потрібен перегляд", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
    blocked:      { label: "Заблоковано",       color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

const STATUS_KEYS = Object.keys(STATUS_CONFIG) as TGStatus[];

const EMPTY_POST: Omit<TGPost, "id"> = {
    label: "", excerpt: "", text: "", messageUrl: "",
    date: new Date().toISOString().split("T")[0],
    status: "published",
};

export default function TGChannel() {
    const [posts, setPosts] = useState<TGPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<TGPost | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [filter, setFilter] = useState<TGStatus | "all">("all");
    const [search, setSearch] = useState("");

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "TGChanel"), (snapshot) => {
            const data: TGPost[] = snapshot.docs.map((d) => ({
                id: d.id,
                label:      d.data().label ?? "",
                excerpt:    d.data().excerpt ?? "",
                text:       d.data().text ?? "",
                messageUrl: d.data().messageUrl ?? "",
                date:       d.data().date ?? "",
                status:     d.data().status ?? "published",
                blogSlug:   d.data().blogSlug,
            }));
            data.sort((a, b) => b.date.localeCompare(a.date));
            setPosts(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const openNew  = () => { setEditing({ id: "", ...EMPTY_POST }); setIsNew(true); };
    const openEdit = (p: TGPost) => { setEditing({ ...p }); setIsNew(false); };
    const closeEditor = () => { setEditing(null); setIsNew(false); };

    const handleSave = async () => {
        if (!editing || !editing.label.trim()) return;
        setSaving(true);
        try {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...data } = editing;
            if (isNew) {
                await addDoc(collection(db, "TGChanel"), data);
            } else {
                await updateDoc(doc(db, "TGChanel", id), data);
            }
            closeEditor();
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Видалити пост?")) return;
        setDeleting(id);
        try { await deleteDoc(doc(db, "TGChanel", id)); }
        finally { setDeleting(null); }
    };

    const formatDate = (d: string) =>
        d ? new Date(d).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" }) : "—";

    const filteredPosts = posts.filter((p) => {
        const matchStatus = filter === "all" || p.status === filter;
        const matchSearch = p.label.toLowerCase().includes(search.toLowerCase());
        return matchStatus && matchSearch;
    });

    /* ─── Режим редагування ─── */
    if (editing) return (
        <div className="space-y-4">
            {/* Топ-бар */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={closeEditor} className="text-white/30 hover:text-white/70 transition-colors text-sm">← Назад</button>
                    <span className="text-white/15">|</span>
                    <span className="text-sm text-white/50">{isNew ? "Новий пост" : "Редагувати"}</span>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="text-[10px] font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all disabled:opacity-50"
                >
                    {saving ? "Збереження..." : "Зберегти"}
                </button>
            </div>

            {/* Форма */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

                {/* Ліва колонка — основний контент */}
                <div className="lg:col-span-2 space-y-3">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                        <input
                            value={editing.label}
                            onChange={(e) => setEditing((ed) => ed ? { ...ed, label: e.target.value } : ed)}
                            placeholder="Заголовок посту"
                            className="w-full bg-transparent text-white font-bold text-lg placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-3"
                            style={{ fontFamily: "'Unbounded', sans-serif" }}
                        />
                        <input
                            value={editing.excerpt}
                            onChange={(e) => setEditing((ed) => ed ? { ...ed, excerpt: e.target.value } : ed)}
                            placeholder="Короткий опис"
                            className="w-full bg-transparent text-sm text-white/50 placeholder:text-white/20 outline-none"
                        />
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase mb-3">Текст поста</p>
                        <textarea
                            value={editing.text}
                            onChange={(e) => setEditing((ed) => ed ? { ...ed, text: e.target.value } : ed)}
                            placeholder="Текст що відображається в Telegram пості..."
                            rows={6}
                            className="w-full bg-transparent text-sm text-white/70 placeholder:text-white/20 outline-none resize-none leading-relaxed"
                        />
                    </div>
                </div>

                {/* Права колонка — налаштування */}
                <div className="space-y-3">
                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-4">
                        <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase">Параметри</p>

                        {/* Статус */}
                        <div>
                            <p className="text-[11px] text-white/40 mb-2">Статус</p>
                            <div className="flex flex-col gap-1.5">
                                {STATUS_KEYS.map((s) => (
                                    <button
                                        key={s}
                                        type="button"
                                        onClick={() => setEditing((ed) => ed ? { ...ed, status: s } : ed)}
                                        className={`text-left text-[11px] font-bold px-3 py-2 rounded-lg border transition-all ${editing.status === s ? STATUS_CONFIG[s].color : "border-white/[0.07] text-white/30 hover:text-white/50"}`}
                                    >
                                        {STATUS_CONFIG[s].label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Дата */}
                        <div>
                            <p className="text-[11px] text-white/40 mb-1">Дата</p>
                            <input
                                type="date"
                                value={editing.date}
                                onChange={(e) => setEditing((ed) => ed ? { ...ed, date: e.target.value } : ed)}
                                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-[11px] text-white/50 outline-none focus:border-orange-500/30"
                            />
                        </div>

                        {/* Посилання */}
                        <div>
                            <p className="text-[11px] text-white/40 mb-1">Посилання на пост</p>
                            <input
                                value={editing.messageUrl}
                                onChange={(e) => setEditing((ed) => ed ? { ...ed, messageUrl: e.target.value } : ed)}
                                placeholder="https://t.me/FoxFlatNews/..."
                                className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-[11px] text-white/50 font-mono outline-none focus:border-orange-500/30"
                            />
                        </div>

                        {/* Прив'язка до блогу */}
                        {editing.blogSlug && (
                            <div>
                                <p className="text-[11px] text-white/40 mb-1">Блог-пост</p>
                                <p className="text-[11px] font-mono text-white/30 bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2">
                                    /blog/{editing.blogSlug}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    /* ─── Список ─── */
    return (
        <div className="space-y-4">
            {/* Фільтри + пошук */}
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex flex-wrap gap-1">
                    {([["all", "Всі"], ...STATUS_KEYS.map((k) => [k, STATUS_CONFIG[k].label])] as [string, string][]).map(([key, label]) => {
                        const count = key === "all" ? posts.length : posts.filter((p) => p.status === key).length;
                        const isActive = filter === key;
                        return (
                            <button
                                key={key}
                                onClick={() => setFilter(key as typeof filter)}
                                className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${isActive ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"}`}
                            >
                                {label}
                                <span className={`text-[9px] font-bold px-1 py-0.5 rounded ${isActive ? "bg-orange-500/20 text-orange-400" : "bg-white/[0.05] text-white/20"}`}>
                                    {count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <input
                    type="text"
                    placeholder="Пошук по заголовку..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="ml-auto min-w-[180px] px-3 py-1.5 rounded-lg border border-white/[0.07] bg-white/[0.02] text-white/70 text-xs placeholder-white/20 focus:outline-none focus:border-orange-500/50 transition-colors"
                />

                <button
                    onClick={openNew}
                    className="text-[10px] font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all"
                >
                    + Новий пост
                </button>
            </div>

            {/* Таблиця */}
            {loading ? (
                <div className="flex items-center justify-center py-16 gap-3 text-orange-400">
                    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/>
                        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span className="text-sm">Завантаження...</span>
                </div>
            ) : filteredPosts.length === 0 ? (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] py-16 text-center">
                    <p className="text-white/25 text-sm mb-3">Постів не знайдено</p>
                    <button onClick={openNew} className="text-[10px] font-bold px-4 py-2 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:bg-orange-500/25 transition-all">
                        Створити перший
                    </button>
                </div>
            ) : (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                    <table className="w-full min-w-[600px]">
                        <thead>
                            <tr className="border-b border-white/[0.05]">
                                {["Пост", "Статус", "Дата", "Посилання", "Дії"].map((h) => (
                                    <th key={h} className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-4 py-3">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPosts.map((post) => (
                                <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                    <td className="px-4 py-3 max-w-[280px]">
                                        <p className="text-sm text-white/70 font-medium truncate">{post.label || "—"}</p>
                                        {post.excerpt && (
                                            <p className="text-[11px] text-white/25 truncate mt-0.5">{post.excerpt}</p>
                                        )}
                                        {post.blogSlug && (
                                            <p className="text-[10px] font-mono text-white/15 mt-0.5">/blog/{post.blogSlug}</p>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${STATUS_CONFIG[post.status]?.color ?? "text-white/30 border-white/10"}`}>
                                            {STATUS_CONFIG[post.status]?.label ?? post.status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-white/30 whitespace-nowrap">{formatDate(post.date)}</td>
                                    <td className="px-4 py-3">
                                        {post.messageUrl ? (
                                            <a href={post.messageUrl} target="_blank" rel="noopener noreferrer"
                                               className="w-7 h-7 rounded-full bg-blue-500/15 border border-blue-500/25 flex items-center justify-center hover:bg-blue-500/30 hover:border-blue-500/50 transition-all">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                                                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.19-1.82 6.98-3.02 8.38-3.6 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .38.03.55.17.14.12.18.28.2.45-.02.06-.02.13-.03.2z" fill="#60a5fa"/>
                                                </svg>
                                            </a>
                                        ) : (
                                            <span className="text-[10px] text-white/15">—</span>
                                        )}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => openEdit(post)}
                                                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all"
                                            >
                                                Редагувати
                                            </button>
                                            <button
                                                onClick={() => handleDelete(post.id)}
                                                disabled={deleting === post.id}
                                                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40"
                                            >
                                                {deleting === post.id ? "..." : "Видалити"}
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
