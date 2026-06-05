import { Metadata } from "next";
import RentalCalculatorClient from "./RentalCalculatorClient";
import FooterFoxFlat from "@/src/components/FooterFoxFlat";

interface BlogPost {
    slug: string;
    title: string;
    category: "tips" | "news" | "guide";
    created_at: string;
    read_time: number;
    cover_image?: string;
}

async function getLatestBlogPosts(): Promise<BlogPost[]> {
    try {
        const res = await fetch(
            `https://api.foxflat.com.ua/blog/posts?published=true&limit=3`,
            { next: { revalidate: 300 } }
        );
        if (!res.ok) return [];
        return await res.json();
    } catch {
        return [];
    }
}
export const revalidate = 3600;

export const metadata: Metadata = {
    title: "Калькулятор вартості оренди квартири онлайн | FoxFlat",
    description: "Безкоштовний калькулятор реальної вартості оренди житла. Розрахуйте повні витрати: перший місяць, застава, комісія рієлтора та комунальні послуги без прихованих платежів.",
    keywords: [
        "калькулятор оренди",
        "вартість оренди квартири",
        "розрахунок комунальних послуг",
        "оренда житла київ",
        "зняти квартиру без прихованих комісій",
        "розрахунок застави за квартиру",
        "комісія рієлтора скільки платити",
        "витрати на комуналку взимку",
        "FoxFlat"
    ],
    openGraph: {
        title: "Калькулятор вартості оренди квартири онлайн | FoxFlat",
        description: "Дізнайтесь реальну суму витрат на оренду житла, включаючи комуналку та приховані платежі, перед підписанням договору.",
        url: "https://foxflat.com.ua/tools/calculator",
        siteName: "FoxFlat",
        images: [
            {
                url: "https://foxflat.com.ua/og-calculator.png",
                width: 1200,
                height: 630,
                alt: "Калькулятор оренди FoxFlat",
            },
        ],
        locale: "uk_UA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Калькулятор вартості оренди квартири онлайн | FoxFlat",
        description: "Розрахунок повної вартості оренди та витрат на заселення in one click.",
        images: ["https://foxflat.com.ua/og-calculator.png"],
    },
};

export default async function RentalCalculatorPage() {
    const initialPosts = await getLatestBlogPosts();

    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebApplication",
                "@id": "https://foxflat.com.ua/tools/calculator#webapp",
                "url": "https://foxflat.com.ua/tools/calculator",
                "name": "Калькулятор вартості оренди квартири від FoxFlat",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires HTML5 support",
                "description": "Безкоштовний онлайн-інструмент для точного підрахунку щомісячних витрат на оренду квартири та суми першого внеску при заселенні."
            },
            {
                "@type": "BreadcrumbList",
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Головна", "item": "https://foxflat.com.ua/" },
                    { "@type": "ListItem", "position": 3, "name": "Калькулятор оренди", "item": "https://foxflat.com.ua/tools/calculator" }
                ]
            },
            {
                "@type": "FAQPage",
                "@id": "https://foxflat.com.ua/tools/calculator#faq",
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Як точно розрахувати вартість оренди квартири на місяць?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Щоб отримати точну суму, додайте до вказаної в оголошенні ціни оренди витрати на комунальні послуги (світло, вода, газ, опалення), обслуговування будинку (ЖЕК/ОСББ) та інтернет. Наш калькулятор автоматично підсумовує ці параметри, показуючи реальне навантаження на ваш бюджет."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Скільки грошей потрібно мати при заселенні в квартиру?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Зазвичай у перший день підписання договору необхідно сплатити вартість першого місяця оренди, страхову заставу (депозит, який найчастіше дорівнює ціні одного місяця) та комісію рієлтора (якщо об'єкт здається через посередника — зазвичай 50% або 100%). Калькулятор виводить цю фінальну суму в блоці «Потрібно мати»."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Навіщо потрібна страхова застава (депозит) і чи повертається вона?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Страхова застава захищає власника від можливих матеріальних збитків, пошкодження техніки чи меблів, або раптового з'їзду мешканців без попередження за місяць. Ці гроші зберігаються у власника до кінця терміну оренди і повертаються вам повністю під час виїзду, якщо майно в порядку."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Чому комунальні послуги взимку та влітку так сильно відрізняються?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Головна причина — опалення, яке в зимовий період може становити від 1500 до 4500+ грн залежно від площі квартири, типу будинку (старий фонд чи новобудова) та наявності лічильника на тепло. Також влітку витрати на електроенергію можуть зростати через активну роботу кондиціонерів."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Хто має платити за обслуговування будинку (ОСББ/ЖЕК) та капітальний ремонт?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Згідно з ринковою практикою в Україні, поточні витрати (ОСББ, консьєрж, вивіз сміття, прибирання території) оплачує орендар, оскільки він безпосередньо користується цими послугами. Проте внески у фонд капітального ремонту будинку або заміну ліфтів має сплачувати виключно власник квартири."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Як зафіксувати ціну оренди в договору, щоб її не підняли через місяць?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "У договорі оренди обов'язково має бути пункт про те, що зазначена вартість є фіксованою на певний термін (зазвичай на 6 або 11 місяців). Також пропишіть умову, що зміна вартості можлива лише за згодою сторін і з письмовим попередженням не менше ніж за 30 днів."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Що робити, якщо в орендованій квартирі зламався холодильник чи пральна машина?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Якщо поломка сталася через природний знос техніки (вона була стара або вийшла з ладу плата), ремонт або заміну оплачує власник. Якщо ж поломка сталася з вини орендаря (наприклад, механічне пошкодження), ремонт здійснюється за кошт мешканця. Обов'язково фіксуйте стан техніки в акті прийому-передачі."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Чи входять лічильники у фіксовану вартість комунальних послуг?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ні, показники лічильників (світло, холодна та гаряча вода, газ) розраховуються щомісяця індивідуально на основі вашого фактичного споживання. Дані у калькуляторі є середньостатистичними для швидкого планування, але їх варто коригувати під свої звички."
                        }
                    },
                    {
                        "@type": "Question",
                        "name": "Як перевірити реальні витрати на комуналку перед підписанням договору?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Найкращий спосіб — попросити власника квартири показати оригінальні квитанції за минулий рік. Подивіться платіжку за січень (пік опалювального сезону) та за будь-який літній місяць. Це застрахує вас від прихованих боргів та занадто високих тарифів."
                        }
                    }
                ]
            }
        ]
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            <RentalCalculatorClient initialPosts={initialPosts} />

            <FooterFoxFlat />
        </div>
    );
}