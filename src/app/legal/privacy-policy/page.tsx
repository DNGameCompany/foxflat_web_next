import ClientPrivacyPolicy from './ClientPrivacyPolicy';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

export const metadata = {
    title: 'Політика конфіденційності',
    description: 'Політика конфіденційності Telegram-бота FoxFlat, що регламентує порядок збору, зберігання, обробки та використання персональних даних користувачів.',
    keywords: 'foxflat, політика конфіденційності, telegram-бот, оренда квартир',
    icons: {
        icon: '/favicon.ico',
    },
};

interface PageData {
    title: string;
    lastUpdated: string;
    supportTelegram: string;
}

export default function PrivacyPolicyPage() {
    const pageData: PageData = {
        title: 'Політика конфіденційності',
        lastUpdated: '7 жовтня 2026 року',
        supportTelegram: 'https://t.me/FoxFlatSupport',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <ClientPrivacyPolicy pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}