import { Metadata } from 'next';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import ClientReviews from './ClientReviews';
import { generateReviewsSchema } from './schema';
import { db } from '@/lib/firebase';

export const metadata: Metadata = {
    title: 'Відгуки користувачів FoxFlat — Реальні історії оренди квартир',
    description:
        'Читайте чесні відгуки користувачів Telegram-бота FoxFlat, який допомагає швидко знаходити квартири для оренди без посередників в Україні.',
    keywords:
        'foxflat, відгуки, бот оренда квартир, оренда без посередників, знайти квартиру, telegram бот, оренда Україна',
    openGraph: {
        title: 'Відгуки користувачів FoxFlat 🦊',
        description:
            'Реальні історії людей, які знайшли квартири за допомогою Telegram-бота FoxFlat.',
        url: 'https://foxflat.app/reviews',
        siteName: 'FoxFlat',
        locale: 'uk_UA',
        type: 'website',
        images: [
            {
                url: '/og/reviews-cover.jpg',
                width: 1200,
                height: 630,
                alt: 'Відгуки користувачів FoxFlat',
            },
        ],
    },
    alternates: {
        canonical: 'https://foxflat.com.ua/reviews',
    },
    robots: { index: true, follow: true },
};

export interface Review {
    id: string;
    name: string;
    text: string;
    rating: number;
    date: string | null; // ✅ тепер звичайний рядок
}

async function getReviews(): Promise<Review[]> {
    const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
    const snapshot = await getDocs(q);

    // 🔧 Перетворюємо Firestore Timestamp у рядок
    return snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
            id: doc.id,
            name: data.name,
            text: data.text,
            rating: data.rating,
            date: data.date?.toDate ? data.date.toDate().toISOString() : null,
        };
    });
}

export default async function ReviewsPage() {
    const reviews = await getReviews();
    const schemaData = generateReviewsSchema(reviews);

    return <ClientReviews reviews={reviews} schemaData={schemaData} />;
}
