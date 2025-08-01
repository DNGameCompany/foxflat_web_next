import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'FoxFlat',
    description: 'Оренда квартир через Telegram',
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="uk">
        <body>{children}</body>
        </html>
    )
}
