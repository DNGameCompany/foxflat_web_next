'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Review } from '@/src/app/reviews/page';

interface AddReviewFormProps {
    onNewReview: (review: Review) => void;
}

function StarButton({ index, rating, onRate }: { index: number; rating: number; onRate: (i: number) => void }) {
    const [hovered, setHovered] = useState(0);
    const active = hovered ? index <= hovered : index <= rating;

    return (
        <button
            type="button"
            onClick={() => onRate(index)}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(0)}
            aria-label={`${index} зірок`}
            className="transition-transform duration-150 hover:scale-110"
        >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path
                    d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
                    fill={active ? "#F97316" : "transparent"}
                    stroke={active ? "#F97316" : "rgba(255,255,255,0.15)"}
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </button>
    );
}

export default function AddReviewForm({ onNewReview }: AddReviewFormProps) {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !text || rating < 1) {
            setError('Будь ласка, заповніть усі поля та оберіть оцінку');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const docRef = await addDoc(collection(db, 'reviews'), {
                name, text, rating, date: serverTimestamp(),
            });

            onNewReview({ id: docRef.id, name, text, rating, date: new Date().toISOString() });

            setName('');
            setText('');
            setRating(0);
            setSuccess(true);
            setTimeout(() => setSuccess(false), 4000);
        } catch (err) {
            console.error(err);
            setError('Сталася помилка при додаванні відгуку');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto">

            {/* Success toast */}
            <AnimatePresence>
                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                        className="flex items-center gap-3 mb-6 px-5 py-4 rounded-xl border border-green-500/30 bg-green-500/[0.07]"
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="text-green-400 flex-shrink-0">
                            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                            <path d="M8 12l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <p className="text-sm font-semibold text-green-400">Дякуємо! Відгук успішно додано.</p>
                    </motion.div>
                )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="relative flex flex-col gap-5 p-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] overflow-hidden">

                {/* glow */}
                <div
                    className="absolute top-0 right-0 w-64 h-64 pointer-events-none"
                    style={{ background: "radial-gradient(circle at 100% 0%, rgba(249,115,22,0.06) 0%, transparent 65%)" }}
                />

                <div className="mb-2">
                    <h3
                        className="font-black text-white mb-1 leading-tight"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "18px", letterSpacing: "-0.5px" }}
                    >
                        Залишити відгук
                    </h3>
                    <p className="text-sm text-white/30">Поділись досвідом використання FoxFlat</p>
                </div>

                {/* Error */}
                <AnimatePresence>
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 px-4 py-3 rounded-xl"
                        >
                            {error}
                        </motion.p>
                    )}
                </AnimatePresence>

                {/* Ім'я */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest"
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        Ім&#39;я
                    </label>
                    <input
                        type="text"
                        placeholder="Ваше ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white text-sm placeholder-white/20 focus:border-orange-500/50 focus:bg-white/[0.05] outline-none transition-all duration-200"
                        required
                    />
                </div>

                {/* Відгук */}
                <div className="flex flex-col gap-2">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest"
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        Відгук
                    </label>
                    <textarea
                        placeholder="Розкажи про свій досвід..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.07] text-white text-sm placeholder-white/20 focus:border-orange-500/50 focus:bg-white/[0.05] outline-none transition-all duration-200 resize-none leading-relaxed"
                        required
                    />
                </div>

                {/* Рейтинг */}
                <div className="flex flex-col gap-3">
                    <label className="text-[10px] font-bold text-white/30 uppercase tracking-widest"
                           style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        Оцінка
                    </label>
                    <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <StarButton key={i} index={i} rating={rating} onRate={setRating} />
                        ))}
                        {rating > 0 && (
                            <span className="ml-2 text-xs text-white/30 font-medium">
                                {['', 'Погано', 'Так собі', 'Непогано', 'Добре', 'Відмінно'][rating]}
                            </span>
                        )}
                    </div>
                </div>

                {/* Кнопка */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full flex items-center justify-center gap-3 font-bold text-black bg-orange-500 hover:bg-transparent hover:text-orange-500 border-2 border-orange-500 px-6 py-4 rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-orange-500 disabled:hover:text-black"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: "12px" }}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" strokeOpacity="0.25" />
                                <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                            Надсилання...
                        </>
                    ) : (
                        <>
                            Надіслати відгук
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                                <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}