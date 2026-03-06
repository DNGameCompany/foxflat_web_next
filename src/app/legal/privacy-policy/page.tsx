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
    description: string;
    lastUpdated: string;
    supportTelegram: string;
    supportEmail: string;
}

export default function PrivacyPolicyPage() {
    const pageData: PageData = {
        title: 'Політика конфіденційності',
        description: 'Політика конфіденційності Telegram-бота FoxFlat, що регламентує порядок збору, зберігання, обробки та використання персональних даних користувачів.',
        lastUpdated: '08 травня 2025 року',
        supportTelegram: 'https://t.me/qa_aqa_dmytro',
        supportEmail: 'support@foxflat.com',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <ClientPrivacyPolicy pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}
