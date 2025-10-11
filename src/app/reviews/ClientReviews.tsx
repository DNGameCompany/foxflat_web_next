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

export default function ClientReviews({ reviews, schemaData }: ClientReviewsProps) {
    const [allReviews, setAllReviews] = useState<Review[]>(reviews);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const reviewsData = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                name: doc.data().name || '',
                text: doc.data().text || '',
                rating: doc.data().rating || 0,
                date: doc.data().date?.toDate().toISOString() || '',
            }));
            setAllReviews(reviewsData);
            setLoading(false);
        }, (error) => {
            console.error('Помилка при завантаженні відгуків:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleNewReview = (review: Review) => {
        setAllReviews(prev => [review, ...prev]); // Тимчасове додавання для UX
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="text-center py-16 text-orange-400 text-2xl">Завантаження відгуків...</div>
            </div>
        );
    }

    return (
        <main className="bg-black text-white min-h-screen w-full font-sans">
            <HeaderFoxFlat />

            {/* JSON-LD з динамічними даними */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        ...schemaData,
                        reviewCount: allReviews.length,
                        aggregateRating: {
                            ratingValue: (
                                allReviews.reduce((sum, r) => sum + r.rating, 0) / (allReviews.length || 1)
                            ).toFixed(1),
                            reviewCount: allReviews.length,
                        },
                        reviews: allReviews.map(review => ({
                            author: review.name,
                            reviewBody: review.text,
                            reviewRating: review.rating,
                            datePublished: review.date,
                        })),
                    }),
                }}
            />

            {/* Hero */}
            <section className="px-6 py-32 max-w-5xl mx-auto text-center">
                <h1 className="text-6xl font-extrabold text-orange-500 mb-6">
                    Досвід наших користувачів
                </h1>
                <p className="text-neutral-400 text-xl">
                    Чесні історії та реальні відгуки про FoxFlat.
                </p>
            </section>

            {/* Статистика */}
            <section className="flex justify-center gap-20 py-16 border-t border-b border-neutral-700">
                <div className="text-center">
                    <span className="text-4xl font-bold text-orange-500">{allReviews.length}</span>
                    <p className="text-neutral-500 mt-2">Відгуків</p>
                </div>
                <div className="text-center">
                    <span className="text-4xl font-bold text-orange-500">
                        {(
                            allReviews.reduce((sum, r) => sum + r.rating, 0) /
                            (allReviews.length || 1)
                        ).toFixed(1)}
                    </span>
                    <p className="text-neutral-500 mt-2">Середній рейтинг</p>
                </div>
            </section>

            {/* Візуальні цитати */}
            <section className="max-w-4xl mx-auto px-6 py-20 flex flex-col gap-14">
                {allReviews.length === 0 && (
                    <p className="text-center text-neutral-600">Поки що немає відгуків 😔</p>
                )}

                {allReviews.map((review, index) => (
                    <motion.blockquote
                        key={review.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-l-4 border-orange-500 pl-6 text-neutral-300 italic"
                    >
                        <p className="mb-3">{review.text}</p>
                        <footer className="text-neutral-500 text-sm">
                            — {review.name},{' '}
                            {review.date
                                ? new Date(review.date).toLocaleDateString('uk-UA')
                                : '—'}{' '}
                            | {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                        </footer>
                    </motion.blockquote>
                ))}

                {/* Форма додавання відгуку */}
                <AddReviewForm onNewReview={handleNewReview} />
            </section>

            <FooterFoxFlat />
        </main>
    );
}