import { Metadata } from "next";
import RentalContractClient from "./RentalContractClient";
import FooterFoxFlat from "@/src/components/FooterFoxFlat";

const SITE_URL = "https://foxflat.com.ua";
const PAGE_URL = `${SITE_URL}/tools/dogovir-orendy`;
const OG_IMAGE = `${SITE_URL}/og-dogovir.png`;
const PDF_PATH = "/api/download-contract";
const PDF_URL = `${SITE_URL}/tools/dogovir-orendy`;

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    title: "Договір оренди квартири — безкоштовний шаблон PDF 2026 | FoxFlat",
    description:
        "Готовий шаблон договору найму житла за Цивільним кодексом України: сам договір, опис майна, акти прийому-передачі та повернення. Завантажте PDF безкоштовно.",
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
        title: "Договір оренди квартири — безкоштовний шаблон PDF | FoxFlat",
        description:
            "9 сторінок: договір найму, опис майна, акт прийому-передачі, акт повернення та правова довідка з посиланнями на ЦКУ. Завантажте й заповніть за 10 хвилин.",
        url: PAGE_URL,
        siteName: "FoxFlat",
        images: [
            {
                url: OG_IMAGE,
                width: 1200,
                height: 630,
                alt: "Шаблон договору оренди квартири FoxFlat — сторінка завантаження PDF",
            },
        ],
        locale: "uk_UA",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Договір оренди квартири — безкоштовний шаблон PDF | FoxFlat",
        description:
            "Типова форма договору найму житла за гл. 59 ЦКУ, з додатками та актами. Безкоштовно.",
        images: [OG_IMAGE],
    },
};

export default function RentalContractPage() {
    const jsonLdData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "Organization",
                "@id": `${SITE_URL}/#organization`,
                name: "FoxFlat",
                url: `${SITE_URL}/`,
                logo: `${SITE_URL}/logo.png`,
                sameAs: ["https://t.me/FoxFlat_bot"],
            },
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                url: `${SITE_URL}/`,
                name: "FoxFlat",
                publisher: { "@id": `${SITE_URL}/#organization` },
                inLanguage: "uk-UA",
            },
            {
                "@type": "BreadcrumbList",
                "@id": `${PAGE_URL}#breadcrumb`,
                itemListElement: [
                    {
                        "@type": "ListItem",
                        position: 1,
                        name: "Головна",
                        item: `${SITE_URL}/`,
                    },
                    {
                        "@type": "ListItem",
                        position: 2,
                        name: "Договір оренди",
                        item: PAGE_URL,
                    },
                ],
            },
            {
                "@type": "DigitalDocument",
                "@id": `${PAGE_URL}#document`,
                name: "Договір найму (оренди) житлового приміщення — типова форма",
                url: PAGE_URL,
                encodingFormat: "application/pdf",
                contentUrl: PDF_URL,
                inLanguage: "uk-UA",
                isAccessibleForFree: true,
                publisher: { "@id": `${SITE_URL}/#organization` },
                about: "Найм житла відповідно до гл. 59 § 2 Цивільного кодексу України",
            },
            {
                "@type": "FAQPage",
                "@id": `${PAGE_URL}#faq`,
                mainEntity: [
                    {
                        "@type": "Question",
                        name: "Чи потрібно нотаріально засвідчувати договір оренди квартири?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Ні, за законодавством України нотаріальне посвідчення договору найму житла між фізичними особами не є обов'язковим. Сторони можуть зробити це додатково за власним бажанням, але для чинності договору достатньо підписів обох сторін.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Скільки примірників договору потрібно підписати?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Два — по одному для кожної сторони. Обидва мають однакову юридичну силу.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Чи може орендодавець підняти орендну плату посеред строку дії договору?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Ні. Стаття 762 Цивільного кодексу України забороняє одностороннє підвищення орендної плати. Зміна можлива лише за письмовою згодою обох сторін і не частіше одного разу на рік.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Що робити, якщо орендодавець відмовляється повертати заставу?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Шаблон передбачає право орендаря вимагати повернення застави у подвійному розмірі, якщо кошти утримуються без обґрунтованих підстав. Якщо сторони не досягають згоди, питання вирішується в судовому порядку.",
                        },
                    },
                    {
                        "@type": "Question",
                        name: "Чи є цей шаблон готовим юридично чинним документом?",
                        acceptedAnswer: {
                            "@type": "Answer",
                            text: "Це зразок із посиланнями на статті Цивільного кодексу України. Він стає чинним договором лише після того, як сторони заповнять усі реквізити, узгодять умови та власноручно підпишуть кожен примірник.",
                        },
                    },
                ],
            },
        ],
    };

    return (
        <div className="relative min-h-screen w-full bg-black text-white">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdData) }}
            />

            <RentalContractClient pdfUrl={PDF_PATH} />

            <FooterFoxFlat />
        </div>
    );
}