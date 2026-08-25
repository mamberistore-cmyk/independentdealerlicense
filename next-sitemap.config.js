const fs = require('fs');
const path = require('path');

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://independentdealerlicense.com';

/** Collect every published post slug so each gets its own sitemap entry. */
function getPostPaths() {
  const dir = path.join(process.cwd(), 'content', 'posts');
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch (e) {
    files = [];
  }
  return files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    return {
      loc: `/blog/${slug}`,
      changefreq: 'weekly',
      priority: 0.8,
      lastmod: new Date().toISOString(),
    };
  });
}

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: ['/admin', '/admin/*', '/api/*', '/icon.svg', '/server-sitemap.xml'],
  additionalPaths: async () => {
    return getPostPaths();
  },
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/admin', '/api'] },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
};
