'use client';

import { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Review } from '@/src/app/reviews/page';

interface AddReviewFormProps {
    onNewReview: (review: Review) => void;
}

export default function AddReviewForm({ onNewReview }: AddReviewFormProps) {
    const [name, setName] = useState('');
    const [text, setText] = useState('');
    const [rating, setRating] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !text || rating < 1 || rating > 5) {
            setError('Будь ласка, заповніть усі поля та оберіть оцінку');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const docRef = await addDoc(collection(db, 'reviews'), {
                name,
                text,
                rating,
                date: serverTimestamp(),
            });

            const newReview: Review = {
                id: docRef.id,
                name,
                text,
                rating,
                date: new Date().toISOString(),
            };

            onNewReview(newReview);

            setName('');
            setText('');
            setRating(0);
        } catch (err) {
            console.error(err);
            setError('Сталася помилка при додаванні відгуку');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto p-6 bg-black border border-orange-500 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-orange-500 mb-5">Залишити відгук</h3>

            {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

            <div className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                        Ім&#39;я
                    </label>
                    <input
                        id="name"
                        type="text"
                        placeholder="Ваше ім'я"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full p-2 bg-neutral-900 border border-orange-500 rounded-lg text-white placeholder-neutral-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 outline-none transition-all duration-300"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="text" className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                        Відгук
                    </label>
                    <textarea
                        id="text"
                        placeholder="Ваш відгук"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        rows={4}
                        className="w-full p-2 bg-neutral-900 border border-orange-500 rounded-lg text-white placeholder-neutral-500 focus:border-orange-400 focus:ring-2 focus:ring-orange-400/50 outline-none transition-all duration-300 resize-y"
                        required
                    />
                </div>

                <div>
                    <label className="block text-xs font-medium text-neutral-400 uppercase tracking-wide mb-2">
                        Оцінка
                    </label>
                    <div className="flex gap-3">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => setRating(i)}
                                className={`text-xl transition-all duration-300 ${
                                    i <= rating ? 'text-orange-500' : 'text-neutral-600'
                                } hover:text-orange-400`}
                                aria-label={`${i} зірок`}
                            >
                                ★
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2 bg-orange-500 text-black font-medium rounded-lg hover:bg-orange-600 transition-all duration-300 disabled:bg-neutral-700 disabled:text-neutral-400 disabled:cursor-not-allowed"
                >
                    {loading ? 'Надсилання...' : 'Надіслати відгук'}
                </button>
            </div>
        </form>
    );
}