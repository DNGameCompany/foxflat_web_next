import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

export const metadata = {
    title: 'FoxFlat - Знайди квартиру своєї мрії через Telegram',
    description:
        'FoxFlat - твій Telegram-бот для швидкого пошуку квартир. Отримуй сповіщення про нові пропозиції, використовуй гнучкі фільтри та знаходь житло миттєво!',
    keywords: 'foxflat, telegram-бот, оренда квартир, пошук житла',
    icons: {
        icon: '/favicon.ico',
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
