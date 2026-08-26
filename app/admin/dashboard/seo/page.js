'use client';

import Link from 'next/link';
import { useMemo } from 'react';
import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, EmptyState, IntegrationNotice } from '@/components/admin/ui';
import StatCard from '@/components/admin/StatCard';
import { BASE } from '@/lib/adminNav';

// On-page meta score from the metadata we have without loading each body.
function metaScore(p) {
  let s = 0;
  const checks = [
    p.description && p.description.length > 0,               // has description
    p.description && p.description.length >= 100 && p.description.length <= 165,
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(p.slug) && p.slug.length <= 60,
    Boolean(p.cover),
    (p.tags || []).length > 0,
    p.title.length >= 25 && p.title.length <= 65,
  ];
  const weights = [22, 18, 18, 14, 12, 16];
  checks.forEach((ok, i) => { if (ok) s += weights[i]; });
  return Math.min(100, s);
}

function scoreBadge(score) {
  if (score >= 80) return { label: 'Excellent', cls: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' };
  if (score >= 60) return { label: 'Good', cls: 'bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-300' };
  if (score >= 40) return { label: 'Okay', cls: 'bg-amber-50 text-amber-700 dark:bg-amber-950/50 dark:text-amber-300' };
  return { label: 'Needs work', cls: 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300' };
}

export default function SeoPage() {
  const { posts, loading } = usePosts();

  const rows = useMemo(
    () => posts.map((p) => ({ ...p, score: metaScore(p) })).sort((a, b) => a.score - b.score),
    [posts]
  );
  const avg = rows.length ? Math.round(rows.reduce((s, r) => s + r.score, 0) / rows.length) : 0;
  const good = rows.filter((r) => r.score >= 80).length;
  const missingMeta = rows.filter((r) => !r.description).length;

  return (
    <div>
      <PageHeader title="SEO" subtitle="On-page SEO health for every post, plus search performance." />

      <div className="mb-5">
        <IntegrationNotice service="Google Search Console" what="isn’t connected, so clicks, impressions and average position aren’t available yet." />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="seo" label="Avg. on-page score" value={loading ? null : `${avg}/100`} />
        <StatCard icon="check" label="Excellent posts" value={loading ? null : good} hint={`${rows.length} total`} />
        <StatCard icon="warning" label="Missing meta desc." value={loading ? null : missingMeta} />
        <StatCard icon="searchconsole" label="Organic clicks" value={null} connect hint="Search Console" />
      </div>

      <Card className="mt-5 overflow-hidden">
        <div className="border-b border-gray-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Per-post SEO scores</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Lowest scores first — these are your quickest wins.</p>
        </div>
        {loading ? (
          <div className="space-y-2 p-5">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-12 rounded-lg shimmer" />)}</div>
        ) : rows.length === 0 ? (
          <EmptyState icon="seo" title="No posts to analyze" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">Post</th>
                  <th className="px-5 py-3 font-medium">Meta description</th>
                  <th className="px-5 py-3 font-medium">Score</th>
                  <th className="px-5 py-3 font-medium text-right">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {rows.map((p) => {
                  const b = scoreBadge(p.score);
                  return (
                    <tr key={p.slug} className="hover:bg-gray-50 dark:hover:bg-zinc-800/40">
                      <td className="px-5 py-3">
                        <Link href={`${BASE}/posts/${p.slug}/edit`} className="line-clamp-1 font-medium text-gray-900 hover:text-navy dark:text-zinc-100">{p.title}</Link>
                      </td>
                      <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{p.description ? `${p.description.length} chars` : <span className="text-red-500">Missing</span>}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${b.cls}`}>{p.score} · {b.label}</span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link href={`${BASE}/posts/${p.slug}/edit`} className="text-navy hover:text-clay dark:text-navy-light">Improve →</Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
