import React from 'react';
// app/misto/[slug]/page.tsx

import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import HeaderFoxFlat from '@/src/components/HeaderFoxFlat';
import FooterFoxFlat from '@/src/components/FooterFoxFlat';
import Link from 'next/link';

export const revalidate = 86400; // ISR — раз на добу

const cities: Record<string, { name: string; nameGen: string; region: string }> = {
    kyiv:             { name: 'Київ',            nameGen: 'Києві',           region: 'Київська область' },
    lviv:             { name: 'Львів',           nameGen: 'Львові',          region: 'Львівська область' },
    odesa:            { name: 'Одеса',           nameGen: 'Одесі',           region: 'Одеська область' },
    kharkiv:          { name: 'Харків',          nameGen: 'Харкові',         region: 'Харківська область' },
    dnipro:           { name: 'Дніпро',          nameGen: 'Дніпрі',          region: 'Дніпропетровська область' },
    zaporizhzhia:     { name: 'Запоріжжя',       nameGen: 'Запоріжжі',       region: 'Запорізька область' },
    vinnytsia:        { name: 'Вінниця',         nameGen: 'Вінниці',         region: 'Вінницька область' },
    mykolaiv:         { name: 'Миколаїв',        nameGen: 'Миколаєві',       region: 'Миколаївська область' },
    chernihiv:        { name: 'Чернігів',        nameGen: 'Чернігові',       region: 'Чернігівська область' },
    poltava:          { name: 'Полтава',         nameGen: 'Полтаві',         region: 'Полтавська область' },
    cherkasy:         { name: 'Черкаси',         nameGen: 'Черкасах',        region: 'Черкаська область' },
    sumy:             { name: 'Суми',            nameGen: 'Сумах',           region: 'Сумська область' },
    zhytomyr:         { name: 'Житомир',         nameGen: 'Житомирі',        region: 'Житомирська область' },
    rivne:            { name: 'Рівне',           nameGen: 'Рівному',         region: 'Рівненська область' },
    lutsk:            { name: 'Луцьк',           nameGen: 'Луцьку',          region: 'Волинська область' },
    ternopil:         { name: 'Тернопіль',       nameGen: 'Тернополі',       region: 'Тернопільська область' },
    khmelnytskyi:     { name: 'Хмельницький',    nameGen: 'Хмельницькому',   region: 'Хмельницька область' },
    kropyvnytskyi:    { name: 'Кропивницький',   nameGen: 'Кропивницькому',  region: 'Кіровоградська область' },
    uzhhorod:         { name: 'Ужгород',         nameGen: 'Ужгороді',        region: 'Закарпатська область' },
    'ivano-frankivsk':{ name: 'Івано-Франківськ',nameGen: 'Івано-Франківську',region: 'Івано-Франківська область' },
    chernivtsi:       { name: 'Чернівці',        nameGen: 'Чернівцях',       region: 'Чернівецька область' },
    kherson:          { name: 'Херсон',          nameGen: 'Херсоні',         region: 'Херсонська область' },
};

type CityContent = {
    price1br: string;
    price2br: string;
    districts: string[];
    tip: string;
};

