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
import ResourcesStripFoxFlat from "@/src/components/main/ResourcesStripFoxFlat";
import EcosystemFoxFlat from "@/src/components/main/EcosystemFoxFlat";
import DonateFoxFlat from "@/src/components/main/DonateFoxFlat";

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: 'tips' | 'news' | 'guide';
    created_at: string;
    read_time: number;
    cover_image?: string;
}

export default function ClientHome({
                                       blogPosts = [],
                                       initialReviews = [],
                                   }: {
    blogPosts?: BlogPost[];
    initialReviews?: Review[];
}) {
    const [showScrollHint, setShowScrollHint] = useState(true);
    const [reviews, setReviews] = useState<Review[]>(initialReviews);
    const [loading, setLoading] = useState(initialReviews.length === 0);

    useEffect(() => {
        if (initialReviews.length > 0) return;
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
    }, [initialReviews.length]);

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollHint(window.scrollY <= 100);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Додано as const для усунення помилки TS2322 з Framer Motion
    const fadeInSection = {
        initial: { opacity: 0, y: 50 },
        whileInView: { opacity: 1, y: 0 },
        transition: { duration: 0.6, ease: "easeOut" },
        viewport: { once: true, amount: 0.2 },
    } as const;

    // Геометричний розділювач у стилі flat-дизайну
    const GeometricDivider = () => (
        <div className="w-full py-6 bg-[#1E1E2E] flex items-center justify-center gap-4">
            <div className="w-1/4 h-px bg-gradient-to-r from-transparent via-[#FF6B35]/30 to-[#FF6B35]/60" />
            <div className="w-2 h-2 rotate-45 border border-[#FF6B35] bg-[#1E1E2E] flex-shrink-0" />
            <div className="w-1/4 h-px bg-gradient-to-l from-transparent via-[#FF6B35]/30 to-[#FF6B35]/60" />
        </div>
    );

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-[#1E1E2E] text-white">
            <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
                <AnimatedBackground />
            </div>

            <HeaderFoxFlat />

            <div className="h-16 bg-white relative z-10" />

            {/* ── HERO SECTION ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-white pb-16">
                <HeroFoxFlat />
            </motion.section>

            <GeometricDivider />

            {showScrollHint && (
                <span className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-[#FF6B35] z-50 text-4xl pointer-events-none select-none">
                    ↓
                </span>
            )}

            {/* ── Донат на ЗСУ ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#FF6B35] text-[#1E1E2E] py-12">
                <DonateFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Лічильники довіри ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#1E1E2E] py-16">
                <StatsCounterFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Як це працює ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-white text-[#1E1E2E] py-16">
                <HowItWorksFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Переваги ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#1E1E2E] py-16">
                <FeatureFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Ціни ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-white text-[#1E1E2E] py-16">
                <PricingFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Відгуки ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#1E1E2E] py-16">
                {loading ? (
                    <div className="text-center py-16 text-[#FF6B35] text-2xl animate-pulse font-light">
                        Завантаження відгуків...
                    </div>
                ) : (
                    <ClientReviewsHome reviews={reviews} />
                )}
            </motion.section>

            <GeometricDivider />

            {/* ── Блог ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-white text-[#1E1E2E] py-16">
                <BlogPreviewFoxFlat posts={blogPosts} />
            </motion.section>

            <GeometricDivider />

            {/* ── Корисні ресурси ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#FF6B35] text-[#1E1E2E] py-8">
                <ResourcesStripFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── FAQ ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#1E1E2E] py-16">
                <FaqFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Фінальний CTA ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-white text-[#1E1E2E] py-20">
                <CtaFoxFlat />
            </motion.section>

            <GeometricDivider />

            {/* ── Екосистема Fox & Cities ── */}
            <motion.section {...fadeInSection} className="relative z-10 bg-[#1E1E2E] pt-16 pb-24">
                <EcosystemFoxFlat />
                <div className="h-16" />
                <CitiesFoxFlat />
            </motion.section>
        </main>
    );
}