import Head from 'next/head';
import ClientAUP from './ClientAUP';

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
}

export default async function AcceptableUsePolicy() {
    const pageData: PageData = {
        title: 'Політика прийнятного використання',
        description: 'Політика прийнятного використання Telegram-бота FoxFlat, який надає інформаційні послуги з моніторингу оголошень про оренду квартир.',
        lastUpdated: '08 травня 2025 року',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <Head>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content="foxflat, політика використання, telegram-бот, оренда квартир" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientAUP pageData={pageData} />
        </div>
    );
}