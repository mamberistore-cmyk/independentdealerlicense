'use client';

import Link from 'next/link';
import { PageHeader, Card, Badge } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';

// The site's fixed (non-blog) pages. These live as React routes in the repo,
// so they're edited in code rather than the CMS — listed here for visibility.
const PAGES = [
  { title: 'Home', path: '/', file: 'app/(site)/page.js' },
  { title: 'Blog', path: '/blog', file: 'app/(site)/blog/page.js' },
  { title: 'About', path: '/about', file: 'app/(site)/about/page.js' },
  { title: 'Contact', path: '/contact', file: 'app/(site)/contact/page.js' },
  { title: 'Privacy Policy', path: '/privacy-policy', file: 'app/(site)/privacy-policy/page.js' },
  { title: 'Terms of Use', path: '/terms', file: 'app/(site)/terms/page.js' },
  { title: 'Disclaimer', path: '/disclaimer', file: 'app/(site)/disclaimer/page.js' },
];

export default function PagesPage() {
  return (
    <div>
      <PageHeader title="Pages" subtitle="Your site’s fixed pages. These are code-managed, not stored as posts." />

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <p>Static pages (About, Contact, legal) are React components in the repository. Edit their source files to change them — the file path is shown for each.</p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                <th className="px-5 py-3 font-medium">Title</th>
                <th className="px-5 py-3 font-medium">URL</th>
                <th className="px-5 py-3 font-medium">Source file</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">View</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {PAGES.map((p) => (
                <tr key={p.path} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40">
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-zinc-100">{p.title}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{p.path}</td>
                  <td className="px-5 py-3 font-mono text-xs text-gray-400">{p.file}</td>
                  <td className="px-5 py-3"><Badge status="published">Published</Badge></td>
                  <td className="px-5 py-3 text-right">
                    <Link href={p.path} target="_blank" className="text-navy hover:text-clay dark:text-navy-light">Open →</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
