"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const CATEGORY_CONFIG = {
    tips:  { label: "Поради",  color: "text-[#FF6B35] bg-[#FF6B35]/15 border-[#FF6B35]/30" },
    news:  { label: "Новини",  color: "text-purple-400 bg-purple-400/15 border-purple-400/30" },
    guide: { label: "Гайд",    color: "text-emerald-400 bg-emerald-400/15 border-emerald-400/30" },
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

export default function BlogPreviewFoxFlat({ posts }: { posts: Post[] }) {
    if (posts.length === 0) return null;

    return (
        <section className="relative w-full bg-[#1E1E2E] text-white py-24 px-6 overflow-hidden" style={{ zIndex: 1 }}>
            {/* Фонове сяйво */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-5xl mx-auto">

                <div className="text-center mb-16">
                    <p className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3">Блог</p>
                    <h2 className="font-extrabold mb-4 leading-tight text-white"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(24px, 3vw, 38px)", letterSpacing: "-1px" }}>
                        Статті та поради з оренди квартир в Україні
                    </h2>
                    <p className="text-white/60 text-base max-w-md mx-auto">
                        Поради, гайди та новини про оренду квартир в Україні
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                                      className="group flex flex-col h-full rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF6B35]/50 hover:bg-white/[0.08] transition-all duration-300 overflow-hidden shadow-lg">
                                    {post.cover_image ? (
                                        <div className="h-44 overflow-hidden relative">
                                            <img src={post.cover_image} alt={post.title}
                                                 className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                                        </div>
                                    ) : (
                                        <div className="h-44 bg-gradient-to-br from-[#FF6B35]/20 to-transparent flex items-center justify-center">
                                            <span className="text-[#FF6B35]/30 text-5xl font-extrabold select-none"
                                                  style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                                {post.title[0]}
                                            </span>
                                        </div>
                                    )}
                                    <div className="flex flex-col flex-1 p-5 gap-3">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${cat?.color}`}>
                                                {cat?.label}
                                            </span>
                                            <span className="text-[10px] font-semibold text-white/40">{post.read_time} хв</span>
                                        </div>
                                        <h3 className="text-sm font-bold text-white group-hover:text-[#FF6B35] transition-colors leading-snug"
                                            style={{ fontFamily: "'Unbounded', sans-serif" }}>
                                            {post.title}
                                        </h3>
                                        <p className="text-xs text-white/60 leading-relaxed flex-1 line-clamp-2">{post.excerpt}</p>
                                    </div>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Кнопка */}
                <div className="mt-12 text-center" style={{ position: "relative", zIndex: 10 }}>
                    <Link
                        href="/blog"
                        style={{ display: "inline-flex", cursor: "pointer", fontFamily: "'Unbounded', sans-serif" }}
                        className="items-center gap-2 text-xs font-bold px-7 py-3.5 rounded-xl border-2 border-[#FF6B35] text-[#FF6B35] hover:bg-[#FF6B35] hover:text-white transition-all duration-200 shadow-md"
                    >
                        Всі статті →
                    </Link>
                </div>

            </div>
        </section>
    );
}