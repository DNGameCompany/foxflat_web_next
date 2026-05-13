import ClientHome from './ClientHome';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';

async function getBlogPreviewPosts() {
    try {
        const res = await fetch(
            'https://api.foxflat.com.ua/blog/posts?published=true&limit=3',
            { next: { revalidate: 3600 } }
        );
        if (!res.ok) return [];
        return res.json();
    } catch {
        return [];
    }
}

export const metadata = {
    title: 'FoxFlat — Telegram-бот для оренди квартир | Київ, Львів, Одеса, Харків',
    description:
        'FoxFlat — Telegram-бот для пошуку квартир без посередників. Оновлення кожні 15 хвилин у 22 містах України: Київ, Львів, Одеса, Харків, Дніпро. Запусти безкоштовно прямо зараз!',
    keywords: [
        // Бренд
        'foxflat',
        'fox flat бот',
        'foxflat telegram',

        // Основні запити (з консолі)
        'оренда бот',
        'оренда та бот',
        'telegram бот оренда квартир',
        'оренда квартир телеграм',
        'орендабот',

        // По містах
        'оренда квартир Київ телеграм',
        'оренда квартир Львів телеграм',
        'оренда квартир Одеса телеграм',
        'оренда квартир Харків телеграм',
        'оренда квартир Дніпро телеграм',
        'оренда квартир Запоріжжя телеграм',

        // Загальні оренда
        'оренда квартир без посередників',
        'зняти квартиру без посередників',
        'зняти квартиру швидко',
        'знайти квартиру Україна',
        'пошук квартир онлайн',
        'актуальні оголошення оренди квартир',
        'нові оголошення оренди квартир',
        'оренда квартир у 22 містах України',

        // За типом аудиторії
        'оренда квартир для студентів',
        'оренда квартир для сімей',
        'оренда квартир з тваринами',
        'довгострокова оренда квартир',
        'квартири подобово Україна',

        // За параметрами
        'оренда квартир з ремонтом',
        'оренда квартир з меблями',
        'оренда квартир біля метро',
        'оренда квартир з інтернетом',
        'однокімнатна квартира оренда',
        'двокімнатна квартира оренда',

        // Проблема яку вирішує
        'як знайти квартиру в Україні',
        'як орендувати квартиру без ріелтора',
        'пошук житла Україна',
        'житло в Україні',
    ],

    icons: { icon: '/favicon.ico' },
    alternates: { canonical: 'https://foxflat.com.ua/' },

    openGraph: {
        title: 'FoxFlat — Знайди квартиру першим через Telegram',
        description:
            'Бот моніторить оголошення кожні 15 хвилин у 22 містах України. Отримуй нові квартири без посередників прямо в Telegram — безкоштовно!',
        url: 'https://foxflat.com.ua/',
        siteName: 'FoxFlat',
        images: [
            {
                url: 'https://foxflat.com.ua/og-image.png',
                width: 1200,
                height: 630,
                alt: 'FoxFlat — Telegram-бот для оренди квартир в Україні',
            },
        ],
        locale: 'uk_UA',
        type: 'website',
    },

    twitter: {
        card: 'summary_large_image',
        title: 'FoxFlat — Знайди квартиру першим через Telegram',
        description:
            'Оновлення кожні 15 хвилин. 22 міста України. Без посередників. Запусти бота безкоштовно!',
        images: ['https://foxflat.com.ua/og-image.png'],
    },
};

