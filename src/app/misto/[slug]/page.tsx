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

export async function generateStaticParams() {
    return Object.keys(cities).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const city = cities[slug];
    if (!city) return {};

    return {
        title: `Оренда квартир у ${city.nameGen} через Telegram — FoxFlat`,
        description: `Знаходь квартири у ${city.nameGen} першим через Telegram-бот FoxFlat. Оновлення кожні 5 хвилин, без посередників і комісій. Запусти безкоштовно!`,
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
            description: `Telegram-бот FoxFlat надсилає нові квартири у ${city.nameGen} кожні 5 хвилин. Без посередників!`,
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

    const otherCities = Object.entries(cities)
        .filter(([s]) => s !== slug)
        .slice(0, 8);

    const jsonLd = {
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
    };

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
                        FoxFlat надсилає нові оголошення у {city.nameGen} кожні 5 хвилин прямо в Telegram.
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
                        { num: '5 хв', label: `Оновлення у ${city.nameGen}` },
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
                        { n: '01', t: 'Запусти бота', d: <span>Відкрий <a href={`https://t.me/FoxFlat_bot?start=website_${slug}`} target="_blank" rel="noopener noreferrer" className="text-orange-400 hover:text-orange-300 underline underline-offset-2">@FoxFlat_bot</a> у Telegram і натисни Start</span> },
                        { n: '02', t: `Обери ${city.name}`, d: `Вкажи місто ${city.name} і налаштуй фільтри — ціна, район, кімнати` },
                        { n: '03', t: 'Отримуй квартири', d: `Нові оголошення у ${city.nameGen} приходять кожні 5 хвилин прямо в Telegram` },
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