const cityContent: Record<string, CityContent> = {
    kyiv: {
        price1br: '12 000–22 000 грн/міс',
        price2br: '18 000–35 000 грн/міс',
        districts: ['Шевченківський', 'Печерський', 'Подільський', 'Голосіївський', 'Дарницький', 'Деснянський', 'Оболонський', 'Солом\'янський'],
        tip: 'Центральні райони (Печерськ, Шевченківський) — найдорожчі. Лівий берег (Дарниця, Деснянський) пропонує значно доступніші варіанти при гарній транспортній доступності. Попит на оренду в Києві стабільно високий, тому нові оголошення розлітаються за години.',
    },
    lviv: {
        price1br: '8 000–16 000 грн/міс',
        price2br: '14 000–26 000 грн/міс',
        districts: ['Шевченківський', 'Личаківський', 'Залізничний', 'Сихівський', 'Франківський', 'Галицький'],
        tip: 'Львів — одне з найдорожчих міст після Києва. Центр та Личаківський район ціняться за атмосферу, Сихів — популярний серед сімей завдяки розвиненій інфраструктурі. Попит перевищує пропозицію, особливо у 1-кімнатних квартирах.',
    },
    odesa: {
        price1br: '7 000–15 000 грн/міс',
        price2br: '12 000–24 000 грн/міс',
        districts: ['Приморський', 'Київський', 'Малиновський', 'Суворовський', 'Хаджибейський'],
        tip: 'В Одесі ціни суттєво варіюються залежно від близькості до моря та центру. Приморський район — найдорожчий. Малиновський та Суворовський пропонують доступніші варіанти для тривалої оренди.',
    },
    kharkiv: {
        price1br: '6 000–12 000 грн/міс',
        price2br: '10 000–18 000 грн/міс',
        districts: ['Шевченківський', 'Київський', 'Немишлянський', 'Новобаварський', 'Холодногірський', 'Слобідський'],
        tip: 'Харків має широкий вибір квартир у різних цінових категоріях. Шевченківський район — найпопулярніший серед студентів та молоді. Новобаварський та Немишлянський — добрий вибір для сімей.',
    },
    dnipro: {
        price1br: '7 000–14 000 грн/міс',
        price2br: '12 000–22 000 грн/міс',
        districts: ['Центральний', 'Амур-Нижньодніпровський', 'Індустріальний', 'Лівобережний', 'Новокодацький', 'Соборний'],
        tip: 'Центральний район Дніпра — найбільш затребуваний, Соборний і Лівобережний пропонують компромісний варіант. Ринок оренди активний — нові якісні пропозиції з\'являються щодня.',
    },
    zaporizhzhia: {
        price1br: '5 000–10 000 грн/міс',
        price2br: '8 000–15 000 грн/міс',
        districts: ['Олександрівський', 'Заводський', 'Комунарський', 'Хортицький', 'Шевченківський'],
        tip: 'Запоріжжя пропонує одні з найдоступніших цін серед великих міст України. Олександрівський та Хортицький райони — найбільш популярні для оренди серед переселенців та місцевих мешканців.',
    },
    vinnytsia: {
        price1br: '5 000–10 000 грн/міс',
        price2br: '8 000–15 000 грн/міс',
        districts: ['Замостянський', 'Ленінський', 'Старомістський', 'Тяжилівка'],
        tip: 'Вінниця — комфортне місто з розвиненою інфраструктурою. Центральні мікрорайони цінуються за близькість до ділового центру, нові мікрорайони — за сучасне планування та парковки.',
    },
    mykolaiv: {
        price1br: '5 000–9 000 грн/міс',
        price2br: '8 000–14 000 грн/міс',
        districts: ['Центральний', 'Заводський', 'Корабельний', 'Інгульський'],
        tip: 'Миколаїв пропонує доступне житло з достатньо розвиненою інфраструктурою. Центральний та Інгульський райони — найбільш зручні для проживання та пересування містом.',
    },
    chernihiv: {
        price1br: '4 500–8 500 грн/міс',
        price2br: '7 000–13 000 грн/міс',
        districts: ['Деснянський', 'Новозаводський', 'Центр'],
        tip: 'Чернігів — затишне місто з невисокими цінами на оренду. Центральна частина та Деснянський район найбільш популярні. Попит активізувався через приплив переселенців.',
    },
    poltava: {
        price1br: '5 000–9 000 грн/міс',
        price2br: '8 000–14 000 грн/міс',
        districts: ['Центр', 'Подільський', 'Шевченківський', 'Київський'],
        tip: 'Полтава — зручне для проживання місто з хорошою транспортною мережею. Центр та Шевченківський район — найпопулярніші. Доступне житло переважно у нових мікрорайонах.',
    },
    cherkasy: {
        price1br: '4 500–8 000 грн/міс',
        price2br: '7 000–13 000 грн/міс',
        districts: ['Центр', 'Митниця', 'Придніпровський', 'Новомикільський'],
        tip: 'Черкаси — місто на Дніпрі з доступними цінами на оренду. Центральний район і набережна — найбажаніші локації. Для економного бюджету підходять Придніпровський та Новомикільський райони.',
    },
    sumy: {
        price1br: '4 500–8 000 грн/міс',
        price2br: '7 000–12 000 грн/міс',
        districts: ['Центр', 'Ковпаківський', 'Зарічний'],
        tip: 'Суми мають доступний ринок оренди з достатнім вибором квартир. Центр міста та Ковпаківський район найбільш затребувані серед орендарів.',
    },
    zhytomyr: {
        price1br: '4 500–8 000 грн/міс',
        price2br: '7 000–13 000 грн/міс',
        districts: ['Центр', 'Богунський', 'Корольовський'],
        tip: 'Житомир — місто з відносно низькими цінами на оренду. Богунський і Корольовський райони популярні серед сімей, центр — серед молоді та студентів.',
    },
    rivne: {
        price1br: '5 000–10 000 грн/міс',
        price2br: '8 000–15 000 грн/міс',
        districts: ['Центр', 'Північний', 'Ювілейний', 'Мотель'],
        tip: 'Рівне активно приймає переселенців, тому попит на оренду зріс. Центр і Ювілейний мікрорайон найпопулярніші. Вибір достатній, але якісні квартири розходяться швидко.',
    },
    lutsk: {
        price1br: '5 000–10 000 грн/міс',
        price2br: '8 000–15 000 грн/міс',
        districts: ['Центр', 'Кічкарівка', 'Вишків', 'ПМК'],
        tip: 'Луцьк — компактне місто з хорошою інфраструктурою. Центр і Кічкарівка — найпопулярніші райони. Після 2022 року попит на оренду суттєво зріс.',
    },
    ternopil: {
        price1br: '5 000–9 500 грн/міс',
        price2br: '8 000–15 000 грн/міс',
        districts: ['Центр', 'Аляска', 'Дружба', 'Канада'],
        tip: 'Тернопіль — університетське місто з активним ринком оренди. Студентські квартали розташовані поблизу вузів. Мікрорайони "Канада" та "Дружба" популярні серед сімей.',
    },
    khmelnytskyi: {
        price1br: '5 000–9 500 грн/міс',
        price2br: '8 000–15 000 грн/міс',
        districts: ['Центр', 'Раківка', 'Гречани', 'Озерна'],
        tip: 'Хмельницький активно розвивається, попит на оренду стабільний. Центр і Раківка — найбільш запитані локації. Нові мікрорайони пропонують сучасні квартири за розумними цінами.',
    },
    kropyvnytskyi: {
        price1br: '4 000–7 500 грн/міс',
        price2br: '6 500–12 000 грн/міс',
        districts: ['Центр', 'Фортечний', 'Подільський'],
        tip: 'Кропивницький пропонує одні з найнижчих цін серед обласних центрів. Центр і Фортечний район — найзручніші для мешкання. Хороший вибір для бюджетної оренди.',
    },
    uzhhorod: {
        price1br: '6 000–13 000 грн/міс',
        price2br: '10 000–20 000 грн/міс',
        districts: ['Центр', 'Нове місто', 'Радванка', 'Шахта'],
        tip: 'Ужгород — найдорожче місто Закарпаття завдяки близькості до кордону з ЄС. Центр та Нове місто — найбажаніші локації. Попит стабільно перевищує пропозицію.',
    },
    'ivano-frankivsk': {
        price1br: '5 500–11 000 грн/міс',
        price2br: '9 000–17 000 грн/міс',
        districts: ['Центр', 'Пасічна', 'Бам', 'Каскад'],
        tip: 'Івано-Франківськ активно зростає і залучає переселенців. Центр і Пасічна — найпопулярніші для оренди. Вибір новобудов більший ніж у більшості обласних центрів.',
    },
    chernivtsi: {
        price1br: '5 000–10 000 грн/міс',
        price2br: '8 000–16 000 грн/міс',
        districts: ['Центр', 'Проспект', 'Першотравневий', 'Роша'],
        tip: 'Чернівці — красиве університетське місто з активним ринком оренди. Центр та район Проспекту найбільш популярні. Попит на якісні квартири суттєво зріс після 2022 року.',
    },
    kherson: {
        price1br: '3 500–7 000 грн/міс',
        price2br: '5 500–10 000 грн/міс',
        districts: ['Дніпровський', 'Корабельний', 'Суворовський'],
        tip: 'Херсон має невисокі ціни порівняно з іншими обласними центрами. Ринок оренди невеликий, але FoxFlat відстежує всі нові оголошення і надсилає їх миттєво.',
    },
};

