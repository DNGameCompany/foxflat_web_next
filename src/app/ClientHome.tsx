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

export default function ClientHome() {
    const [showScrollHint, setShowScrollHint] = useState(true);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true); // Використовуємо для відображення стану

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
                setLoading(false); // Оновлюємо стан після завершення
            }
        };

        fetchReviews();
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setShowScrollHint(false);
            } else {
                setShowScrollHint(true);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-black">
            <AnimatedBackground />
            <HeaderFoxFlat />
            <HeroFoxFlat />

            {showScrollHint && (
                <span className="fixed bottom-6 left-1/2 -translate-x-1/2 animate-bounce text-orange-400 z-10 text-3xl pointer-events-none select-none">
          ↓
        </span>
            )}

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <FeatureFoxFlat />
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <PricingFoxFlat />
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                {loading ? (
                    <div className="text-center py-16 text-orange-400 text-2xl">Завантаження відгуків...</div>
                ) : (
                    <ClientReviewsHome reviews={reviews} />
                )}
            </motion.section>

            <motion.section
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
            >
                <CtaFoxFlat />
            </motion.section>
        </main>
    );
}