export default async function HomePage() {
    const blogPosts = await getBlogPreviewPosts();

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-[#0f0f0f] text-white">
            <main>
                <ClientHome blogPosts={blogPosts} />

                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify([
                            // WebSite schema
                            {
                                '@context': 'https://schema.org',
                                '@type': 'WebSite',
                                name: 'FoxFlat',
                                url: 'https://foxflat.com.ua/',
                                description: 'Telegram-бот для пошуку квартир у 22 містах України. Оренда без посередників.',
                                inLanguage: 'uk-UA',
                                potentialAction: {
                                    '@type': 'SearchAction',
                                    target: 'https://foxflat.com.ua/?q={search_term_string}',
                                    'query-input': 'required name=search_term_string',
                                },
                            },
                            // SoftwareApplication schema — для Telegram-бота
                            {
                                '@context': 'https://schema.org',
                                '@type': 'SoftwareApplication',
                                name: 'FoxFlat',
                                applicationCategory: 'BusinessApplication',
                                operatingSystem: 'Telegram',
                                url: 'https://t.me/FoxFlat_bot',
                                description: 'Telegram-бот для пошуку оренди квартир без посередників у 22 містах України. Оновлення кожні 15 хвилин.',
                                offers: {
                                    '@type': 'Offer',
                                    price: '0',
                                    priceCurrency: 'UAH',
                                    description: 'Безкоштовний базовий доступ. Преміум — 200 грн/міс.',
                                },
                                aggregateRating: {
                                    '@type': 'AggregateRating',
                                    ratingValue: '4.9',
                                    ratingCount: '2400',
                                },
                            },
                            // Organization schema
                            {
                                '@context': 'https://schema.org',
                                '@type': 'Organization',
                                name: 'FoxFlat',
                                url: 'https://foxflat.com.ua/',
                                logo: 'https://foxflat.com.ua/og-image.png',
                                contactPoint: {
                                    '@type': 'ContactPoint',
                                    contactType: 'customer support',
                                    url: 'https://t.me/qa_aqa_dmytro',
                                    availableLanguage: 'Ukrainian',
                                },
                                sameAs: ['https://t.me/FoxFlat_bot'],
                            },
                            // FAQPage schema — розширені фрагменти у пошуку
                            {
                                '@context': 'https://schema.org',
                                '@type': 'FAQPage',
                                mainEntity: [
                                    {
                                        '@type': 'Question',
                                        name: 'Скільки коштує використання FoxFlat?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'Зараз преміум-доступ тимчасово безкоштовний для нових користувачів. Стандартна ціна сервісу — 200 грн на місяць. У безкоштовному тарифі доступний базовий пошук квартир з обмеженнями.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'Яка різниця між Free та Premium?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'Free дає базовий пошук квартир з обмеженнями: сповіщення приходять кожні 30 хвилин, можна змінювати фільтри лише раз на добу і відкривати до 3 оголошень на день. Premium відкриває всі можливості: миттєві сповіщення, повний набір фільтрів (район, площа, поверх), необмежені зміни параметрів пошуку та необмежену кількість переходів на оголошення.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'У яких містах працює бот?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'FoxFlat працює у 22 містах України: Київ, Львів, Одеса, Харків, Дніпро, Запоріжжя, Вінниця, Миколаїв, Херсон, Чернігів, Полтава, Черкаси, Суми, Житомир, Рівне, Луцьк, Тернопіль, Хмельницький, Кропивницький, Ужгород, Івано-Франківськ та Чернівці.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'Як швидко приходять нові оголошення?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'FoxFlat перевіряє нові оголошення кожні 15 хвилин. У Premium користувачі отримують сповіщення практично миттєво (кожні кілька хвилин). У Free тарифі оголошення надсилаються підбіркою приблизно раз на 30 хвилин.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'Чи можна налаштувати фільтри пошуку?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'Так. Ти можеш фільтрувати оголошення за містом, ціною, кількістю кімнат та іншими параметрами. У Premium доступний повний набір фільтрів, включаючи район, площу, поверх та можливість використовувати кілька значень одночасно.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'FoxFlat — це агентство нерухомості?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'Ні. FoxFlat — це сервіс моніторингу оголошень. Ми збираємо публічні оголошення з популярних платформ і надсилаємо їх тобі.',
                                        },
                                    },
                                    {
                                        '@type': 'Question',
                                        name: 'Що робити, якщо бот не надсилає сповіщення?',
                                        acceptedAnswer: {
                                            '@type': 'Answer',
                                            text: 'Перевір налаштування фільтрів — можливо критерії занадто вузькі. Також переконайся, що бот не заблокований у Telegram. Якщо проблема не зникає — напиши нам у підтримку, і ми допоможемо.',
                                        },
                                    },
                                ],
                            },
                            // VideoObject schema
                            {
                                '@context': 'https://schema.org',
                                '@type': 'VideoObject',
                                name: 'FoxFlat — як працює Telegram-бот для оренди квартир',
                                description: 'Демо роботи FoxFlat: налаштування фільтрів, отримання сповіщень про нові квартири в Telegram у 22 містах України.',
                                thumbnailUrl: 'https://foxflat.com.ua/images/video-thumb.jpg',
                                uploadDate: '2025-01-01T00:00:00+02:00',
                                contentUrl: 'https://foxflat.com.ua/videos/phone-screen-video.mp4',
                                embedUrl: 'https://foxflat.com.ua/',
                                duration: 'PT12S',
                                inLanguage: 'uk-UA',
                                publisher: {
                                    '@type': 'Organization',
                                    name: 'FoxFlat',
                                    url: 'https://foxflat.com.ua',
                                },
                            },
                        ]),
                    }}
                />
            </main>

            <FooterFoxFlat />
        </div>
    );
}