export async function generateStaticParams() {
    return Object.keys(cities).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const city = cities[slug];
    if (!city) return {};

    return {
        title: `Оренда квартир у ${city.nameGen} через Telegram — FoxFlat`,
        description: `Знаходь квартири у ${city.nameGen} першим через Telegram-бот FoxFlat. Оновлення кожні 15 хвилин, без посередників і комісій. Запусти безкоштовно!`,
        keywords: [
            `оренда квартир ${city.name}`,
            `оренда квартир ${city.name} телеграм`,
            `зняти квартиру ${city.name}`,
            `знайти квартиру ${city.name}`,
            `квартири ${city.name} без посередників`,
            `telegram бот оренда ${city.name}`,
            `оренда ${city.name} бот`,
            `житло ${city.name}`,
            `${city.region} оренда квартир`,
        ],
        alternates: { canonical: `https://foxflat.com.ua/misto/${slug}` },
        openGraph: {
            title: `Оренда квартир у ${city.nameGen} — FoxFlat`,
            description: `Telegram-бот FoxFlat надсилає нові квартири у ${city.nameGen} кожні 15 хвилин. Без посередників!`,
            url: `https://foxflat.com.ua/misto/${slug}`,
            siteName: 'FoxFlat',
            locale: 'uk_UA',
            type: 'website',
            images: [{ url: 'https://foxflat.com.ua/og-image.png', width: 1200, height: 630 }],
        },
    };
}

