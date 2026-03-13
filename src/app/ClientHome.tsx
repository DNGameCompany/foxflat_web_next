'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import AnimatedBackground from '@/src/components/AnimatedBackground';
import HeroFoxFlat from '@/src/components/main/HeroFoxFlat';
import FeatureFoxFlat from '@/src/components/main/FeatureFoxFlat';
import PricingFoxFlat from '@/src/components/main/PricingFoxFlat';
import CtaFoxFlat from '@/src/components/main/CtaFoxFlat';
import { Review } from '@/src/app/reviews/page';
import ClientReviewsHome from "@/src/components/main/ReviewsFoxFlat";

// ── нові секції ──────────────────────────────────────────────
import StatsCounterFoxFlat from '@/src/components/main/StatsCounterFoxFlat';
import HowItWorksFoxFlat from '@/src/components/main/HowItWorksFoxFlat';
import FaqFoxFlat from '@/src/components/main/FAQFoxFlat';
import CitiesFoxFlat from "@/src/components/main/CitiesFoxFlat";
import BlogPreviewFoxFlat from "@/src/components/main/BlogPreviewFoxFlat";

export default function ClientHome() {
    const [showScrollHint, setShowScrollHint] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'reviews'));
                const reviewsData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    name: doc.data().name || '',
                    text: doc.data().text || '',
                    rating: doc.data().rating || 0,
                    date: doc.data().date?.toDate().toISOString() || '',
                }));
                setReviews(reviewsData);
            } catch (error) {
                console.error('Помилка при завантаженні відгуків:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollHint(window.scrollY <= 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fadeInSection = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6 },
        viewport: { once: true },
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black">
            <AnimatedBackground />
            <HeaderFoxFlat />
            <HeroFoxFlat />

            {/* тонкий розділювач */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {showScrollHint && (
                <span className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-orange-400 z-10 text-3xl pointer-events-none select-none">
                    ↓
                </span>
            )}

            {/* ── Лічильники довіри ── */}
            <motion.section {...fadeInSection}>
                <StatsCounterFoxFlat />
            </motion.section>

            {/* тонкий розділювач */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* ── Як це працює ── */}
            <motion.section {...fadeInSection}>
                <HowItWorksFoxFlat />
            </motion.section>

            {/* ── Переваги ── */}
            <motion.section {...fadeInSection}>
                <FeatureFoxFlat />
            </motion.section>

            {/* ── Ціни ── */}
            <motion.section {...fadeInSection}>
                <PricingFoxFlat />
            </motion.section>

            {/* тонкий розділювач */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* ── Відгуки ── */}
            <motion.section {...fadeInSection}>
                {loading ? (
                    <div className="text-center py-16 text-orange-400 text-2xl animate-pulse">
                        Завантаження відгуків...
                    </div>
                ) : (
                    <ClientReviewsHome reviews={reviews} />
                )}
            </motion.section>

            {/* тонкий розділювач */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            <motion.section {...fadeInSection}>
                <BlogPreviewFoxFlat />
            </motion.section>

            {/* тонкий розділювач */}
            <div className="max-w-4xl mx-auto px-4">
                <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            </div>

            {/* ── FAQ ── */}
            <motion.section {...fadeInSection}>
                <FaqFoxFlat />
            </motion.section>

            {/* ── Фінальний CTA ── */}
            <motion.section {...fadeInSection}>
                <CtaFoxFlat />
            </motion.section>

            {/* Cities */}
            <motion.section {...fadeInSection}>
                <CitiesFoxFlat />
            </motion.section>
        </main>
    );
}