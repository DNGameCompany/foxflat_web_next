import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

export const metadata = {
    title: 'FoxFlat — Telegram-бот для оренди квартир в Україні',
    description:
        'Швидкий пошук квартир через Telegram-бот FoxFlat. Отримуй актуальні пропозиції та знайди житло мрії миттєво!',
    keywords: ['оренда квартир', 'пошук житла', 'Telegram-бот', 'квартири Україна', 'FoxFlat'],
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
                {/* SEO заголовок для пошукових систем */}
                <h1 className="sr-only">
                    FoxFlat — Telegram-бот для оренди квартир в Україні
                </h1>

                {/* Основний контент */}
                <ClientHome />
            </main>

            {/* Підвал сайту */}
            <FooterFoxFlat />
        </div>
    );
}
