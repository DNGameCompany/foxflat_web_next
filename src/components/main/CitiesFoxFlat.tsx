import Link from "next/link";

const CITIES = [
    { slug: "kyiv",            name: "Київ",              region: "Центр" },
    { slug: "lviv",            name: "Львів",             region: "Захід" },
    { slug: "odesa",           name: "Одеса",             region: "Південь" },
    { slug: "kharkiv",         name: "Харків",            region: "Схід" },
    { slug: "dnipro",          name: "Дніпро",            region: "Центр" },
    { slug: "zaporizhzhia",    name: "Запоріжжя",         region: "Південь" },
    { slug: "vinnytsia",       name: "Вінниця",           region: "Центр" },
    { slug: "mykolaiv",        name: "Миколаїв",          region: "Південь" },
    { slug: "kherson",         name: "Херсон",            region: "Південь" },
    { slug: "chernihiv",       name: "Чернігів",          region: "Північ" },
    { slug: "poltava",         name: "Полтава",           region: "Схід" },
    { slug: "cherkasy",        name: "Черкаси",           region: "Центр" },
    { slug: "sumy",            name: "Суми",              region: "Схід" },
    { slug: "zhytomyr",        name: "Житомир",           region: "Захід" },
    { slug: "rivne",           name: "Рівне",             region: "Захід" },
    { slug: "lutsk",           name: "Луцьк",             region: "Захід" },
    { slug: "ternopil",        name: "Тернопіль",         region: "Захід" },
    { slug: "khmelnytskyi",    name: "Хмельницький",      region: "Захід" },
    { slug: "kropyvnytskyi",   name: "Кропивницький",     region: "Центр" },
    { slug: "uzhhorod",        name: "Ужгород",           region: "Захід" },
    { slug: "ivano-frankivsk", name: "Івано-Франківськ",  region: "Захід" },
    { slug: "chernivtsi",      name: "Чернівці",          region: "Захід" },
];

const REGION_COLOR: Record<string, string> = {
    "Центр":  "text-[#FF6B35]/80",
    "Захід":  "text-sky-400/80",
    "Схід":   "text-amber-400/80",
    "Південь":"text-emerald-400/80",
    "Північ": "text-purple-400/80",
};

export default function CitiesFoxFlat() {
    return (
        <section className="relative w-full bg-[#1E1E2E] text-white py-24 px-6 overflow-hidden">
            {/* М'яке фонове сяйво */}
            <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse, rgba(255,107,53,0.08) 0%, transparent 65%)" }}
            />

            <div className="relative max-w-5xl mx-auto">

                {/* Заголовок */}
                <div className="mb-16 text-center">
                    <p className="text-xs font-extrabold tracking-widest text-[#FF6B35] uppercase mb-3">
                        Покриття
                    </p>
                    <h2 className="font-extrabold mb-4 leading-tight text-white"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: 'clamp(24px, 3.5vw, 38px)',
                            letterSpacing: '-1px',
                        }}>
                        Оренда квартир{' '}
                        <span className="text-[#FF6B35]">по всій Україні</span>
                    </h2>
                    <p className="text-white/60 text-base max-w-md mx-auto leading-relaxed">
                        FoxFlat працює у 22 містах — знайди квартиру у своєму місті за лічені хвилини
                    </p>
                </div>

                {/* Плитки міст */}
                <div className="flex flex-wrap justify-center gap-3">
                    {CITIES.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/misto/${city.slug}`}
                            className="group relative flex flex-col justify-between p-4 rounded-xl border border-white/10 bg-white/5 hover:border-[#FF6B35]/50 hover:bg-white/[0.08] transition-all duration-300 w-36 shadow-md"
                        >
                            {/* Назва */}
                            <span className="text-sm font-bold text-white/80 group-hover:text-white transition-colors leading-tight">
                                {city.name}
                            </span>

                            {/* Регіон */}
                            <span className={`text-[10px] font-extrabold mt-3 tracking-wider uppercase ${REGION_COLOR[city.region]}`}>
                                {city.region}
                            </span>

                            {/* Стрілка при ховері */}
                            <span className="absolute top-3 right-3 text-[#FF6B35]/0 group-hover:text-[#FF6B35] group-hover:translate-x-0.5 transition-all duration-200 text-xs">
                                →
                            </span>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}