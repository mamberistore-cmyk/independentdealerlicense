'use client';

import { PageHeader, Card, IntegrationNotice, EmptyState } from '@/components/admin/ui';
import StatCard from '@/components/admin/StatCard';

export default function RevenuePage() {
  return (
    <div>
      <PageHeader title="Revenue" subtitle="AdSense earnings and performance." />
      <div className="mb-5">
        <IntegrationNotice service="Google AdSense API" what="isn’t connected, so live earnings aren’t available yet." />
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        <StatCard icon="revenue" label="Estimated revenue" value={null} connect />
        <StatCard icon="analytics" label="RPM" value={null} connect />
        <StatCard icon="eye" label="Impressions" value={null} connect />
        <StatCard icon="adsense" label="Ad clicks" value={null} connect />
        <StatCard icon="seo" label="CTR" value={null} connect />
        <StatCard icon="globe" label="Page views" value={null} connect />
      </div>
      <Card className="mt-5">
        <EmptyState icon="revenue" title="No revenue data yet" message="Connect the AdSense API to see estimated revenue, RPM, top-earning pages and daily trends here." tone="connect" />
      </Card>
    </div>
  );
}
