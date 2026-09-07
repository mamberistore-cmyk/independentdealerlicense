import { siteUrl } from '@/lib/config';

// Native Next.js robots.txt route. We generate robots.txt here (instead of
// letting next-sitemap do it) so we have full control over the output — in
// particular, we omit the non-standard `Host:` directive, which Googlebot
// ignores and flags as a warning in Search Console. next-sitemap still
// generates sitemap.xml (see next-sitemap.config.js, generateRobotsTxt: false).
export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
