'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';
import { Review } from './page';
import AddReviewForm from '@/src/components/reviews/AddReviewForm';

interface ClientReviewsProps {
    reviews: Review[];
    schemaData: Record<string, unknown>;
}

function StarRating({ rating }: { rating: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} width="13" height="13" viewBox="0 0 24 24" fill="none">
                    <path
                        d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                        fill={i < rating ? "#F97316" : "transparent"}
                        stroke={i < rating ? "#F97316" : "rgba(255,255,255,0.12)"}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ))}
        </div>
    );
}

function ReviewCard({ review, index }: { review: Review; index: number }) {
    const initials = review.name
        ? review.name.split(' ').map((w: string) => w[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.06 }}
            className="group relative flex flex-col p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:border-orange-500/20 hover:bg-white/[0.035] transition-all duration-300 overflow-hidden"
        >
            {/* декоративні лапки */}
            <div
                className="absolute -top-2 right-4 font-black text-white/[0.04] select-none pointer-events-none leading-none"
                style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "80px" }}
            >
                &#34;
            </div>
            {/* glow */}
            <div
                className="absolute bottom-0 left-0 w-36 h-36 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at 0% 100%, rgba(249,115,22,0.07) 0%, transparent 70%)" }}
            />

            <div className="mb-4">
                <StarRating rating={review.rating} />
            </div>

            <p className="text-sm text-white/55 leading-relaxed flex-1 mb-5 relative z-10">
                &#34;{review.text}&#34;
            </p>

            <div className="flex items-center gap-3 pt-4 border-t border-white/[0.05]">
                <div
                    className="w-8 h-8 rounded-full bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0 text-orange-400 font-bold"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "9px" }}
                >
                    {initials}
                </div>
                <div>
                    <p className="text-sm font-semibold text-white/80 leading-tight">{review.name}</p>
                    <p className="text-xs text-white/25 mt-0.5">
                        {review.date
                            ? new Date(review.date).toLocaleDateString('uk-UA', { day: 'numeric', month: 'long', year: 'numeric' })
                            : '—'}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default function ClientReviews({ reviews, schemaData }: ClientReviewsProps) {
    const [allReviews, setAllReviews] = useState<Review[]>(reviews);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                setAllReviews(snapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name || '',
                    text: doc.data().text || '',
                    rating: doc.data().rating || 0,
                    date: doc.data().date?.toDate().toISOString() || '',
                })));
                setLoading(false);
            },
            (error) => { console.error(error); setLoading(false); }
        );
        return () => unsubscribe();
    }, []);

    const handleNewReview = (review: Review) => setAllReviews((prev) => [review, ...prev]);

    const avgRating = allReviews.length
        ? (allReviews.reduce((s, r) => s + r.rating, 0) / allReviews.length).toFixed(1)
        : '—';

    const jsonLdData = {
        ...schemaData,
        '@type': 'SoftwareApplication',
        operatingSystem: 'Telegram',
        applicationCategory: 'BusinessApplication',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            reviewCount: allReviews.length,
        },
        review: allReviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.name },
            reviewBody: r.text,
            reviewRating: { '@type': 'Rating', ratingValue: r.rating, bestRating: '5' },
            datePublished: r.date ?? undefined,
        })),
    };

    return (
        <main className="bg-black text-white min-h-screen w-full">
            <HeaderFoxFlat />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            {/* Hero */}
            <section className="relative pt-40 pb-24 px-6 overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                    style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 65%)" }}
                />
                <div className="relative max-w-3xl mx-auto text-center">
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                    >
                        Відгуки користувачів
                    </motion.p>
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="font-black leading-tight mb-5"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: "clamp(28px, 4vw, 52px)",
                            letterSpacing: "-1.5px",
                        }}
                    >
                        Досвід наших користувачів
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.15 }}
                        className="text-white/40 text-base leading-relaxed"
                    >
                        Чесні історії та реальні відгуки про FoxFlat
                    </motion.p>
                </div>
            </section>

            {/* Статистика */}
            <section className="px-6 pb-20">
                <div className="max-w-3xl mx-auto grid grid-cols-2 gap-3">
                    {[
                        { value: allReviews.length.toString(), label: 'Відгуків', suffix: '' },
                        { value: avgRating, label: 'Середній рейтинг', suffix: '/ 5' },
                    ].map((s, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.1 }}
                            className="flex flex-col items-center justify-center p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02]"
                        >
                            <div className="flex items-end gap-1.5 mb-1">
                                <span
                                    className="font-black text-white leading-none"
                                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "clamp(36px, 5vw, 52px)", letterSpacing: "-2px" }}
                                >
                                    {s.value}
                                </span>
                                {s.suffix && (
                                    <span className="text-white/25 text-sm font-medium mb-2">{s.suffix}</span>
                                )}
                            </div>
                            <p className="text-xs text-white/35 font-medium">{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* Список відгуків */}
            <section className="px-6 pb-24">
                <div className="max-w-5xl mx-auto">
                    {loading ? (
                        <div className="flex items-center justify-center py-24 gap-3 text-orange-400">
                            <svg className="animate-spin" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            <span className="text-sm font-medium">Завантаження відгуків...</span>
                        </div>
                    ) : allReviews.length === 0 ? (
                        <p className="text-center text-white/20 text-sm py-16">Поки що немає відгуків</p>
                    ) : (
                        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4 mb-20">
                            {allReviews.map((review, i) => (
                                <div key={review.id} className="break-inside-avoid">
                                    <ReviewCard review={review} index={i} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Форма */}
                    <div className="pt-10 border-t border-white/[0.06]">
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            className="text-center text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                        >
                            Ваш відгук
                        </motion.p>
                        <motion.h2
                            initial={{ opacity: 0, y: 16 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center font-black mb-12 leading-tight"
                            style={{
                                fontFamily: "'Unbounded', sans-serif",
                                fontSize: "clamp(22px, 3vw, 34px)",
                                letterSpacing: "-1px",
                            }}
                        >
                            Поділись своїм досвідом
                        </motion.h2>
                        <AddReviewForm onNewReview={handleNewReview} />
                    </div>
                </div>
            </section>

            <FooterFoxFlat />
        </main>
    );
}