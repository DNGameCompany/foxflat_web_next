/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://foxflat.com.ua',
    generateRobotsTxt: true,
    generateIndexSitemap: false,
    sitemapSize: 1000,
    changefreq: 'weekly',
    priority: 0.8,

    additionalPaths: async () => {
        const cities = [
            'kyiv', 'lviv', 'odesa', 'kharkiv', 'dnipro', 'zaporizhzhia',
            'vinnytsia', 'mykolaiv', 'chernihiv', 'poltava', 'cherkasy',
            'sumy', 'zhytomyr', 'rivne', 'lutsk', 'ternopil', 'khmelnytskyi',
            'kropyvnytskyi', 'uzhhorod', 'ivano-frankivsk', 'chernivtsi', 'kherson',
        ].map((slug) => ({
            loc: `/misto/${slug}`,
            changefreq: 'monthly',
            priority: 0.7,
            lastmod: new Date().toISOString(),
        }));

        // Блог — тягнемо опубліковані пости з API
        let blogPaths = [];
        try {
            const res = await fetch(
                'https://api.foxflat.com.ua/blog/posts?published=true&limit=100'
            );
            const posts = await res.json();
            blogPaths = posts.map((post) => ({
                loc: `/blog/${post.slug}`,
                changefreq: 'monthly',
                priority: 0.6,
                lastmod: post.updated_at || post.created_at || new Date().toISOString(),
            }));
        } catch (e) {
            console.warn('[sitemap] Не вдалось завантажити блог-пости:', e.message);
        }

        return [
            // Блог індексна сторінка
            {
                loc: '/blog',
                changefreq: 'weekly',
                priority: 0.8,
                lastmod: new Date().toISOString(),
            },
            ...cities,
            ...blogPaths,
        ];
    },

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
                allow: ['/', '/reviews', '/misto/*', '/contacts', '/blog', '/blog/*'],
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