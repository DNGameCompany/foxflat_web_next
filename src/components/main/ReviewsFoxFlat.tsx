"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { Review } from "@/src/app/reviews/page";

interface ClientReviewsHomeProps {
    reviews: Review[];
    onReviewClick?: (id: string) => void;
}

function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}

export default function ClientReviewsHome({ reviews, onReviewClick }: ClientReviewsHomeProps) {
    useEffect(() => {
        // Додатковий ефект, якщо потрібна клієнтська логіка
    }, [reviews]);

    const handleReviewClick = (id: string) => {
        if (onReviewClick) onReviewClick(id);
    };

    return (
        <div className="relative isolate px-6 py-24 sm:py-32 lg:px-8 rounded-3xl overflow-hidden">
            {/* Фон-сітка без білої димки */}
            <div
                aria-hidden="true"
                className="absolute inset-0 z-0
        bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),
             linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]
        bg-[size:40px_40px]
        [mask-image:linear-gradient(to_bottom,transparent,white_20%,white_80%,transparent)]
        pointer-events-none"
            />

            {/* Заголовок */}
            <div className="relative z-10 mx-auto max-w-4xl text-center">
                <h2 className="text-base font-semibold text-orange-400">
                    Відгуки користувачів
                </h2>
                <p className="mt-2 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    Що кажуть про FoxFlat
                </p>
            </div>

            {/* Секція відгуків */}
            <div className="relative z-10 mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-y-12 sm:mt-20 lg:grid-cols-2 lg:gap-x-8">
                {reviews.length === 0 ? (
                    <p className="text-center text-neutral-500">Поки що немає відгуків 😔</p>
                ) : (
                    reviews.map((review, index) => (
                        <motion.div
                            key={review.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={classNames(
                                "rounded-2xl p-6 bg-black/80 border border-orange-400/20 shadow-[0_0_20px_-5px_rgba(251,146,60,0.3)] hover:shadow-[0_0_30px_-5px_rgba(251,146,60,0.4)] transition-all duration-300",
                                "cursor-pointer"
                            )}
                            onClick={() => handleReviewClick(review.id)}
                        >
                            <blockquote className="text-neutral-300 italic">
                                <p className="mb-4">{review.text}</p>
                                <footer className="text-sm text-neutral-500">
                                    — {review.name},{' '}
                                    {review.date
                                        ? new Date(review.date).toLocaleDateString('uk-UA')
                                        : '—'}{' '}
                                    | <span className="text-orange-400">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
                                </footer>
                            </blockquote>
                        </motion.div>
                    ))
                )}
            </div>

            {/* Посилання на залишення відгуку */}
            <div className="relative z-10 mt-12 text-center">
                <a
                    href="/reviews"
                    className="inline-block px-6 py-3 text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors duration-300"
                >
                    Залишити відгук
                </a>
            </div>
        </div>
    );
}