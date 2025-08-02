import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

export const metadata = {
    title: 'FoxFlat - Знайди квартиру своєї мрії через Telegram',
    description:
        'FoxFlat - твій Telegram-бот для швидкого пошуку квартир. Отримуй сповіщення про нові пропозиції, використовуй гнучкі фільтри та знаходь житло миттєво!',
    keywords: ['foxflat', 'telegram-бот', 'оренда квартир', 'пошук житла'],
    icons: {
        icon: '/favicon.ico',
    },
    alternates: {
        canonical: 'https://foxflat.com.ua/',
    },
    openGraph: {
        title: 'FoxFlat - Telegram-бот для оренди житла',
        description:
            'Шукай квартиру миттєво через зручного Telegram-бота. Всі нові оголошення — в одному місці!',
        url: 'https://foxflat.com.ua/',
        siteName: 'FoxFlat',
        images: [
            {
                url: 'https://foxflat.com.ua/og-image.jpg', // заміни на свою картинку
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
        title: 'FoxFlat - Telegram-бот для оренди житла',
        description:
            'Отримуй нові квартири миттєво прямо в Telegram. Ніякого спаму – тільки актуальні оголошення!',
        images: ['https://foxflat.com.ua/og-image.jpg'],
    },
};

export default function HomePage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <ClientHome />
            <FooterFoxFlat />
        </div>
    );
}
