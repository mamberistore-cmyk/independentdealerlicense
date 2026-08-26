'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, EmptyState } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { slugify } from '@/lib/slug';
import { BASE } from '@/lib/adminNav';

export default function TagsPage() {
  const { posts, loading } = usePosts();
  const [q, setQ] = useState('');

  const tags = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => (p.tags || []).forEach((t) => map.set(t, (map.get(t) || 0) + 1)));
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count, slug: slugify(name) }))
      .filter((t) => t.name.toLowerCase().includes(q.trim().toLowerCase()))
      .sort((a, b) => b.count - a.count);
  }, [posts, q]);

  const max = Math.max(1, ...tags.map((t) => t.count));

  return (
    <div>
      <PageHeader title="Tags" subtitle="Every tag used across your posts, sized by how often it appears." />

      <Card className="mb-4 p-4">
        <div className="relative max-w-sm">
          <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tags…" className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
        </div>
      </Card>

      {/* Tag cloud */}
      {!loading && tags.length > 0 && (
        <Card className="mb-4 p-6">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {tags.map((t) => (
              <Link key={t.name} href={`/tags/${t.slug}`} target="_blank" className="text-navy transition-colors hover:text-clay dark:text-navy-light" style={{ fontSize: `${0.85 + (t.count / max) * 0.9}rem` }}>
                {t.name}
              </Link>
            ))}
          </div>
        </Card>
      )}

      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-5">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-11 rounded-lg shimmer" />)}</div>
        ) : tags.length === 0 ? (
          <EmptyState icon="tags" title="No tags found" message="Add tags to your posts and they’ll appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">Tag</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Posts</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {tags.map((t) => (
                  <tr key={t.name} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40">
                    <td className="px-5 py-3 font-medium capitalize text-gray-900 dark:text-zinc-100">{t.name}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">/{t.slug}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{t.count}</td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`/tags/${t.slug}`} target="_blank" className="text-navy hover:text-clay dark:text-navy-light">View →</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
