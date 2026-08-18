"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Review } from "@/src/app/reviews/page";

interface ClientReviewsHomeProps {
    reviews: Review[];
    onReviewClick?: (id: string) => void;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                        fill={i < rating ? "#FF6B35" : "transparent"}
                        stroke={i < rating ? "#FF6B35" : "rgba(255,255,255,0.2)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ))}
        </div>
    );
}

function ReviewCard({ review }: { review: Review }) {
    const initials = review.name
        ? review.name.split(" ").map((w: string) => w[0]).slice(0, 2).join("").toUpperCase()
        : "?";

    return (
        <div className="relative flex flex-col h-full p-7 rounded-2xl border border-white/10 bg-white/5 hover:border-[#FF6B35]/50 transition-all duration-300 overflow-hidden shadow-lg">
            {/* декоративні лапки */}
            <div
                className="absolute -top-2 right-5 font-black text-white/5 select-none pointer-events-none leading-none"
                style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "96px" }}
            >
                &quot;
            </div>

            {/* glow */}
            <div
                className="absolute bottom-0 left-0 w-40 h-40 pointer-events-none"
                style={{ background: "radial-gradient(circle at 0% 100%, rgba(255,107,53,0.12) 0%, transparent 70%)" }}
            />

            {/* Рейтинг */}
            <div className="mb-5 relative z-10">
                <StarRating rating={review.rating} />
            </div>

            {/* Текст */}
            <p className="text-sm text-white/70 leading-relaxed flex-1 mb-6 relative z-10">
                &quot;{review.text}&quot;
            </p>

            {/* Автор */}
            <div className="flex items-center gap-3 pt-5 border-t border-white/10 relative z-10">
                <div
                    className="w-9 h-9 rounded-full bg-[#FF6B35]/15 border border-[#FF6B35]/30 flex items-center justify-center flex-shrink-0 text-[#FF6B35] font-extrabold"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "10px" }}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-bold text-white leading-tight">{review.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                        {review.date
                            ? new Date(review.date).toLocaleDateString("uk-UA", { day: "numeric", month: "long", year: "numeric" })
                            : "—"}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ClientReviewsHome({ reviews, onReviewClick }: ClientReviewsHomeProps) {
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const VISIBLE = 3;
    const total = reviews.length;

    const resetTimer = () => {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => go(1), 5000);
    };

    useEffect(() => {
        if (total <= VISIBLE) return;
        resetTimer();
        return () => { if (timerRef.current) clearTimeout(timerRef.current); };
    }, [current, total]);

    const go = (dir: number) => {
        setDirection(dir);
        setCurrent((prev) => (prev + dir + total) % total);
        resetTimer();
    };

    const getVisible = () => {
        if (total === 0) return [];
        return Array.from({ length: Math.min(VISIBLE, total) }, (_, i) =>
            reviews[(current + i) % total]
        );
    };

    const visible = getVisible();

    return (
        <section className="relative py-24 px-6 overflow-hidden bg-[#1E1E2E] text-white">
            {/* М'яке фонове сяйво */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-6xl mx-auto">

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3"
                >
                    Відгуки користувачів
                </motion.p>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center font-extrabold mb-4 leading-tight text-white"
                    style={{
                        fontFamily: "'Unbounded', sans-serif",
                        fontSize: "clamp(26px, 3.5vw, 42px)",
                        letterSpacing: "-1px",
                    }}
                >
                    Що кажуть про FoxFlat
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.15 }}
                    className="text-center text-white/60 text-base max-w-sm mx-auto mb-16 leading-relaxed"
                >
                    Реальні відгуки людей, які вже знайшли квартиру через FoxFlat
                </motion.p>

                {reviews.length === 0 ? (
                    <p className="text-center text-white/40 text-sm py-12">Поки що немає відгуків</p>
                ) : (
                    <>
                        <div className="relative overflow-hidden">
                            <AnimatePresence mode="popLayout" initial={false}>
                                <motion.div
                                    key={current}
                                    initial={{ opacity: 0, x: direction > 0 ? 60 : -60 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: direction > 0 ? -60 : 60 }}
                                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
                                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                                >
                                    {visible.map((review) => (
                                        <div
                                            key={review.id}
                                            onClick={() => onReviewClick?.(review.id)}
                                            className={onReviewClick ? "cursor-pointer" : ""}
                                        >
                                            <ReviewCard review={review} />
                                        </div>
                                    ))}
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        {total > VISIBLE && (
                            <div className="flex items-center justify-center gap-6 mt-10">
                                <button
                                    onClick={() => go(-1)}
                                    aria-label="Попередній відгук"
                                    className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/10 text-white/60 hover:text-[#FF6B35] flex items-center justify-center transition-all duration-200 shadow-md"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>

                                <div className="flex items-center gap-2">
                                    {Array.from({ length: total }).map((_, i) => (
                                        <button
                                            key={i}
                                            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
                                            aria-label={`Перейти до відгуку ${i + 1}`}
                                            aria-current={i === current}
                                            className={`rounded-full transition-all duration-300 ${
                                                i === current
                                                    ? "w-6 h-2 bg-[#FF6B35]"
                                                    : "w-2 h-2 bg-white/20 hover:bg-white/40"
                                            }`}
                                        />
                                    ))}
                                </div>

                                <button
                                    onClick={() => go(1)}
                                    aria-label="Наступний відгук"
                                    className="w-11 h-11 rounded-full border border-white/10 bg-white/5 hover:border-[#FF6B35]/50 hover:bg-[#FF6B35]/10 text-white/60 hover:text-[#FF6B35] flex items-center justify-center transition-all duration-200 shadow-md"
                                >
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="flex justify-center mt-14"
                >
                    <a
                        href="/reviews"
                        className="inline-flex items-center gap-3 font-bold text-white bg-[#FF6B35] hover:bg-[#e05a2b] px-8 py-4 rounded-xl transition-all duration-200 shadow-lg transform hover:-translate-y-0.5 active:translate-y-0"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "12px" }}
                    >
                        Залишити відгук
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </motion.div>
            </div>
        </section>
    );
}