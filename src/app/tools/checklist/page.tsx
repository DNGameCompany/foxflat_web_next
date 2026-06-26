import { Metadata } from "next";
import ChecklistClient from "./ChecklistClient";
import FooterFoxFlat from "@/src/components/FooterFoxFlat";

export const revalidate = 86400; // 24год — контент статичний

export const metadata: Metadata = {
    title: "Чеклист огляду квартири перед орендою | FoxFlat",
    description: "Інтерактивний чеклист з 38 пунктів для перевірки квартири перед підписанням договору. Документи, комунікації, техніка, безпека — відкрий на телефоні під час перегляду.",
    keywords: [
        "чеклист огляд квартири",
        "що перевірити при оренді квартири",
        "огляд квартири перед орендою",
        "перевірка квартири документи",
        "що взяти до уваги при оренді",
        "перевірка комунікацій квартири",
        "як перевірити квартиру перед заселенням",
        "FoxFlat",
    ],
    alternates: { canonical: "https://foxflat.com.ua/tools/checklist" },
    openGraph: {
        title: "Чеклист огляду квартири перед орендою | FoxFlat",
        description: "38 пунктів перевірки — відкрий на телефоні під час перегляду і не підпишеш поганий договір.",
        url: "https://foxflat.com.ua/tools/checklist",
        siteName: "FoxFlat",
        images: [{ url: "https://foxflat.com.ua/og-checklist.png", width: 1200, height: 630, alt: "Чеклист огляду квартири FoxFlat" }],
        locale: "uk_UA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Чеклист огляду квартири | FoxFlat",
        description: "38 пунктів перевірки перед підписанням договору оренди.",
        images: ["https://foxflat.com.ua/og-checklist.png"],
    },
};

const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
        {
            "@type": "WebApplication",
            "@id": "https://foxflat.com.ua/tools/checklist#webapp",
            "url": "https://foxflat.com.ua/tools/checklist",
            "name": "Чеклист огляду квартири від FoxFlat",
            "applicationCategory": "UtilitiesApplication",
            "operatingSystem": "All",
            "description": "Інтерактивний чеклист з 38 пунктів для перевірки квартири перед підписанням договору оренди.",
            "offers": { "@type": "Offer", "price": "0", "priceCurrency": "UAH" },
        },
        {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Головна",      "item": "https://foxflat.com.ua/" },
                { "@type": "ListItem", "position": 2, "name": "Інструменти", "item": "https://foxflat.com.ua/tools" },
                { "@type": "ListItem", "position": 3, "name": "Чеклист огляду квартири", "item": "https://foxflat.com.ua/tools/checklist" },
            ],
        },
        {
            "@type": "HowTo",
            "name": "Як перевірити квартиру перед орендою",
            "description": "Покроковий чеклист перевірки квартири перед підписанням договору оренди в Україні.",
            "totalTime": "PT30M",
            "step": [
                { "@type": "HowToStep", "position": 1, "name": "Перевірте документи", "text": "Переконайтесь що паспорт власника збігається з договором, перевірте реєстр прав власності, впевніться що квартира не під арештом." },
                { "@type": "HowToStep", "position": 2, "name": "Огляньте приміщення", "text": "Перевірте стіни та стелю на цвіль і підтікання, підлогу, вікна, двері. Зверніть увагу на сторонні запахи та рівень шуму." },
                { "@type": "HowToStep", "position": 3, "name": "Перевірте комунікації", "text": "Перевірте електрику, водопостачання, каналізацію, газ, опалення і зафіксуйте показники всіх лічильників." },
                { "@type": "HowToStep", "position": 4, "name": "Перевірте техніку та меблі", "text": "Увімкніть холодильник, пральну машину, плиту, кондиціонер. Зробіть фото всієї техніки та меблів." },
                { "@type": "HowToStep", "position": 5, "name": "Оцініть будинок і район", "text": "Перевірте наявність укриття, стан під'їзду та ліфту, паркінг, транспортну доступність та інфраструктуру." },
                { "@type": "HowToStep", "position": 6, "name": "Перевірте умови договору", "text": "Переконайтесь що ціна зафіксована, умови застави прописані, підпишіть Акт прийому-передачі з описом майна." },
            ],
        },
    ],
};

export default function ChecklistPage() {
    return (
        <div className="relative min-h-screen w-full overflow-hidden bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ChecklistClient />
            <FooterFoxFlat />
        </div>
    );
}