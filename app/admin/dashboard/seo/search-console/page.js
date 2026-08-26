'use client';

import { PageHeader, Card, IntegrationNotice } from '@/components/admin/ui';
import StatCard from '@/components/admin/StatCard';

export default function SearchConsolePage() {
  return (
    <div>
      <PageHeader title="Search Console" subtitle="Google Search performance for your site." />
      <div className="mb-5">
        <IntegrationNotice service="Google Search Console" what="isn’t connected yet." />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon="searchconsole" label="Total clicks" value={null} connect />
        <StatCard icon="eye" label="Impressions" value={null} connect />
        <StatCard icon="analytics" label="Avg. position" value={null} connect />
        <StatCard icon="revenue" label="Avg. CTR" value={null} connect />
        <StatCard icon="globe" label="Indexed pages" value={null} connect />
        <StatCard icon="seo" label="Coverage issues" value={null} connect />
      </div>
      <Card className="mt-5 p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">How to connect</h2>
        <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-gray-600 dark:text-zinc-300">
          <li>Verify your property in <span className="font-medium">Google Search Console</span>.</li>
          <li>Add the verification <code>meta</code> token to <code>app/layout.js</code> (the <code>verification</code> field is stubbed and ready).</li>
          <li>To surface live metrics here, add the Search Console API credentials in Settings → Integrations.</li>
        </ol>
      </Card>
    </div>
  );
}
