"use client";

import { useEffect, useState, useCallback } from "react";
import { collection, addDoc, query, where, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import TipTapEditor from "@/src/components/admin/TipTapEditor/TipTapEditor";
import BlogImageUpload from "./BlogImageUpload";

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

type TGStatus = "published" | "scheduled" | "needs_review" | "blocked";

interface TGRecord {
    id: string;
    label: string;
    messageUrl: string;
    date: string;
    status: TGStatus;
    blogSlug: string;
}

const TG_STATUS_CONFIG: Record<TGStatus, { label: string; color: string }> = {
    published:    { label: "Опубліковано",     color: "text-green-400 bg-green-400/10 border-green-400/20" },
    scheduled:    { label: "Заплановано",       color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    needs_review: { label: "Потрібен перегляд", color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
    blocked:      { label: "Заблоковано",       color: "text-red-400 bg-red-400/10 border-red-400/20" },
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

const SENTENCE_END_PREVIEW = /[.!?…]$/;

function extractFirstParagraph(html: string, maxLen = 220): string {
    if (!html) return "";
    const regex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
    let match;
    while ((match = regex.exec(html)) !== null) {
        const text = match[1].replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").trim();
        if (!text) continue;
        if (text.length <= maxLen) return SENTENCE_END_PREVIEW.test(text) ? text : text + "…";
        const cut = text.slice(0, maxLen).replace(/\s+\S*$/, "");
        return SENTENCE_END_PREVIEW.test(cut) ? cut : cut + "…";
    }
    return "";
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
    const [postToTelegram, setPostToTelegram] = useState(false);
    const [tgPosting, setTgPosting] = useState(false);
    const [tgResult, setTgResult] = useState<{ ok: boolean; messageUrl?: string; error?: string; info?: string } | null>(null);
    const [tgPreview, setTgPreview] = useState(false);
    const [tgFirstPara, setTgFirstPara] = useState("");
    const [tgRecord, setTgRecord] = useState<TGRecord | null>(null);

    useEffect(() => {
        setTgFirstPara(extractFirstParagraph(editing?.content ?? ""));
    }, [editing?.content]);

    useEffect(() => {
        if (!editing?.slug || isNew) { setTgRecord(null); return; }
        const q = query(collection(db, "TGChanel"), where("blogSlug", "==", editing.slug));
        getDocs(q).then((snap) => {
            if (!snap.empty) {
                const d = snap.docs[0];
                setTgRecord({ id: d.id, ...(d.data() as Omit<TGRecord, "id">) });
            } else {
                setTgRecord(null);
            }
        });
    }, [editing?.slug, isNew]);

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

    const openNew = () => { setEditing({ id: "", ...EMPTY_POST }); setIsNew(true); setPreview(false); setPostToTelegram(false); setTgResult(null); };
    const openEdit = (post: BlogPost) => { setEditing({ ...post }); setIsNew(false); setPreview(false); setPostToTelegram(false); setTgResult(null); };
    const closeEditor = () => { setEditing(null); setIsNew(false); setPostToTelegram(false); setTgResult(null); };

    const handleSave = async () => {
        if (!editing) return;
        if (!editing.title.trim()) return alert("Вкажи заголовок");
        if (!editing.content.trim()) return alert("Додай контент");
        setSaving(true);
        try {
            const slug = editing.slug || slugify(editing.title);
            const body = { ...editing, slug };
            const res = isNew
                ? await fetch(`${API_URL}/blog/posts`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
                : await fetch(`${API_URL}/blog/posts/${editing.slug}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
            if (!res.ok) throw new Error(await res.text());
            await fetchPosts();

            if (postToTelegram) {
                // Не відправляти повторно якщо вже опубліковано
                if (tgRecord?.status === "published") {
                    closeEditor();
                    return;
                }

                const today = new Date().toISOString().split("T")[0];

                // Чернетка → зберегти як needs_review без відправки
                if (!body.published) {
                    const record = { label: body.title, messageUrl: "", date: today, status: "needs_review" as TGStatus, blogSlug: slug };
                    if (tgRecord) {
                        await updateDoc(doc(db, "TGChanel", tgRecord.id), record);
                        setTgRecord({ ...tgRecord, ...record });
                    } else {
                        const ref = await addDoc(collection(db, "TGChanel"), record);
                        setTgRecord({ id: ref.id, ...record });
                    }
                    setTgResult({ ok: false, info: "Чернетка — збережено зі статусом «Потрібен перегляд»" });
                    return;
                }

                // Опублікований → відправити в Telegram
                setTgPosting(true);
                try {
                    const tgRes = await fetch("/api/telegram/publish", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ title: body.title, excerpt: body.excerpt, slug, cover_image: body.cover_image, category: body.category, content: body.content }),
                    });
                    const tgData = await tgRes.json();
                    if (tgData.ok) {
                        const record = { label: body.title, messageUrl: tgData.messageUrl, date: today, status: "published" as TGStatus, blogSlug: slug };
                        if (tgRecord) {
                            await updateDoc(doc(db, "TGChanel", tgRecord.id), record);
                            setTgRecord({ ...tgRecord, ...record });
                        } else {
                            const ref = await addDoc(collection(db, "TGChanel"), record);
                            setTgRecord({ id: ref.id, ...record });
                        }
                        setTgResult({ ok: true, messageUrl: tgData.messageUrl });
                    } else {
                        setTgResult({ ok: false, error: tgData.error });
                    }
                } catch {
                    setTgResult({ ok: false, error: "Мережева помилка" });
                } finally {
                    setTgPosting(false);
                }
                return;
            }

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

    if (editing) return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button onClick={closeEditor} className="text-white/30 hover:text-white/70 transition-colors text-sm">← Назад</button>
                    <span className="text-white/15">|</span>
                    <span className="text-sm text-white/50">{isNew ? "Нова стаття" : "Редагувати"}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setPreview((v) => !v)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${preview ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-white/[0.07] text-white/30 hover:text-white/60"}`}>
                        {preview ? "Редактор" : "Прев'ю"}
                    </button>
                    <button onClick={() => setEditing((e) => e ? { ...e, published: !e.published } : e)}
                            className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${editing.published ? "bg-green-500/15 border-green-500/40 text-green-400" : "border-white/[0.07] text-white/30 hover:text-white/60"}`}>
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
                                onChange={(e) => setEditing((ed) => ed ? { ...ed, title: e.target.value, slug: ed.slug || slugify(e.target.value) } : ed)}
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
                                                className={`text-left text-[11px] font-bold px-3 py-2 rounded-lg border transition-all ${editing.category === cat ? CATEGORY_CONFIG[cat].color : "border-white/[0.07] text-white/30 hover:text-white/50"}`}>
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
                            <BlogImageUpload
                                value={editing.cover_image}
                                onChange={(url) => setEditing((ed) => ed ? { ...ed, cover_image: url } : ed)}
                            />
                        </div>

                        <div className="rounded-xl border border-blue-500/20 bg-blue-500/[0.03] p-4 space-y-3">
                            <div className="flex items-center justify-between">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (tgRecord?.status === "published") return;
                                        setPostToTelegram((v) => !v); setTgResult(null); setTgPreview(false);
                                    }}
                                    disabled={tgRecord?.status === "published"}
                                    className={`flex items-center gap-2.5 ${tgRecord?.status === "published" ? "opacity-40 cursor-not-allowed" : ""}`}
                                >
                                    <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 transition-all ${postToTelegram ? "bg-blue-500 border-blue-400" : "border-white/20"}`}>
                                        {postToTelegram && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                                    </div>
                                    <span className={`text-[11px] font-bold transition-colors ${postToTelegram ? "text-blue-400" : "text-white/30"}`}>
                                        Запостити в Telegram
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setTgPreview((v) => !v)}
                                    className={`text-[10px] font-bold px-2 py-1 rounded-lg border transition-all ${tgPreview ? "bg-blue-500/15 border-blue-500/40 text-blue-400" : "border-white/[0.07] text-white/25 hover:text-white/50"}`}
                                >
                                    {tgPreview ? "Сховати" : "Прев'ю"}
                                </button>
                            </div>

                            {tgRecord && (
                                <div className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${TG_STATUS_CONFIG[tgRecord.status]?.color ?? "text-white/30 border-white/10"}`}>
                                    <span>TG:</span>
                                    <span>{TG_STATUS_CONFIG[tgRecord.status]?.label}</span>
                                    {tgRecord.messageUrl && (
                                        <a href={tgRecord.messageUrl} target="_blank" rel="noopener noreferrer" className="ml-auto opacity-60 hover:opacity-100 transition-opacity">↗</a>
                                    )}
                                </div>
                            )}

                            {tgPreview && (
                                <div className="rounded-xl overflow-hidden" style={{ background: "#17212b", fontFamily: "-apple-system, 'Segoe UI', sans-serif" }}>
                                    <div className="flex items-center gap-2 px-3 py-2 border-b border-white/5">
                                        <div className="w-7 h-7 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.19-1.82 6.98-3.02 8.38-3.6 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .38.03.55.17.14.12.18.28.2.45-.02.06-.02.13-.03.2z"/></svg>
                                        </div>
                                        <div>
                                            <p className="text-[12px] font-semibold text-white leading-none">FoxFlatNews</p>
                                            <p className="text-[10px] text-white/40 mt-0.5">канал</p>
                                        </div>
                                    </div>

                                    <div className="p-1">
                                        <div className="rounded-lg overflow-hidden" style={{ background: "#242f3d" }}>
                                            {editing.cover_image ? (
                                                <img src={editing.cover_image} alt="" className="w-full object-cover max-h-36" />
                                            ) : (
                                                <div className="w-full h-20 flex items-center justify-center" style={{ background: "#1c2733" }}>
                                                    <span className="text-[10px] text-white/20">без обкладинки</span>
                                                </div>
                                            )}
                                            <div className="px-3 py-3 space-y-2">
                                                <p className="text-[12px] font-bold text-white leading-snug">
                                                    {editing.category === "tips" ? "💡" : editing.category === "news" ? "📣" : "📖"}{" "}
                                                    {editing.title || "Заголовок статті"}
                                                </p>
                                                <p className="text-[11px] leading-relaxed" style={{ color: editing.excerpt ? "#a8b8c8" : "#3d5163", fontStyle: editing.excerpt ? "normal" : "italic" }}>
                                                    {editing.excerpt || "короткий опис (excerpt)..."}
                                                </p>
                                                <p className="text-[11px] leading-relaxed" style={{ color: tgFirstPara ? "#a8b8c8" : "#3d5163", fontStyle: tgFirstPara ? "normal" : "italic" }}>
                                                    {tgFirstPara || "перший абзац статті..."}
                                                </p>
                                                <p className="text-[10px] tracking-widest" style={{ color: "#3d5163" }}>━━━━━━━━━━━━</p>
                                                <p className="text-[11px]" style={{ color: "#5bb2f9" }}>
                                                    🔗 Читати статтю повністю →
                                                </p>
                                                <p className="text-[10px] tracking-widest" style={{ color: "#3d5163" }}>━━━━━━━━━━━━</p>
                                                <div>
                                                    <p className="text-[11px] font-bold text-white">🏠 Шукаєш квартиру в оренду?</p>
                                                    <p className="text-[11px] leading-relaxed" style={{ color: "#a8b8c8" }}>
                                                        Підписуйся на{" "}
                                                        <span style={{ color: "#5bb2f9" }}>@FoxFlat_bot</span>
                                                        {" "}— отримуй найкращі пропозиції першим!
                                                    </p>
                                                </div>
                                                <p className="text-[11px]" style={{ color: "#5bb2f9" }}>
                                                    {editing.category === "tips" ? "#поради #нерухомість #лайфхаки" : editing.category === "news" ? "#новини #нерухомість #ринок" : "#гайд #нерухомість #корисно"} #foxflat
                                                </p>
                                                <div className="flex items-center justify-end gap-1 pt-0.5">
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M12 5c-7 0-11 7-11 7s4 7 11 7 11-7 11-7-4-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z" fill="#637b8c"/></svg>
                                                    <span className="text-[10px]" style={{ color: "#637b8c" }}>1</span>
                                                    <span className="text-[10px] ml-1" style={{ color: "#637b8c" }}>
                                                        {new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {!tgResult && !tgPosting && postToTelegram && !tgPreview && (
                                <p className="text-[10px] text-blue-400/50">
                                    {editing.cover_image ? "Фото + текст" : "Тільки текст (немає обкладинки)"} після збереження
                                </p>
                            )}
                            {tgPosting && (
                                <p className="text-[10px] text-blue-400/70 flex items-center gap-1.5">
                                    <svg className="animate-spin" width="10" height="10" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25"/><path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                                    Публікуємо...
                                </p>
                            )}
                            {tgResult && (
                                <div className="space-y-1.5">
                                    {tgResult.ok ? (
                                        <>
                                            <p className="text-[10px] text-green-400 font-bold">✓ Опубліковано в Telegram</p>
                                            {tgResult.messageUrl && (
                                                <a href={tgResult.messageUrl} target="_blank" rel="noopener noreferrer"
                                                   className="text-[10px] text-blue-400 underline break-all block">
                                                    {tgResult.messageUrl}
                                                </a>
                                            )}
                                            <button onClick={closeEditor} className="text-[10px] font-bold px-3 py-1 rounded-lg bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-green-500/25 transition-all">
                                                Закрити
                                            </button>
                                        </>
                                    ) : tgResult.info ? (
                                        <>
                                            <p className="text-[10px] text-yellow-400 font-bold">⚠ {tgResult.info}</p>
                                            <button onClick={closeEditor} className="text-[10px] font-bold px-3 py-1 rounded-lg bg-yellow-500/15 border border-yellow-500/30 text-yellow-400 hover:bg-yellow-500/25 transition-all">
                                                Закрити
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-[10px] text-red-400">✗ Помилка: {tgResult.error}</p>
                                            <button onClick={closeEditor} className="text-[10px] text-white/30 hover:text-white/60 transition-colors">
                                                Закрити без ТГ
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}

                            <div className="pt-1 border-t border-blue-500/10">
                                <a
                                    href="https://t.me/FoxFlat_bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full group px-2.5 py-2 rounded-lg border border-transparent hover:border-blue-500/20 hover:bg-blue-500/[0.06] transition-all"
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center flex-shrink-0">
                                            <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.2-.08-.06-.2-.04-.28-.02-.12.02-1.96 1.25-5.54 3.66-.52.36-1 .53-1.42.52-.47-.01-1.37-.26-2.03-.48-.82-.27-1.47-.42-1.42-.88.03-.25.38-.51 1.07-.78 4.19-1.82 6.98-3.02 8.38-3.6 3.99-1.66 4.82-1.95 5.36-1.96.12 0 .38.03.55.17.14.12.18.28.2.45-.02.06-.02.13-.03.2z" fill="#60a5fa"/>
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-[11px] font-semibold text-blue-400/80 group-hover:text-blue-400 leading-none transition-colors">@FoxFlat_bot</p>
                                            <p className="text-[9px] text-white/20 mt-0.5 leading-none">Telegram бот</p>
                                        </div>
                                    </div>
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="text-white/20 group-hover:text-blue-400/50 transition-colors flex-shrink-0">
                                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14 21 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
                <div className="flex gap-1">
                    {([["all", "Всі"], ["tips", "Поради"], ["news", "Новини"], ["guide", "Гайди"]] as const).map(([key, label]) => (
                        <button key={key} onClick={() => setFilter(key as typeof filter)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-lg border transition-all ${filter === key ? "bg-orange-500/15 border-orange-500/40 text-orange-400" : "border-white/[0.07] bg-white/[0.02] text-white/30 hover:text-white/50"}`}>
                            {label}
                        </button>
                    ))}
                </div>
                <button onClick={openNew} className="ml-auto text-[10px] font-bold px-4 py-1.5 rounded-lg bg-orange-500 text-black hover:bg-orange-400 transition-all">
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
                    <button onClick={openNew} className="text-[10px] font-bold px-4 py-2 rounded-lg bg-orange-500/15 border border-orange-500/40 text-orange-400 hover:bg-orange-500/25 transition-all">
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
                                            className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-all ${post.published ? "text-green-400 bg-green-400/10 border-green-400/20 hover:bg-green-400/20" : "text-white/30 bg-white/[0.03] border-white/[0.07] hover:border-white/20"}`}>
                                        {post.published ? "✓ Опублікована" : "Чернетка"}
                                    </button>
                                </td>
                                <td className="px-4 py-3 text-xs text-white/30">{formatDate(post.created_at)}</td>
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <button onClick={() => openEdit(post)} className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-orange-500/30 text-orange-400 hover:bg-orange-500/10 transition-all">
                                            Редагувати
                                        </button>
                                        <button onClick={() => handleDelete(post.slug)} disabled={deleting === post.slug}
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