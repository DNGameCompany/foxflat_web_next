/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://foxflat.com.ua',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    sitemapSize: 1000,
    changefreq: 'weekly',
    priority: 0.8,

    additionalPaths: async () => [
        'kyiv', 'lviv', 'odesa', 'kharkiv', 'dnipro', 'zaporizhzhia',
        'vinnytsia', 'mykolaiv', 'chernihiv', 'poltava', 'cherkasy',
        'sumy', 'zhytomyr', 'rivne', 'lutsk', 'ternopil', 'khmelnytskyi',
        'kropyvnytskyi', 'uzhhorod', 'ivano-frankivsk', 'chernivtsi', 'kherson',
    ].map((slug) => ({
        loc: `/misto/${slug}`,
        changefreq: 'monthly',
        priority: 0.7,
        lastmod: new Date().toISOString(),
    })),

    exclude: [
        '/admin',
        '/admin/*',
        '/legal/*',
        '/order-confirmation',
    ],

    robotsTxtOptions: {
        policies: [
            {
                userAgent: '*',
                allow: ['/', '/reviews', '/misto/*', '/contacts'],
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
    },
};