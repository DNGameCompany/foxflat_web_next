"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PostFull } from "./page";

const CATEGORY_CONFIG = {
    tips:  { label: "Поради",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    guide: { label: "Гайд",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
} as const;

export default function BlogPost({ post }: { post: PostFull }) {
    const [readProgress, setReadProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const el = document.documentElement;
            const scrolled = el.scrollTop;
            const total = el.scrollHeight - el.clientHeight;
            setReadProgress(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0);
        };
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    const cat = CATEGORY_CONFIG[post.category];

    return (
        <>

            {/* Прогрес читання */}
            <div className="fixed top-0 left-0 right-0 h-[2px] bg-white/[0.05] z-50">
                <motion.div
                    className="h-full bg-orange-500"
                    style={{ width: `${readProgress}%` }}
                    transition={{ ease: "linear", duration: 0.1 }}
                />
            </div>

            <div className="max-w-2xl mx-auto px-4 py-14">

                {/* Назад */}
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                    <Link href="/blog"
                          className="inline-flex items-center gap-2 text-xs text-white/30 hover:text-white/60 transition-colors mb-8">
                        ← Всі статті
                    </Link>
                </motion.div>

                {/* Мета + заголовок + excerpt */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="space-y-4 mb-10"
                >
                    <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cat?.color}`}>{cat?.label}</span>
                        <span className="text-[10px] text-white/20">{post.read_time} хв читання</span>
                        <span className="text-[10px] text-white/20">
                            {new Date(post.created_at).toLocaleDateString("uk-UA", { day: "2-digit", month: "long", year: "numeric" })}
                        </span>
                    </div>
                    <h1 className="font-black text-white leading-tight"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(22px, 3.5vw, 36px)", letterSpacing: "-0.5px" }}>
                        {post.title}
                    </h1>
                    <p className="text-white/40 text-sm leading-relaxed border-l-2 border-orange-500/30 pl-4">
                        {post.excerpt}
                    </p>
                </motion.div>

                {/* Cover — під заголовком, повна ширина контенту, без обрізки */}
                {post.cover_image && (
                    <motion.div
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        className="mb-10 rounded-xl overflow-hidden border border-white/[0.06]"
                    >
                        <img
                            src={post.cover_image}
                            alt={post.title}
                            className="w-full h-auto"
                        />
                    </motion.div>
                )}

                {/* Контент */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="blog-content"
                    dangerouslySetInnerHTML={{ __html: post.content }}
                />

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-14 p-6 rounded-xl border border-orange-500/20 bg-orange-500/[0.04] text-center"
                >
                    <p className="text-sm text-white/60 mb-4">Шукаєш квартиру в оренду? Спробуй FoxFlat</p>
                    <a href="https://t.me/FoxFlat_bot" target="_blank" rel="noopener noreferrer"
                       className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-orange-500 text-black text-sm font-bold hover:bg-orange-400 transition-all">
                        Запустити бота →
                    </a>
                </motion.div>
            </div>
        </>
    );
}