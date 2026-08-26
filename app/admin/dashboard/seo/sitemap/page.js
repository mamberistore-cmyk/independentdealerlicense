'use client';

import Link from 'next/link';
import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, Button } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { siteConfig } from '@/lib/config';

export default function SitemapPage() {
  const { posts, loading } = usePosts();
  const staticPaths = ['/', '/blog', '/about', '/contact', '/privacy-policy', '/terms', '/disclaimer'];
  const postPaths = posts.map((p) => `/blog/${p.slug}`);
  const total = staticPaths.length + postPaths.length;

  return (
    <div>
      <PageHeader title="Sitemap" subtitle="Your XML sitemap and robots.txt are generated automatically on every build.">
        <Button href="/sitemap.xml" target="_blank" variant="secondary" icon="external">View sitemap.xml</Button>
        <Button href="/robots.txt" target="_blank" variant="secondary" icon="external">View robots.txt</Button>
      </PageHeader>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5">
          <Icon name="sitemap" className="h-6 w-6 text-navy dark:text-navy-light" />
          <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-zinc-50">{loading ? '—' : total}</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">URLs in sitemap</p>
        </Card>
        <Card className="p-5">
          <Icon name="posts" className="h-6 w-6 text-navy dark:text-navy-light" />
          <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-zinc-50">{loading ? '—' : postPaths.length}</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Post URLs</p>
        </Card>
        <Card className="p-5">
          <Icon name="pages" className="h-6 w-6 text-navy dark:text-navy-light" />
          <p className="mt-3 text-2xl font-semibold text-gray-900 dark:text-zinc-50">{staticPaths.length}</p>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Static pages</p>
        </Card>
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <p>Submit <code>{siteConfig.url}/sitemap.xml</code> in Google Search Console. It regenerates via <code>next-sitemap</code> on each deploy, so new posts are included automatically.</p>
      </div>

      <Card className="mt-4 overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Included URLs</h2>
        </div>
        <div className="max-h-96 overflow-y-auto divide-y divide-gray-100 dark:divide-zinc-800">
          {[...staticPaths, ...postPaths].map((path) => (
            <div key={path} className="flex items-center justify-between px-5 py-2.5 text-sm">
              <span className="font-mono text-gray-600 dark:text-zinc-300">{path}</span>
              <Link href={path} target="_blank" className="text-navy hover:text-clay dark:text-navy-light"><Icon name="external" className="h-4 w-4" /></Link>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
