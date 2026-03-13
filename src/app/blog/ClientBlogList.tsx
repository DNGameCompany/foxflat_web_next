"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { Post, Category } from "./page";

const CATEGORY_CONFIG: Record<Category, { label: string; color: string }> = {
    tips:  { label: "Поради",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    guide: { label: "Гайд",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
};

export default function BlogList({ posts }: { posts: Post[] }) {
    const [filter, setFilter] = useState<Category | "all">("all");

    const filtered = posts.filter((p) => filter === "all" || p.category === filter);

    return (
        <main className="min-h-screen bg-black text-white">
            <div className="max-w-5xl mx-auto px-4 py-20">

                {/* Заголовок */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                >
                    <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">Блог</p>
                    <h1 className="font-black mb-4 leading-tight"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(28px, 4vw, 44px)", letterSpacing: "-1px" }}>
                        Поради з оренди квартир
                    </h1>
                    <p className="text-white/40 text-sm max-w-md mx-auto">
                        Корисні статті про пошук житла в Україні — від практичних порад до детальних гайдів
                    </p>
                </motion.div>

                {/* Фільтри */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex justify-center gap-2 mb-10"
                >
                    {([["all", "Всі"], ["tips", "Поради"], ["news", "Новини"], ["guide", "Гайди"]] as const).map(([key, label]) => (
                        <button key={key} onClick={() => setFilter(key as typeof filter)}
                                className={`text-[11px] font-bold px-4 py-2 rounded-full border transition-all ${
                                    filter === key
                                        ? "bg-orange-500/15 border-orange-500/40 text-orange-400"
                                        : "border-white/[0.08] text-white/30 hover:text-white/60 hover:border-white/20"
                                }`}>
                            {label}
                        </button>
                    ))}
                </motion.div>

                {/* Список */}
                {filtered.length === 0 ? (
                    <p className="text-center text-white/25 py-20">Статей поки немає</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filtered.map((post, i) => (
                            <motion.div
                                key={post.id}
                                initial={{ opacity: 0, y: 16 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: i * 0.07 }}
                            >
                                <Link href={`/blog/${post.slug}`}
                                      className="group flex flex-col h-full rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-orange-500/25 hover:bg-orange-500/[0.03] transition-all duration-200 overflow-hidden">

                                    {post.cover_image ? (
                                        <div className="h-40 overflow-hidden">
                                            <img src={post.cover_image} alt={post.title}
                                                 className="w-full h-full object-cover opacity-70 group-hover:opacity-90 transition-opacity duration-300" />
                                        </div>
                                    ) : (
                                        <div className="h-40 bg-gradient-to-br from-orange-500/10 to-transparent flex items-center justify-center">
                                            <span className="text-orange-500/20 text-5xl font-black select-none"
                                                  style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                                {post.title[0]}
                                            </span>
                                        </div>
                                    )}

                                    <div className="flex flex-col flex-1 p-4 gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${CATEGORY_CONFIG[post.category]?.color}`}>
                                                {CATEGORY_CONFIG[post.category]?.label}
                                            </span>
                                            <span className="text-[10px] text-white/20">{post.read_time} хв</span>
                                        </div>
                                        <h2 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-snug"
                                            style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                            {post.title}
                                        </h2>
                                        <p className="text-xs text-white/35 leading-relaxed flex-1 line-clamp-3">{post.excerpt}</p>
                                        <p className="text-[10px] text-white/20">
                                            {new Date(post.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" })}
                                        </p>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}