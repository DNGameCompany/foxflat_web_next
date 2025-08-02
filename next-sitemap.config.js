/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://foxflat.com.ua',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    changefreq: 'monthly',
    priority: 0.7,
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
                allow: '/',
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
        additionalSitemaps: ['https://foxflat.com.ua/sitemap.xml'],
    },
};
