"use client";

import { useEffect, useState, useCallback } from "react";
import TipTapEditor from "@/src/components/admin/TipTapEditor/TipTapEditor";

const API_URL = "https://api.foxflat.com.ua";

type Category = "tips" | "news" | "guide";

interface BlogPost {
    id: string;
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: Category;
    published: boolean;
    created_at: string;
    updated_at: string;
    cover_image?: string;
    read_time: number;
}

const CATEGORY_CONFIG: Record<Category, { label: string; color: string }> = {
    tips:  { label: "Поради",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    guide: { label: "Гайд",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
};

const EMPTY_POST: Omit<BlogPost, "id"> = {
    slug: "", title: "", excerpt: "", content: "",
    category: "tips", published: false,
    created_at: "", updated_at: "", read_time: 5,
};

function slugify(text: string) {
    const map: Record<string, string> = {
        "а":"a","б":"b","в":"v","г":"h","д":"d","е":"e","є":"ye","ж":"zh","з":"z",
        "и":"y","і":"i","ї":"yi","й":"y","к":"k","л":"l","м":"m","н":"n","о":"o",
        "п":"p","р":"r","с":"s","т":"t","у":"u","ф":"f","х":"kh","ц":"ts","ч":"ch",
        "ш":"sh","щ":"shch","ю":"yu","я":"ya","ґ":"g","ё":"yo",
    };
    return text.toLowerCase()
        .split("").map((c) => map[c] ?? c).join("")
        .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function MarkdownPreview({ content }: { content: string }) {
    const html = content
        .replace(/^### (.+)$/gm, '<h3 class="text-base font-bold text-white mt-4 mb-2">$1</h3>')
        .replace(/^## (.+)$/gm, '<h2 class="text-lg font-bold text-white mt-6 mb-2">$1</h2>')
        .replace(/^# (.+)$/gm, '<h1 class="text-xl font-bold text-white mt-6 mb-3">$1</h1>')
        .replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>')
        .replace(/\*(.+?)\*/g, '<em class="text-white/70">$1</em>')
        .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" class="text-orange-400 underline" target="_blank">$1</a>')
        .replace(/^---$/gm, '<hr class="border-white/10 my-4"/>')
        .replace(/^- (.+)$/gm, '<li class="text-white/60 text-sm ml-4 list-disc">$1</li>')
        .replace(/\n\n/g, '</p><p class="text-white/60 text-sm leading-relaxed mb-3">');
    return (
        <div className="text-white/60 text-sm leading-relaxed"
             dangerouslySetInnerHTML={{ __html: `<p class="text-white/60 text-sm leading-relaxed mb-3">${html}</p>` }} />
    );
}

export default function BlogTab() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<BlogPost | null>(null);
    const [isNew, setIsNew] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState<string | null>(null);
    const [preview, setPreview] = useState(false);
    const [filter, setFilter] = useState<Category | "all">("all");

    const fetchPosts = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_URL}/blog/posts`);
            const data = await res.json();
            setPosts(data);
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => { fetchPosts(); }, [fetchPosts]);

    const openNew = () => {
        setEditing({ id: "", ...EMPTY_POST });
        setIsNew(true);
        setPreview(false);
    };

    const openEdit = (post: BlogPost) => {
        setEditing({ ...post });
        setIsNew(false);
        setPreview(false);
    };

    const closeEditor = () => { setEditing(null); setIsNew(false); };

    const handleSave = async () => {
        if (!editing) return;
        if (!editing.title.trim()) return alert("Вкажи заголовок");
        if (!editing.content.trim()) return alert("Додай контент");

        setSaving(true);
        try {
            const slug = editing.slug || slugify(editing.title);
            const body = { ...editing, slug };

            const res = isNew
                ? await fetch(`${API_URL}/blog/posts`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                })
                : await fetch(`${API_URL}/blog/posts/${editing.slug}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body),
                });

            if (!res.ok) throw new Error(await res.text());
            await fetchPosts();
            closeEditor();
        } catch (e) { console.error(e); alert("Помилка збереження"); }
        finally { setSaving(false); }
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Видалити статтю?")) return;
        setDeleting(slug);
        try {
            await fetch(`${API_URL}/blog/posts/${slug}`, { method: "DELETE" });
            setPosts((p) => p.filter((x) => x.slug !== slug));
        } catch (e) { console.error(e); }
        finally { setDeleting(null); }
    };

    const togglePublished = async (post: BlogPost) => {
        try {
            const res = await fetch(`${API_URL}/blog/posts/${post.slug}/publish`, { method: "PATCH" });
            const data = await res.json();
            setPosts((p) => p.map((x) => x.slug === post.slug ? { ...x, published: data.published } : x));
        } catch (e) { console.error(e); }
    };

    const formatDate = (iso?: string) => {
        if (!iso) return "—";
        return new Date(iso).toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
    };

    const filteredPosts = posts.filter((p) => filter === "all" || p.category === filter);

    // ── EDITOR ──
    if (editing) return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={closeEditor} className="text-white/30 hover:text-white/70 transition-colors text-sm">
                        ← Назад
                    </button>
                    <span className="text-white/15">|</span>
                    <span className="text-sm text-white/50">{isNew ? "Нова стаття" : "Редагувати"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPreview((v) => !v)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                preview ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                    : "border-white/[0.07] text-white/30 hover:text-white/60"}`}>
                        {preview ? "Редактор" : "Прев'ю"}
                    </button>
                    <button onClick={() => setEditing((e) => e ? { ...e, published: !e.published } : e)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                editing.published
                                    ? "bg-green-500/15 border-green-500/40 text-green-400"
                                    : "border-white/[0.07] text-white/30 hover:text-white/60"}`}>
                        {editing.published ? "✓ Опублікований" : "Чернетка"}
                    </button>
                    <button onClick={handleSave} disabled={saving}
                            className="text-[10px] font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all disabled:opacity-50">
                        {saving ? "Збереження..." : "Зберегти"}
                    </button>
                </div>
            </div>

            {preview ? (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORY_CONFIG[editing.category].color}`}>
                            {CATEGORY_CONFIG[editing.category].label}
                        </span>
                        <span className="text-[10px] text-white/25">{editing.read_time} хв читання</span>
                    </div>
                    <h1 className="text-2xl font-black text-white" style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        {editing.title || "Заголовок"}
                    </h1>
                    <p className="text-white/40 text-sm">{editing.excerpt}</p>
                    <div className="h-px bg-white/[0.05]" />
                    <MarkdownPreview content={editing.content} />
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    <div className="lg:col-span-2 space-y-3">
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                            <input
                                value={editing.title}
                                onChange={(e) => setEditing((ed) => ed ? {
                                    ...ed, title: e.target.value,
                                    slug: ed.slug || slugify(e.target.value)
                                } : ed)}
                                placeholder="Заголовок статті"
                                className="w-full bg-transparent text-white font-bold text-lg placeholder:text-white/20 outline-none border-b border-white/[0.06] pb-3"
                                style={{ fontFamily: "'Unbounded', sans-serif" }}
                            />
                            <input
                                value={editing.excerpt}
                                onChange={(e) => setEditing((ed) => ed ? { ...ed, excerpt: e.target.value } : ed)}
                                placeholder="Короткий опис (для списку статей)"
                                className="w-full bg-transparent text-sm text-white/50 placeholder:text-white/20 outline-none"
                            />
                        </div>
                        <TipTapEditor
                            content={editing.content}
                            onChange={(html) => setEditing((ed) => ed ? { ...ed, content: html } : ed)}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 space-y-3">
                            <p className="text-[10px] font-bold tracking-widest text-white/25 uppercase">Параметри</p>
                            <div>
                                <p className="text-[11px] text-white/40 mb-2">Категорія</p>
                                <div className="flex flex-col gap-1.5">
                                    {(Object.keys(CATEGORY_CONFIG) as Category[]).map((cat) => (
                                        <button key={cat}
                                                onClick={() => setEditing((ed) => ed ? { ...ed, category: cat } : ed)}
                                                className={`text-left text-[11px] font-bold px-3 py-2 rounded-lg border transition-all ${
                                                    editing.category === cat
                                                        ? CATEGORY_CONFIG[cat].color
                                                        : "border-white/[0.07] text-white/30 hover:text-white/50"}`}>
                                            {CATEGORY_CONFIG[cat].label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <p className="text-[11px] text-white/40 mb-1">URL slug</p>
                                <input
                                    value={editing.slug}
                                    onChange={(e) => setEditing((ed) => ed ? { ...ed, slug: e.target.value } : ed)}
                                    placeholder="avto-slug-vid-zaholovku"
                                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-[11px] text-white/50 font-mono outline-none focus:border-orange-500/30"
                                />
                                <p className="text-[10px] text-white/15 mt-1">/blog/{editing.slug || "slug"}</p>
                            </div>
                            <div>
                                <p className="text-[11px] text-white/40 mb-1">Cover image URL</p>
                                <input
                                    value={editing.cover_image ?? ""}
                                    onChange={(e) => setEditing((ed) => ed ? { ...ed, cover_image: e.target.value } : ed)}
                                    placeholder="https://..."
                                    className="w-full bg-white/[0.03] border border-white/[0.07] rounded-lg px-3 py-2 text-[11px] text-white/50 font-mono outline-none focus:border-orange-500/30"
                                />
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );

    // ── СПИСОК ──
    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1">
                    {([["all", "Всі"], ["tips", "Поради"], ["news", "Новини"], ["guide", "Гайди"]] as const).map(([key, label]) => (
                        <button key={key} onClick={() => setFilter(key as typeof filter)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${
                                    filter === key
                                        ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                        : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"}`}>
                            {label}
                        </button>
                    ))}
                </div>
                <button onClick={openNew}
                        className="ml-auto text-[10px] font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all">
                    + Нова стаття
                </button>
            </div>

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
                    <p className="text-white/25 text-sm mb-3">Статей ще немає</p>
                    <button onClick={openNew}
                            className="text-[10px] font-bold px-4 py-2 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:bg-orange-500/25 transition-all">
                        Написати першу
                    </button>
                </div>
            ) : (
                <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">
                    <table className="w-full min-w-[600px]">
                        <thead>
                        <tr className="border-b border-white/[0.05]">
                            {["Стаття", "Категорія", "Статус", "Дата", "Дії"].map((h) => (
                                <th key={h} className="text-left text-[10px] font-bold tracking-widest text-white/25 uppercase px-4 py-3">{h}</th>
                            ))}
                        </tr>
                        </thead>
                        <tbody>
                        {filteredPosts.map((post) => (
                            <tr key={post.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                                <td className="px-4 py-3">
                                    <p className="text-sm text-white/70 font-medium">{post.title}</p>
                                    <p className="text-[11px] text-white/25 font-mono mt-0.5">/blog/{post.slug}</p>
                                </td>
                                <td className="px-4 py-3">
                                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORY_CONFIG[post.category]?.color ?? ""}`}>
                                            {CATEGORY_CONFIG[post.category]?.label ?? post.category}
                                        </span>
                                </td>
                                <td className="px-4 py-3">
                                    <button onClick={() => togglePublished(post)}
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${
                                                post.published
                                                    ? "text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20"
                                                    : "text-white/30 bg-white/[0.03] border-white/[0.07] hover:border-white/20"}`}>
                                        {post.published ? "✓ Опублікована" : "Чернетка"}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-xs text-white/30">{formatDate(post.created_at)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(post)}
                                                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all">
                                            Редагувати
                                        </button>
                                        <button onClick={() => handleDelete(post.slug)}
                                                disabled={deleting === post.slug}
                                                className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40 transition-all disabled:opacity-40">
                                            {deleting === post.slug ? "..." : "Видалити"}
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