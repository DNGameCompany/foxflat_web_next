import './globals.css'
import type { Metadata } from 'next'
import Script from "next/script";

export const metadata: Metadata = {
    title: 'FoxFlat — Telegram-бот для оренди квартир в Україні',
    description: 'FoxFlat — Telegram-бот для пошуку квартир без посередників у 22 містах України. Оновлення оголошень кожні 15 хвилин.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk">
        <body>{/* Google Analytics */}
            <Script
                src="https://www.googletagmanager.com/gtag/js?id=G-Q0P6Y748W1"
                strategy="afterInteractive"
            />
            <Script id="ga-script" strategy="afterInteractive">
                {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', 'G-Q0P6Y748W1', {
                    page_path: window.location.pathname,
                });
            `}
            </Script>
            {children}
        </body>
        </html>
    )
}
