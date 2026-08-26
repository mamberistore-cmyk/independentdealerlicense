'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, Badge, EmptyState, Button } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { slugify } from '@/lib/slug';
import { BASE } from '@/lib/adminNav';

export default function CategoriesPage() {
  const { posts, loading } = usePosts();

  const categories = useMemo(() => {
    const map = new Map();
    posts.forEach((p) => {
      const c = p.category || 'Uncategorized';
      map.set(c, (map.get(c) || 0) + 1);
    });
    return Array.from(map.entries())
      .map(([name, count]) => ({ name, count, slug: slugify(name) }))
      .sort((a, b) => b.count - a.count);
  }, [posts]);

  return (
    <div>
      <PageHeader title="Categories" subtitle="Categories are assigned in the post editor and update here automatically.">
        <Button href={`${BASE}/posts/new`} icon="add">New Post</Button>
      </PageHeader>

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
        <p>This is a file-based CMS, so a category exists whenever a post uses it. Assign or rename categories from within the <Link href={`${BASE}/posts`} className="text-navy underline dark:text-navy-light">post editor</Link>.</p>
      </div>

      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-5">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-lg shimmer" />)}</div>
        ) : categories.length === 0 ? (
          <EmptyState icon="categories" title="No categories yet" message="Assign a category to a post and it’ll appear here." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">Name</th>
                  <th className="px-5 py-3 font-medium">Slug</th>
                  <th className="px-5 py-3 font-medium">Posts</th>
                  <th className="px-5 py-3 font-medium">SEO</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {categories.map((c) => (
                  <tr key={c.name} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40">
                    <td className="px-5 py-3 font-medium text-gray-900 dark:text-zinc-100">{c.name}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">/{c.slug}</td>
                    <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{c.count}</td>
                    <td className="px-5 py-3"><Badge status={c.count >= 2 ? 'published' : 'draft'}>{c.count >= 2 ? 'Indexable' : 'Thin'}</Badge></td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`${BASE}/posts?q=${encodeURIComponent(c.name)}`} className="text-navy hover:text-clay dark:text-navy-light">View posts →</Link>
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
