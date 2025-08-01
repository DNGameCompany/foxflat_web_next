import Head from 'next/head';
import ClientPublicOffer from './ClientPublicOffer';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    lastUpdated: string;
    supportTelegram: string;
    supportEmail: string;
    offerUrl: string;
    botUrl: string;
    aupUrl: string;
    privacyPolicyUrl: string;
    executorDetails: {
        name: string;
        rnokpp: string;
        bankAccount: string;
    };
}

export default async function TermsOfServicePage() {
    const pageData: PageData = {
        title: 'Договір публічної оферти',
        description: 'Договір публічної оферти для використання Telegram-бота FoxFlat, який визначає умови надання інформаційних послуг.',
        lastUpdated: '28 липня 2025 року',
        supportTelegram: 'https://t.me/FoxFlatSupport',
        supportEmail: 'support@foxflat.com',
        offerUrl: 'https://flatfox.com/offer',
        botUrl: 'https://t.me/foxflat_bot',
        aupUrl: 'https://flatfox.com/aup',
        privacyPolicyUrl: 'https://flatfox.com/privacy-policy',
        executorDetails: {
            name: 'ФОП Айдогдиєв Дмитро Романович',
            rnokpp: '[вкажіть номер]',
            bankAccount: '[вкажіть банківські реквізити]',
        },
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <Head>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content="foxflat, договір оферти, telegram-бот, оренда квартир" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientPublicOffer pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}