export default async function CityPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const city = cities[slug];
    if (!city) notFound();

    const content = cityContent[slug] ?? null;
    const otherCities = Object.entries(cities)
        .filter(([s]) => s !== slug);

    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            name: `Оренда квартир у ${city.nameGen} через Telegram — FoxFlat`,
            description: `Знаходь квартири у ${city.nameGen} першим через Telegram-бот FoxFlat.`,
            url: `https://foxflat.com.ua/misto/${slug}`,
            breadcrumb: {
                '@type': 'BreadcrumbList',
                itemListElement: [
                    { '@type': 'ListItem', position: 1, name: 'Головна', item: 'https://foxflat.com.ua/' },
                    { '@type': 'ListItem', position: 2, name: 'Міста', item: 'https://foxflat.com.ua/misto' },
                    { '@type': 'ListItem', position: 3, name: city.name, item: `https://foxflat.com.ua/misto/${slug}` },
                ],
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Service',
            name: `Оренда квартир у ${city.nameGen} через Telegram — FoxFlat`,
            description: `Telegram-бот для пошуку квартир у ${city.nameGen} без посередників. Оновлення кожні 15 хвилин.`,
            url: `https://foxflat.com.ua/misto/${slug}`,
            provider: {
                '@type': 'Organization',
                name: 'FoxFlat',
                url: 'https://foxflat.com.ua',
            },
            areaServed: {
                '@type': 'City',
                name: city.name,
                containedInPlace: {
                    '@type': 'AdministrativeArea',
                    name: city.region,
                },
            },
            serviceType: 'Пошук квартир для оренди',
            offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'UAH',
                description: 'Безкоштовний базовий доступ. Преміум — 200 грн/міс.',
            },
        },
    ];

    return (
        <div className="bg-[#0f0f0f] text-white min-h-screen">
            <HeaderFoxFlat />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Hero */}
            <section className="relative pt-36 pb-20 px-6 text-center overflow-hidden">
                <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 65%)' }}
                />
                <div className="relative max-w-3xl mx-auto">
                    <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4"
                       style={{ fontFamily: "'Unbounded', sans-serif" }}>
                        {city.region}
                    </p>
                    <h1
                        className="font-black leading-tight mb-5"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: 'clamp(26px, 4vw, 50px)',
                            letterSpacing: '-1.5px',
                        }}
                    >
                        Оренда квартир у {city.nameGen}
                    </h1>
                    <p className="text-white/40 text-base leading-relaxed max-w-lg mx-auto mb-10">
                        FoxFlat надсилає нові оголошення у {city.nameGen} кожні 15 хвилин прямо в Telegram.
                        Без посередників, без реєстрації — просто запусти бота.
                    </p>
                    <a
                        href={`https://t.me/FoxFlat_bot?start=website_${slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-3 bg-orange-500 hover:bg-transparent hover:text-orange-500 text-black font-bold border-2 border-orange-500 px-8 py-4 rounded-xl transition-all duration-200"
                        style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '12px' }}
                    >
                        Знайти квартиру в {city.nameGen}
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                            <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </a>
                </div>
            </section>

            {/* Переваги */}
            <section className="px-6 pb-20 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { num: '15 хв', label: `Оновлення у ${city.nameGen}` },
                        { num: '0 грн', label: 'Безкоштовний старт' },
                        { num: '24/7', label: 'Моніторинг оголошень' },
                    ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-7 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
                            <p
                                className="font-black text-white mb-1"
                                style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '32px', letterSpacing: '-1px' }}
                            >
                                {s.num}
                            </p>
                            <p className="text-xs text-white/35">{s.label}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Як це працює */}
            <section className="px-6 pb-20 max-w-3xl mx-auto">
                <h2
                    className="font-black text-white mb-8 text-center"
                    style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(20px, 2.5vw, 30px)', letterSpacing: '-1px' }}
                >
                    Як знайти квартиру в {city.nameGen}
                </h2>
                <div className="flex flex-col gap-4">
                    {[
                        { n: '01', t: 'Запусти бота', d: <span>Відкрий <a href={`https://t.me/FoxFlat_bot?start=website_${slug}`} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">@FoxFlat_bot</a> у Telegram</span> },
                        { n: '02', t: `Обери ${city.name}`, d: `Вкажи місто ${city.name} і налаштуй фільтри — ціна, район, кімнати` },
                        { n: '03', t: 'Отримуй квартири', d: `Нові оголошення у ${city.nameGen} приходять кожні 15 хвилин прямо в Telegram` },
                    ].map((step, i) => (
                        <div key={i} className="flex gap-5 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                            <span
                                className="font-black text-orange-500/30 flex-shrink-0"
                                style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '28px' }}
                            >
                                {step.n}
                            </span>
                            <div>
                                <p className="font-bold text-white mb-1" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: '14px' }}>
                                    {step.t}
                                </p>
                                <p className="text-sm text-white/40">{step.d as React.ReactNode}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ринок оренди + Райони */}
            {content && (
                <>
                    {/* Ринок оренди */}
                    <section className="px-6 pb-16 max-w-3xl mx-auto">
                        <h2
                            className="font-black text-white mb-6 text-center"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px, 2.5vw, 26px)', letterSpacing: '-0.5px' }}
                        >
                            Ціни на оренду квартир у {city.nameGen}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                            <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
                                <p className="text-xs font-bold tracking-widest text-orange-500/70 uppercase mb-2">1-кімнатна квартира</p>
                                <p className="font-black text-white" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(16px, 2vw, 20px)', letterSpacing: '-0.5px' }}>
                                    {content.price1br}
                                </p>
                            </div>
                            <div className="p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] text-center">
                                <p className="text-xs font-bold tracking-widest text-orange-500/70 uppercase mb-2">2-кімнатна квартира</p>
                                <p className="font-black text-white" style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(16px, 2vw, 20px)', letterSpacing: '-0.5px' }}>
                                    {content.price2br}
                                </p>
                            </div>
                        </div>
                        <p className="text-sm text-white/45 leading-relaxed text-center max-w-xl mx-auto">
                            {content.tip}
                        </p>
                    </section>

                    {/* Популярні райони */}
                    <section className="px-6 pb-16 max-w-3xl mx-auto">
                        <h2
                            className="font-black text-white mb-6 text-center"
                            style={{ fontFamily: "'Unbounded', sans-serif", fontSize: 'clamp(18px, 2.5vw, 26px)', letterSpacing: '-0.5px' }}
                        >
                            Популярні райони для оренди в {city.nameGen}
                        </h2>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {content.districts.map((d) => (
                                <span
                                    key={d}
                                    className="text-sm text-white/60 border border-white/[0.08] bg-white/[0.03] px-4 py-2 rounded-xl"
                                >
                                    {d}
                                </span>
                            ))}
                        </div>
                        <p className="text-xs text-white/30 text-center mt-6 leading-relaxed">
                            FoxFlat надсилає оголошення з усіх районів {city.nameGen} — обери потрібний у фільтрах бота.
                        </p>
                    </section>
                </>
            )}

            {/* Інші міста */}
            <section className="px-6 pb-28 max-w-4xl mx-auto">
                <p className="text-xs font-bold tracking-widest text-white/25 uppercase mb-5 text-center"
                   style={{ fontFamily: "'Unbounded', sans-serif" }}>
                    Інші міста
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                    {otherCities.map(([slug, c]) => (
                        <Link
                            key={slug}
                            href={`/misto/${slug}`}
                            className="text-xs font-semibold text-white/40 hover:text-orange-400 border border-white/[0.07] hover:border-orange-500/30 px-4 py-2 rounded-xl transition-all duration-200"
                        >
                            {c.name}
                        </Link>
                    ))}
                </div>
            </section>

            <FooterFoxFlat />
        </div>
    );
}