import Head from 'next/head';
import ClientPrivacyPolicy from './ClientPrivacyPolicy';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
    supportTelegram: string;
    supportEmail: string;
}

export default async function PrivacyPolicyPage() {
    const pageData: PageData = {
        title: 'Політика конфіденційності',
        description: 'Політика конфіденційності Telegram-бота FoxFlat, що регламентує порядок збору, зберігання, обробки та використання персональних даних користувачів.',
        lastUpdated: '08 травня 2025 року',
        supportTelegram: 'https://t.me/FoxFlatSupport',
        supportEmail: 'support@foxflat.com',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <Head>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content="foxflat, політика конфіденційності, telegram-бот, оренда квартир" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientPrivacyPolicy pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}