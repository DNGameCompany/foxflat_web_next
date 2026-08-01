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

const PAGE_URL = "https://foxflat.com.ua/tools/calculator";
const OG_IMAGE = "https://foxflat.com.ua/og-calculator.png";

export const metadata: Metadata = {
    metadataBase: new URL("https://foxflat.com.ua"),
    title: "Калькулятор вартості оренди квартири 2026 — безкоштовно | FoxFlat",
    description:
        "Порахуйте реальну вартість оренди квартири за 30 секунд: комуналка, опалення, застава та комісія рієлтора в одній сумі. Безкоштовний калькулятор + PDF-звіт для власника.",
    alternates: {
        canonical: PAGE_URL,
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    },
    openGraph: {
        title: "Калькулятор вартості оренди квартири 2026 — безкоштовно | FoxFlat",
        description:
            "Дізнайтесь реальну суму витрат на оренду житла — комуналку, опалення та приховані платежі — ще до підписання договору. Готовий PDF-звіт за один клік.",
        url: PAGE_URL,
        siteName: "FoxFlat",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Калькулятор вартості оренди квартири FoxFlat — інтерфейс з розрахунком щомісячних витрат",
            },
        ],
        locale: "uk_UA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Калькулятор вартості оренди квартири 2026 | FoxFlat",
        description: "Реальна вартість оренди — комуналка, застава, комісія рієлтора — в один клік, з PDF-звітом.",
        images: [OG_IMAGE],
    },
};

export default async function RentalCalculatorPage() {
    const initialPosts = await getLatestBlogPosts();

    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": "https://foxflat.com.ua/#organization",
                "name": "FoxFlat",
                "url": "https://foxflat.com.ua/",
                "logo": "https://foxflat.com.ua/logo.png",
                "sameAs": ["https://t.me/FoxFlat_bot"],
            },
            {
                "@type": "WebSite",
                "@id": "https://foxflat.com.ua/#website",
                "url": "https://foxflat.com.ua/",
                "name": "FoxFlat",
                "publisher": { "@id": "https://foxflat.com.ua/#organization" },
                "inLanguage": "uk-UA",
            },
            {
                "@type": "WebApplication",
                "@id": `${PAGE_URL}#webapp`,
                "url": PAGE_URL,
                "name": "Калькулятор вартості оренди квартири від FoxFlat",
                "applicationCategory": "BusinessApplication",
                "operatingSystem": "All",
                "browserRequirements": "Requires HTML5 support",
                "description":
                    "Безкоштовний онлайн-інструмент для точного підрахунку щомісячних витрат на оренду квартири та суми першого внеску при заселенні.",
                "inLanguage": "uk-UA",
                "isPartOf": { "@id": "https://foxflat.com.ua/#website" },
                "publisher": { "@id": "https://foxflat.com.ua/#organization" },
                "offers": {
                    "@type": "Offer",
                    "price": "0",
                    "priceCurrency": "UAH",
                },
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${PAGE_URL}#breadcrumb`,
                "itemListElement": [
                    { "@type": "ListItem", "position": 1, "name": "Головна", "item": "https://foxflat.com.ua/" },
                    { "@type": "ListItem", "position": 2, "name": "Калькулятор оренди", "item": PAGE_URL },
                ],
            },
            {
                "@type": "FAQPage",
                "@id": `${PAGE_URL}#faq`,
                "mainEntity": [
                    {
                        "@type": "Question",
                        "name": "Як точно розрахувати вартість оренди квартири на місяць?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Щоб отримати точну суму, додайте до вказаної в оголошенні ціни оренди витрати на комунальні послуги (світло, вода, газ, опалення), обслуговування будинку (ЖЕК/ОСББ) та інтернет. Наш калькулятор автоматично підсумовує ці параметри, показуючи реальне навантаження на ваш бюджет.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Скільки грошей потрібно мати при заселенні в квартиру?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Зазвичай у перший день підписання договору необхідно сплатити вартість першого місяця оренди, страхову заставу (депозит, який найчастіше дорівнює ціні одного місяця) та комісію рієлтора (якщо об'єкт здається через посередника — зазвичай 50% або 100%). Калькулятор виводить цю фінальну суму в блоці «Потрібно мати».",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Навіщо потрібна страхова застава (депозит) і чи повертається вона?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Страхова застава захищає власника від можливих матеріальних збитків, пошкодження техніки чи меблів, або раптового з'їзду мешканців без попередження за місяць. Ці гроші зазвичай зберігаються у власника до кінця терміну оренди і повертаються вам повністю під час виїзду, якщо майно в порядку — точні умови повернення варто прописати в договорі.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Чому комунальні послуги взимку та влітку так сильно відрізняються?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Головна причина — опалення, яке в зимовий період може становити від 1500 до 4500+ грн залежно від площі квартири, типу будинку (старий фонд чи новобудова) та наявності лічильника на тепло. Також влітку витрати на електроенергію можуть зростати через активну роботу кондиціонерів.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Хто має платити за обслуговування будинку (ОСББ/ЖЕК) та капітальний ремонт?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "За типовою практикою в Україні поточні витрати (ОСББ, консьєрж, вивіз сміття, прибирання території) як правило оплачує орендар, оскільки він безпосередньо користується цими послугами. Внески у фонд капітального ремонту будинку чи заміну ліфтів найчастіше несе власник квартири. Але це не універсальне правило — остаточний розподіл витрат завжди варто чітко прописати в договорі оренди.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Як зафіксувати ціну оренди в договору, щоб її не підняли через місяць?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "У договорі оренди обов'язково має бути пункт про те, що зазначена вартість є фіксованою на певний термін (зазвичай на 6 або 11 місяців). Також пропишіть умову, що зміна вартості можлива лише за згодою сторін і з письмовим попередженням не менше ніж за 30 днів.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Що робити, якщо в орендованій квартирі зламався холодильник чи пральна машина?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Якщо поломка сталася через природний знос техніки (вона була стара або вийшла з ладу плата), ремонт або заміну зазвичай оплачує власник. Якщо ж поломка сталася з вини орендаря (наприклад, механічне пошкодження), ремонт, як правило, здійснюється за кошт мешканця. У будь-якому разі рішення краще фіксувати письмово, а стан техніки — в акті прийому-передачі.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Чи входять лічильники у фіксовану вартість комунальних послуг?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Ні, показники лічильників (світло, холодна та гаряча вода, газ) розраховуються щомісяця індивідуально на основі вашого фактичного споживання. Дані у калькуляторі є середньостатистичними для швидкого планування, але їх варто коригувати під свої звички.",
                        },
                    },
                    {
                        "@type": "Question",
                        "name": "Як перевірити реальні витрати на комуналку перед підписанням договору?",
                        "acceptedAnswer": {
                            "@type": "Answer",
                            "text": "Найкращий спосіб — попросити власника квартири показати оригінальні квитанції за минулий рік. Подивіться платіжку за січень (пік опалювального сезону) та за будь-який літній місяць. Це застрахує вас від прихованих боргів та занадто високих тарифів.",
                        },
                    },
                ],
            },
        ],
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