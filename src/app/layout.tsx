import './globals.css'
import type { Metadata } from 'next'
import Script from "next/script";

export const metadata: Metadata = {
    title: 'FoxFlat — Telegram-бот, який сповіщає про нові оголошення оренди квартир',
    description: 'FoxFlat — Telegram-бот, який надсилає нові оголошення про оренду квартир за твоїми фільтрами у 22 містах України. Платформи перевіряються кожні 15 хвилин.',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk">
        <body>
            {process.env.NODE_ENV === "production" && (
                <>
                    <Script
                        src="https://www.googletagmanager.com/gtag/js?id=G-Q0P6Y748W1"
                        strategy="lazyOnload"
                    />
                    <Script id="ga-script" strategy="lazyOnload">
                        {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'G-Q0P6Y748W1', {
                            page_path: window.location.pathname,
                        });
                    `}
                    </Script>
                </>
            )}
            {children}
        </body>
        </html>
    )
}
