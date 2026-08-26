'use client';

import Link from 'next/link';
import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, Button, Badge, EmptyState } from '@/components/admin/ui';
import StatCard from '@/components/admin/StatCard';
import AreaChart from '@/components/admin/AreaChart';
import Icon from '@/components/admin/Icon';
import { BASE } from '@/lib/adminNav';

function monthKey(d) {
  const dt = new Date(d);
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}`;
}

function lastMonths(count) {
  const out = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({
      key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`,
      label: d.toLocaleDateString('en-US', { month: 'short' }),
    });
  }
  return out;
}

export default function OverviewPage() {
  const { posts, loading, githubReady } = usePosts();

  const published = posts.filter((p) => p.status === 'published');
  const drafts = posts.filter((p) => p.status === 'draft');
  const scheduled = posts.filter((p) => p.status === 'scheduled');

  const months = lastMonths(8);
  const counts = months.map((m) => posts.filter((p) => p.date && monthKey(p.date) === m.key).length);
  const thisMonth = counts[counts.length - 1] || 0;
  const prevMonth = counts[counts.length - 2] || 0;
  const monthDelta = prevMonth ? Math.round(((thisMonth - prevMonth) / prevMonth) * 100) : (thisMonth ? 100 : 0);

  const totalWords = posts.reduce((s, p) => s + (p.words || 0), 0);

  const quickActions = [
    { label: 'Create Post', icon: 'add', href: `${BASE}/posts/new` },
    { label: 'Media Library', icon: 'media', href: `${BASE}/media` },
    { label: 'Manage Comments', icon: 'comments', href: `${BASE}/comments` },
    { label: 'View Website', icon: 'external', href: '/', external: true },
  ];

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="A snapshot of your content and where to jump in next."
      >
        <Button href={`${BASE}/posts/new`} icon="add">New Post</Button>
      </PageHeader>

      {!githubReady && !loading && (
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <Icon name="warning" className="mt-0.5 h-4 w-4 shrink-0" />
          <p>GitHub isn’t configured yet, so posts can’t be listed or published. Add your <code>GITHUB_TOKEN</code>, <code>GITHUB_OWNER</code>, and <code>GITHUB_REPO</code> environment variables.</p>
        </div>
      )}

      {/* KPI grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-[132px] rounded-xl border border-gray-200 bg-white shimmer dark:border-zinc-800 dark:bg-zinc-900" />
          ))
        ) : (
          <>
            <StatCard icon="posts" label="Total Posts" value={posts.length} hint={`${totalWords.toLocaleString()} words total`} />
            <StatCard icon="check" label="Published" value={published.length} delta={monthDelta} hint={`${thisMonth} this month`} />
            <StatCard icon="edit" label="Drafts" value={drafts.length} hint={`${scheduled.length} scheduled`} />
            <StatCard icon="clock" label="Avg. Read Time" value={`${Math.round(posts.reduce((s, p) => s + (p.readingTime || 0), 0) / (posts.length || 1))} min`} />
          </>
        )}
      </div>

      {/* Integration KPIs (honest, need analytics) */}
      <div className="mt-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard icon="eye" label="Total Views" value={null} connect hint="Google Analytics" />
        <StatCard icon="users" label="Unique Visitors" value={null} connect hint="Google Analytics" />
        <StatCard icon="revenue" label="Est. Revenue" value={null} connect hint="AdSense" />
        <StatCard icon="analytics" label="Organic Traffic" value={null} connect hint="Search Console" />
      </div>

      {/* Chart + side */}
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Publishing activity</h2>
              <p className="text-sm text-gray-500 dark:text-zinc-400">Posts published per month (live from your content)</p>
            </div>
            <span className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-zinc-400">
              <span className="h-2.5 w-2.5 rounded-full bg-navy" /> Posts
            </span>
          </div>
          {loading ? (
            <div className="h-[240px] rounded-lg shimmer" />
          ) : (
            <AreaChart
              labels={months.map((m) => m.label)}
              series={[{ name: 'Posts', color: '#1e3a5f', values: counts }]}
            />
          )}
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Quick actions</h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {quickActions.map((a) => (
              <Link
                key={a.label}
                href={a.href}
                target={a.external ? '_blank' : undefined}
                className="flex flex-col items-start gap-3 rounded-xl border border-gray-200 p-4 transition-colors hover:border-navy/40 hover:bg-gray-50 dark:border-zinc-800 dark:hover:bg-zinc-800"
              >
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy/10 text-navy dark:bg-navy-light/20 dark:text-navy-light">
                  <Icon name={a.icon} className="h-[18px] w-[18px]" />
                </span>
                <span className="text-sm font-medium text-gray-700 dark:text-zinc-200">{a.label}</span>
              </Link>
            ))}
          </div>
        </Card>
      </div>

      {/* Recent posts */}
      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4 dark:border-zinc-800">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Recent posts</h2>
          <Link href={`${BASE}/posts`} className="text-sm font-medium text-navy hover:text-clay dark:text-navy-light">View all →</Link>
        </div>
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 rounded-lg shimmer" />)}
          </div>
        ) : posts.length === 0 ? (
          <EmptyState
            icon="posts"
            title="No posts yet"
            message="Write your first article and it’ll show up here."
            action={<Button href={`${BASE}/posts/new`} icon="add">Create your first post</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">Title</th>
                  <th className="px-5 py-3 font-medium">Category</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {posts.slice(0, 5).map((p) => (
                  <tr key={p.slug} className="hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                    <td className="px-5 py-3">
                      <Link href={`${BASE}/posts/${p.slug}/edit`} className="font-medium text-gray-900 hover:text-navy dark:text-zinc-100">{p.title}</Link>
                    </td>
                    <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{p.category}</td>
                    <td className="px-5 py-3"><Badge status={p.status}>{p.status}</Badge></td>
                    <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">
                      {p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <Link href={`${BASE}/posts/${p.slug}/edit`} className="text-navy hover:text-clay dark:text-navy-light">Edit</Link>
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
