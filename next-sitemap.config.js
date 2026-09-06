const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || 'https://independentdealerlicense.com';

/** Collect published post slugs only — drafts/private posts stay out. */
function getPostPaths() {
  const dir = path.join(process.cwd(), 'content', 'posts');
  let files = [];
  try {
    files = fs.readdirSync(dir).filter((f) => f.endsWith('.md'));
  } catch (e) {
    files = [];
  }
  return files
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      let data = {};
      try {
        data = matter(fs.readFileSync(path.join(dir, file), 'utf8')).data || {};
      } catch (e) {
        data = {};
      }
      const status = String(data.status || 'published').toLowerCase();
      const dateOk = !data.date || new Date(data.date).getTime() <= Date.now();
      const isPublic = status === 'published' || (status === 'scheduled' && dateOk);
      return isPublic ? { loc: `/blog/${slug}`, changefreq: 'weekly', priority: 0.8, lastmod: new Date().toISOString() } : null;
    })
    .filter(Boolean);
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
