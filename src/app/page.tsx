import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

export const metadata = {
    title: 'FoxFlat — Telegram-бот для оренди квартир в Україні',
    description:
        'FoxFlat — Telegram-бот для пошуку квартир у Києві, Львові, Одесі та ще 22 містах України. Актуальні оголошення без посередників щодня прямо в Telegram!',
    keywords: [
        'оренда квартир Київ',
        'оренда квартир Львів',
        'зняти квартиру Харків',
        'оренда без посередників',
        'квартири подобово Україна',
        'довгострокова оренда',
        'Telegram бот пошук квартир',
        'FoxFlat житло оренда',
    ],
    icons: {
        icon: '/favicon.ico',
    },
    alternates: {
        canonical: 'https://foxflat.com.ua/',
    },
    openGraph: {
        title: 'FoxFlat — Telegram-бот для оренди квартир',
        description:
            'Шукай квартиру миттєво через зручного Telegram-бота. Всі нові оголошення — в одному місці!',
        url: 'https://foxflat.com.ua/',
        siteName: 'FoxFlat',
        images: [
            {
                url: 'https://foxflat.com.ua/og-image.jpg',
                width: 1200,
                height: 630,
                alt: 'FoxFlat Telegram бот',
            },
        ],
        locale: 'uk_UA',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'FoxFlat — Telegram-бот для оренди квартир',
        description:
            'Отримуй нові квартири миттєво прямо в Telegram. Ніякого спаму — тільки актуальні оголошення!',
        images: ['https://foxflat.com.ua/og-image.jpg'],
    },
};

export default function HomePage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <main>
                {/* прихований заголовок для доступності, головний h1 є в HeroFoxFlat */}
                <h1 className="sr-only">
                    FoxFlat — Telegram-бот для оренди квартир в Україні
                </h1>

                <ClientHome />

                {/* JSON-LD Schema.org */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([
                            {
                                '@context': 'https://schema.org',
                                '@type': 'WebSite',
                                name: 'FoxFlat',
                                url: 'https://foxflat.com.ua/',
                                description:
                                    'Telegram-бот для пошуку квартир у 22 містах України. Оренда без посередників.',
                                potentialAction: {
                                    '@type': 'SearchAction',
                                    target: 'https://foxflat.com.ua/?q={search_term_string}',
                                    'query-input': 'required name=search_term_string',
                                },
                            },
                            {
                                '@context': 'https://schema.org',
                                '@type': 'FAQPage',
                                mainEntity: [
                                    {
                                        '@type': 'Question',
                                        name: 'Як працює FoxFlat?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'FoxFlat збирає нові оголошення про квартири у 22 містах України та надсилає їх тобі прямо в Telegram.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'Чи безкоштовно користуватися?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'Так, зараз преміум-доступ діє безкоштовно. Звичайна вартість — 200 грн/місяць.',
                                        },
                                    },
                                ],
                            },
                        ]),
                    }}
                />
            </main>

            <FooterFoxFlat />
        </div>
    );
}
