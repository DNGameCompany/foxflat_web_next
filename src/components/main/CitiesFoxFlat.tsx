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
    "Центр":  "text-orange-400/60",
    "Захід":  "text-blue-400/60",
    "Схід":   "text-yellow-400/60",
    "Південь":"text-emerald-400/60",
    "Північ": "text-purple-400/60",
};

export default function CitiesFoxFlat() {
    return (
        <section className="w-full bg-black py-16 px-4">
            <div className="max-w-5xl mx-auto">

                {/* Заголовок */}
                <div className="mb-10 text-center">
                    <p className="text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">
                        Покриття
                    </p>
                    <h2 className="font-black mb-4 leading-tight"
                        style={{
                            fontFamily: "'Unbounded', sans-serif",
                            fontSize: 'clamp(24px, 3vw, 38px)',
                            letterSpacing: '-1px',
                        }}>
                        Оренда квартир{' '}
                        <span className="text-orange-500">по всій Україні</span>
                    </h2>
                    <p className="text-white/40 text-sm max-w-md mx-auto leading-relaxed">
                        FoxFlat працює у 22 містах — знайди квартиру у своєму місті за лічені хвилини
                    </p>
                </div>

                {/* Плитки міст */}
                <div className="flex flex-wrap justify-center gap-2">
                    {CITIES.map((city) => (
                        <Link
                            key={city.slug}
                            href={`/misto/${city.slug}`}
                            className="group relative flex flex-col justify-between p-3.5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-orange-500/30 hover:bg-orange-500/[0.04] transition-all duration-200 w-36"
                        >
                            {/* Назва */}
                            <span className="text-sm font-semibold text-white/70 group-hover:text-white transition-colors leading-tight">
                                {city.name}
                            </span>

                            {/* Регіон */}
                            <span className={`text-[10px] font-bold mt-2 tracking-wide ${REGION_COLOR[city.region]}`}>
                                {city.region}
                            </span>

                            {/* Стрілка при ховері */}
                            <span className="absolute top-3 right-3 text-orange-500/0 group-hover:text-orange-500/60 transition-all duration-200 text-xs">
                                →
                            </span>
                        </Link>
                    ))}
                </div>

            </div>
        </section>
    );
}