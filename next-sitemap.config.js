/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://fruit-seller-six.vercel.app',
  sitemapSize: 7000,
  generateRobotsTxt: true,
  exclude: ['/profile', '/profile/**', '/auth/**'],
  robotsTxtOptions: {
    policies: [
      {
        userAgent: '*',
        allow: '/',
      },
    ],
  },
};
