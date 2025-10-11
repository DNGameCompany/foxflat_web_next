/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://foxflat.com.ua',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    // Динамічна генерація sitemap з урахуванням /reviews
    dynamicRoutes: ['/reviews'], // Додаємо /reviews як динамічний маршрут
    changefreq: 'weekly', // Змінено на "weekly", оскільки відгуки оновлюються частіше
    priority: 0.8, // Підвищено пріоритет для /reviews
    sitemapSize: 1000,
    exclude: [
        '/admin/*',
        '/admin',
        '/legal/*',
        '/order-confirmation',
    ],
    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: ['/', '/reviews'], // Явно дозволяємо /reviews
                disallow: [
                    '/admin/',
                    '/admin/*',
                    '/legal/',
                    '/legal/*',
                    '/order-confirmation',
                ],
            },
        ],
        host: 'https://foxflat.com.ua',
        // Видаляємо additionalSitemaps, якщо не потрібен кастомний sitemap
    },
};