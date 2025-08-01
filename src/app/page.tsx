import Head from 'next/head';
import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    advantages: string[];
}

export default async function HomePage() {
    const pageData: PageData = {
        title: 'FoxFlat - Знайди квартиру своєї мрії через Telegram',
        description:
            'FoxFlat - твій Telegram-бот для швидкого пошуку квартир. Отримуй сповіщення про нові пропозиції, використовуй гнучкі фільтри та знаходь житло миттєво!',
        advantages: [
            'Швидкі сповіщення про нові квартири.',
            'Гнучкі фільтри за районом і ціною.',
            'Простий запуск без реєстрації.',
            'Працює 24/7 для тебе.',
            'Оновлення у реальному часі.',
            'Доступно одразу у Telegram.',
        ],
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <Head>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content="foxflat, telegram-бот, оренда квартир, пошук житла" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientHome pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}