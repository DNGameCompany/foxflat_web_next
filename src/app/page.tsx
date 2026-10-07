import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';
import { faqs } from '@/src/components/main/faqData';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export const revalidate = 3600;

async function getBlogPreviewPosts() {
    try {
        const res = await fetch(
            'https://api.foxflat.com.ua/blog/posts?published=true&limit=3',
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

async function getHomePageReviews() {
    try {
        const q = query(collection(db, 'reviews'), orderBy('date', 'desc'));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            name: doc.data().name || '',
            text: doc.data().text || '',
            rating: doc.data().rating || 0,
            date: doc.data().date?.toDate?.().toISOString() || null,
        }));
    } catch {
        return [];
    }
}

export const metadata = {
    title: 'FoxFlat — Telegram-бот, який сповіщає про нові оголошення оренди квартир',
    description:
        'FoxFlat — Telegram-бот, який надсилає нові оголошення про оренду квартир за твоїми фільтрами. Платформи перевіряються кожні 15 хвилин у 22 містах України: Київ, Львів, Одеса, Харків, Дніпро. Безкоштовний старт.',
    keywords: [
        // Бренд
        'foxflat',
        'fox flat бот',
        'foxflat telegram',

        // Основні запити (з консолі)
        'оренда бот',
        'оренда та бот',
        'telegram бот оренда квартир',
        'оренда квартир телеграм',
        'орендабот',

        // По містах
        'оренда квартир Київ телеграм',
        'оренда квартир Львів телеграм',
        'оренда квартир Одеса телеграм',
        'оренда квартир Харків телеграм',
        'оренда квартир Дніпро телеграм',
        'оренда квартир Запоріжжя телеграм',

        // Загальні оренда
        'зняти квартиру швидко',
        'знайти квартиру Україна',
        'нові оголошення оренди квартир',
        'сповіщення про нові оголошення оренда',
        'оренда квартир у 22 містах України',

        // За типом аудиторії
        'оренда квартир для студентів',
        'оренда квартир для сімей',
        'оренда квартир з тваринами',
        'довгострокова оренда квартир',
        'квартири подобово Україна',

        // За параметрами
        'оренда квартир з ремонтом',
        'оренда квартир з меблями',
        'оренда квартир біля метро',
        'оренда квартир з інтернетом',
        'однокімнатна квартира оренда',
        'двокімнатна квартира оренда',

        // Проблема яку вирішує
        'як знайти квартиру в Україні',
        'житло в Україні',
    ],

    icons: { icon: '/favicon.ico' },
    alternates: { canonical: 'https://foxflat.com.ua/' },

    openGraph: {
        title: 'FoxFlat — Дізнавайся про нові квартири в оренду першим',
        description:
            'Бот перевіряє платформи кожні 15 хвилин і надсилає нові оголошення за твоїми фільтрами прямо в Telegram. 22 міста України, безкоштовний старт.',
        url: 'https://foxflat.com.ua/',
        siteName: 'FoxFlat',
        images: [
            {
                url: 'https://foxflat.com.ua/og-image.png',
                width: 1200,
                height: 630,
                alt: 'FoxFlat — Telegram-бот, який сповіщає про нові оголошення оренди квартир',
            },
        ],
        locale: 'uk_UA',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'FoxFlat — Дізнавайся про нові квартири в оренду першим',
        description:
            'Нові оголошення за твоїми фільтрами в Telegram. Перевірка кожні 15 хвилин, 22 міста України. Безкоштовний старт.',
        images: ['https://foxflat.com.ua/og-image.png'],
    },
};

export default async function HomePage() {
    const [blogPosts, reviews] = await Promise.all([
        getBlogPreviewPosts(),
        getHomePageReviews(),
    ]);

    const ratingCount = reviews.length;
    const avgRating = ratingCount > 0
        ? (reviews.reduce((s: number, r: { rating: number }) => s + r.rating, 0) / ratingCount).toFixed(1)
        : '4.9';

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0f0f0f] text-white">
            <main>
                <ClientHome blogPosts={blogPosts} initialReviews={reviews} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([
                            // WebSite schema
                            {
                                '@context': 'https://schema.org',
                                '@type': 'WebSite',
                                name: 'FoxFlat',
                                url: 'https://foxflat.com.ua/',
                                description: 'Telegram-бот, який надсилає нові оголошення про оренду квартир за фільтрами користувача у 22 містах України.',
                                inLanguage: 'uk-UA',
                            },
                            // SoftwareApplication schema — для Telegram-бота
                            {
                                '@context': 'https://schema.org',
                                '@type': 'SoftwareApplication',
                                name: 'FoxFlat',
                                applicationCategory: 'BusinessApplication',
                                operatingSystem: 'Telegram',
                                url: 'https://t.me/FoxFlat_bot',
                                description: 'Telegram-бот, який надсилає нові оголошення про оренду квартир за фільтрами користувача у 22 містах України. Платформи перевіряються кожні 15 хвилин.',
                                offers: {
                                    '@type': 'Offer',
                                    price: '0',
                                    priceCurrency: 'UAH',
                                    description: 'Безкоштовний тариф. Преміум — 99 грн на 7 днів або 199 грн на місяць.',
                                },
                                ...(ratingCount > 0 ? {
                                    aggregateRating: {
                                        '@type': 'AggregateRating',
                                        ratingValue: avgRating,
                                        ratingCount,
                                    },
                                } : {}),
                            },
                            // Organization schema
                            {
                                '@context': 'https://schema.org',
                                '@type': 'Organization',
                                name: 'FoxFlat',
                                url: 'https://foxflat.com.ua/',
                                logo: 'https://foxflat.com.ua/og-image.png',
                                contactPoint: {
                                    '@type': 'ContactPoint',
                                    contactType: 'customer support',
                                    url: 'https://t.me/FoxFlatSupport',
                                    availableLanguage: 'Ukrainian',
                                },
                                sameAs: ['https://t.me/FoxFlat_bot'],
                            },
                            // FAQPage schema — береться з того ж файлу, що й видимий FAQ
                            {
                                '@context': 'https://schema.org',
                                '@type': 'FAQPage',
                                mainEntity: faqs.map((item) => ({
                                    '@type': 'Question',
                                    name: item.q,
                                    acceptedAnswer: {
                                        '@type': 'Answer',
                                        text: item.a,
                                    },
                                })),
                            },
                        ]),
                    }}
                />
            </main>

            <FooterFoxFlat />
        </div>
    );
}