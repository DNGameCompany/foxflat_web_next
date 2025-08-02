// app/contacts/page.tsx

import ClientContacts from './ClientContacts';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    telegramLink: string;
}

export const metadata = {
    title: 'Контакти FoxFlat — Telegram, форма, підтримка',
    description:
        'Зв’яжіться з командою FoxFlat через Telegram або форму зворотного зв’язку. Ми допоможемо з орендою квартир, відповіддю на запитання чи співпрацею.',
    keywords: ['foxflat', 'контакти', 'telegram', 'оренда квартир', 'зв’язатися', 'підтримка'],
    robots: {
        index: true,
        follow: true,
    },
    openGraph: {
        title: 'Контакти FoxFlat — Telegram, форма, підтримка',
        description:
            'Напишіть нам у Telegram або скористайтесь формою для звʼязку. Підтримка FoxFlat завжди на зв’язку.',
        url: 'https://foxflat.com.ua/contacts',
        siteName: 'FoxFlat',
        images: [
            {
                url: '/og-image.png', // Додай цю картинку у public/
                width: 1200,
                height: 630,
                alt: 'Контакти FoxFlat',
            },
        ],
        locale: 'uk_UA',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Контакти FoxFlat',
        description: 'Зв’яжіться з нами через Telegram або форму.',
        images: ['/og-image.png'],
    },
    alternates: {
        canonical: 'https://foxflat.com.ua/contacts',
    },
};

export default async function ContactsPage() {
    const pageData: PageData = {
        title: 'Контакти FoxFlat',
        description:
            'Зв’яжіться з нашою командою для підтримки, запитів чи співпраці через Telegram або форму зворотного зв’язку.',
        telegramLink: 'https://t.me/qa_aqa_dmytro',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <ClientContacts pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}
