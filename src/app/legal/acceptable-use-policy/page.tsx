import ClientAUP from './ClientAUP';

export const metadata = {
    title: 'Політика прийнятного використання',
    description: 'Політика прийнятного використання Telegram-бота FoxFlat, який надає інформаційні послуги з моніторингу оголошень про оренду квартир.',
    keywords: 'foxflat, політика використання, telegram-бот, оренда квартир',
    icons: {
        icon: '/favicon.ico',
    },
};

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
}

export default function AcceptableUsePolicy() {
    const pageData: PageData = {
        title: 'Політика прийнятного використання',
        description: 'Політика прийнятного використання Telegram-бота FoxFlat, який надає інформаційні послуги з моніторингу оголошень про оренду квартир.',
        lastUpdated: '08 травня 2025 року',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <ClientAUP pageData={pageData} />
        </div>
    );
}
