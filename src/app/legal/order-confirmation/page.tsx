import Head from 'next/head';
import ClientThankYou from './ClientThankYou';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    telegramLink: string;
    imageSrc: string;
    imageAlt: string;
}

export default async function ThankYouPage() {
    const pageData: PageData = {
        title: 'Дякуємо за оплату!',
        description: 'Ваш платіж успішно оброблено. Доступ до функцій FoxFlat буде активовано автоматично.',
        telegramLink: 'https://t.me/pobazhannyaUA_bot',
        imageSrc: '/images/snapedit_1745754407639-removebg-preview.png',
        imageAlt: 'Логотип FlatFox',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center px-6">
            <Head>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content="foxflat, оплата, telegram, оренда квартир" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientThankYou pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}