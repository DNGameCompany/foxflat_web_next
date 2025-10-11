import { Review } from './page';

export function generateReviewsSchema(reviews: Review[]) {
    const avgRating =
        reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : '5.0';

    return {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'FoxFlat Telegram Bot',
        description:
            'Сервіс для пошуку квартир в оренду без посередників через Telegram-бот FoxFlat.',
        brand: 'FoxFlat',
        aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: avgRating,
            reviewCount: reviews.length,
        },
        review: reviews.map((r) => ({
            '@type': 'Review',
            author: r.name,
            reviewBody: r.text,
            reviewRating: {
                '@type': 'Rating',
                ratingValue: r.rating,
                bestRating: '5',
            },
            datePublished: r.date ?? undefined,
        })),
    };
}
