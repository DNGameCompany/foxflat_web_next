import Head from 'next/head';
import ClientContacts from './ClientContacts';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

interface PageData {
    title: string;
    description: string;
    telegramLink: string;
}

export default async function ContactsPage() {
    const pageData: PageData = {
        title: 'Зв’яжіться з нами',
        description: 'Маєте запитання чи пропозиції? Напишіть нам у Telegram для підтримки або фідбеку.',
        telegramLink: 'https://t.me/qa_aqa_dmytro',
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <Head>
                <title>{pageData.title}</title>
                <meta name="description" content={pageData.description} />
                <meta name="keywords" content="foxflat, контакти, telegram, оренда квартир" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <ClientContacts pageData={pageData} />
            <FooterFoxFlat />
        </div>
    );
}