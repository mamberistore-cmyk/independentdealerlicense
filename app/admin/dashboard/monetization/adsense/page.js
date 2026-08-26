'use client';

import { PageHeader, Card, Badge, Button } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import AdsenseReadiness from '@/components/admin/AdsenseReadiness';
import { siteConfig } from '@/lib/config';

export default function AdsensePage() {
  const client = siteConfig.adsenseClient;
  const configured = client && !client.includes('XXXX');

  return (
    <div>
      <PageHeader title="Google AdSense" subtitle="Approval readiness, Auto Ads status, and your publisher configuration." />

      {/* Live approval-readiness checklist */}
      <div className="mb-8">
        <AdsenseReadiness />
      </div>

      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-400">Publisher configuration</h2>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Publisher</h2>
            <Badge status={configured ? 'published' : 'draft'}>{configured ? 'Configured' : 'Not set'}</Badge>
          </div>
          <p className="mt-3 text-xs uppercase tracking-wide text-gray-400">Publisher ID</p>
          <p className="font-mono text-sm text-gray-800 dark:text-zinc-200">{client}</p>
          <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">
            {configured
              ? 'Auto Ads is wired into the site’s <head> and will serve ads automatically once your account is approved.'
              : 'Set NEXT_PUBLIC_ADSENSE_CLIENT to your ca-pub-XXXX ID to activate ads.'}
          </p>
        </Card>

        <Card className="p-5">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Auto Ads</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {[
              ['Auto Ads script in <head>', true],
              ['google-adsense-account meta tag', true],
              ['In-article ad slots (AdUnit)', true],
              ['ads.txt file', false],
            ].map(([label, ok]) => (
              <li key={label} className="flex items-center gap-2 text-gray-600 dark:text-zinc-300">
                <span className={`grid h-4 w-4 place-items-center rounded-full ${ok ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-zinc-700'}`}>
                  <Icon name={ok ? 'check' : 'close'} className="h-2.5 w-2.5" />
                </span>
                {label}
              </li>
            ))}
          </ul>
          <Button href="https://www.google.com/adsense" target="_blank" variant="secondary" icon="external" className="mt-4">Open AdSense</Button>
        </Card>
      </div>

      <Card className="mt-4 p-5">
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Revenue & performance</h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Estimated revenue, RPM, CTR and impressions require the AdSense API. See the <a href="/admin/dashboard/monetization/revenue" className="text-navy underline dark:text-navy-light">Revenue</a> tab.</p>
      </Card>
    </div>
  );
}
