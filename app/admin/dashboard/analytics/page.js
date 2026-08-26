'use client';

import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, IntegrationNotice } from '@/components/admin/ui';
import StatCard from '@/components/admin/StatCard';
import AreaChart from '@/components/admin/AreaChart';

function lastMonths(count) {
  const out = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    out.push({ key: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('en-US', { month: 'short' }) });
  }
  return out;
}

export default function AnalyticsPage() {
  const { posts, loading } = usePosts();
  const months = lastMonths(10);
  const counts = months.map((m) =>
    posts.filter((p) => p.date && `${new Date(p.date).getFullYear()}-${String(new Date(p.date).getMonth() + 1).padStart(2, '0')}` === m.key).length
  );

  return (
    <div>
      <PageHeader title="Analytics" subtitle="Traffic, sources, and audience insights." />

      <div className="mb-5">
        <IntegrationNotice service="Google Analytics" what="isn’t connected, so traffic and visitor metrics aren’t available yet." />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        <StatCard icon="eye" label="Views" value={null} connect />
        <StatCard icon="users" label="Visitors" value={null} connect />
        <StatCard icon="analytics" label="Organic" value={null} connect />
        <StatCard icon="globe" label="Direct" value={null} connect />
        <StatCard icon="comments" label="Social" value={null} connect />
      </div>

      <Card className="mt-5 p-5">
        <div className="mb-4">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Publishing cadence</h2>
          <p className="text-sm text-gray-500 dark:text-zinc-400">Real data — posts published per month across your content.</p>
        </div>
        {loading ? <div className="h-[240px] rounded-lg shimmer" /> : (
          <AreaChart labels={months.map((m) => m.label)} series={[{ name: 'Posts', color: '#1e3a5f', values: counts }]} />
        )}
      </Card>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Traffic sources</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Organic, direct, referral and social breakdown appears here once analytics is connected.</p>
          <div className="mt-4 grid h-40 place-items-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 dark:border-zinc-700">Connect Google Analytics</div>
        </Card>
        <Card className="p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Top pages</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Your most-viewed posts will rank here with live view counts.</p>
          <div className="mt-4 grid h-40 place-items-center rounded-lg border border-dashed border-gray-300 text-sm text-gray-400 dark:border-zinc-700">Connect Google Analytics</div>
        </Card>
      </div>
    </div>
  );
}
