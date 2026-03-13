"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORY_CONFIG = {
    tips:  { label: "Поради",  color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/10 border-purple-400/20" },
    guide: { label: "Гайд",    color: "text-green-400 bg-green-400/10 border-green-400/20" },
} as const;

type Category = keyof typeof CATEGORY_CONFIG;

interface Post {
    slug: string;
    title: string;
    excerpt: string;
    category: Category;
    created_at: string;
    read_time: number;
    cover_image?: string;
}

export default function BlogPreviewFoxFlat() {
    const [posts, setPosts] = useState<Post[]>([]);

    useEffect(() => {
        fetch("https://api.foxflat.com.ua/blog/posts?published=true&limit=3")
            .then((r) => r.json())
            .then(setPosts)
            .catch(() => {});
    }, []);

    if (posts.length === 0) return null;

    return (
        <section className="relative w-full bg-black py-20 px-4" style={{ zIndex: 1 }}>
            <div className="max-w-5xl mx-auto">

                <div className="text-center mb-10">
                    <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">Блог</p>
                    <h2 className="font-black mb-4 leading-tight"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-1px" }}>
                        Корисні статті
                    </h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto">
                        Поради, гайди та новини про оренду квартир в Україні
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {posts.map((post, i) => {
                        const cat = CATEGORY_CONFIG[post.category];
                        return (
                            <motion.div
                                key={post.slug}
                                initial={{ opacity: 0, y: 16 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
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
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${cat?.color}`}>
                                                {cat?.label}
                                            </span>
                                            <span className="text-[10px] text-white/20">{post.read_time} хв</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-snug"
                                            style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-white/35 leading-relaxed flex-1 line-clamp-2">{post.excerpt}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Кнопка — без motion обгортки */}
                <div className="mt-8 text-center" style={{ position: "relative", zIndex: 10 }}>
                    <Link
                        href="/blog"
                        style={{ display: "inline-flex", cursor: "pointer" }}
                        className="items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-xl border-2 border-orange-500 text-orange-500 hover:bg-orange-500/10 transition-all"
                    >
                        Всі статті →
                    </Link>
                </div>

            </div>
        </section>
    );
}