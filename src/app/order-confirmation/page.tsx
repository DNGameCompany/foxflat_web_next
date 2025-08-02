import ClientThankYou from './ClientThankYou';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

export const metadata = {
    title: 'Дякуємо за оплату!',
    description: 'Ваш платіж успішно оброблено. Доступ до функцій FoxFlat буде активовано автоматично.',
    keywords: 'foxflat, оплата, telegram, оренда квартир',
    icons: {
        icon: '/favicon.ico',
    },
};

interface PageData {
    title: string;
    description: string;
    telegramLink: string;
    imageSrc: string;
    imageAlt: string;
}

export default function ThankYouPage() {
    const pageData: PageData = {
        title: 'Дякуємо за оплату!',
        description: 'Ваш платіж успішно оброблено. Доступ до функцій FoxFlat буде активовано автоматично.',
        telegramLink: 'https://t.me/pobazhannyaUA_bot',
        imageSrc: '/images/snapedit_1745754407639-removebg-preview.png',
        imageAlt: 'Логотип FlatFox',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white flex items-center justify-center px-6">
            <ClientThankYou pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}
