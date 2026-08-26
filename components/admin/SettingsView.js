'use client';

import Link from 'next/link';
import { PageHeader, Card, Badge } from './ui';
import Icon from './Icon';
import { useLocalConfig } from './useLocalConfig';
import { useToast } from './Toast';
import { siteConfig } from '@/lib/config';
import { BASE } from '@/lib/adminNav';

const TABS = [
  ['general', 'General'],
  ['writing', 'Writing'],
  ['reading', 'Reading'],
  ['permalinks', 'Permalinks'],
  ['privacy', 'Privacy'],
  ['integrations', 'Integrations'],
];

const field = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-navy/40 disabled:bg-gray-50 disabled:text-gray-500 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:disabled:bg-zinc-800';
const label = 'mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400';

function Row({ children }) {
  return <div>{children}</div>;
}

function IntegrationRow({ name, ok, detail, help }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg border border-gray-200 px-4 py-3 dark:border-zinc-800">
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{name}</p>
          <Badge status={ok ? 'published' : 'draft'}>{ok ? 'Connected' : 'Not connected'}</Badge>
        </div>
        {detail && <p className="mt-0.5 truncate text-xs text-gray-500 dark:text-zinc-400">{detail}</p>}
        {help && !ok && <p className="mt-0.5 text-xs text-gray-400">{help}</p>}
      </div>
      <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ${ok ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-gray-100 text-gray-400 dark:bg-zinc-800 dark:text-zinc-500'}`}>
        <Icon name={ok ? 'check' : 'close'} className="h-4 w-4" />
      </span>
    </div>
  );
}

export default function SettingsView({ tab, status }) {
  const { notify } = useToast();
  const [prefs, savePrefs] = useLocalConfig('idl.settings.reading', { perPage: 9, showExcerpt: true });

  return (
    <div>
      <PageHeader title="Settings" subtitle="Configure how your site behaves." />

      <div className="mb-4 flex flex-wrap gap-1">
        {TABS.map(([key, lbl]) => (
          <Link key={key} href={`${BASE}/settings${key === 'general' ? '' : `?tab=${key}`}`} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === key ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>{lbl}</Link>
        ))}
      </div>

      {tab === 'general' && (
        <Card className="max-w-2xl p-6">
          <div className="mb-3 flex items-start gap-2 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 dark:bg-zinc-800/50 dark:text-zinc-400">
            <Icon name="info" className="mt-0.5 h-3.5 w-3.5 shrink-0" /> These come from <code>lib/config.js</code> and environment variables. Edit them there and redeploy.
          </div>
          <div className="space-y-4">
            <Row><label className={label}>Website name</label><input className={field} defaultValue={siteConfig.name} disabled /></Row>
            <Row><label className={label}>Website URL</label><input className={field} defaultValue={siteConfig.url} disabled /></Row>
            <Row><label className={label}>Tagline</label><input className={field} defaultValue={siteConfig.description} disabled /></Row>
            <div className="grid gap-4 sm:grid-cols-2">
              <Row><label className={label}>Timezone</label><input className={field} defaultValue="Auto (browser)" disabled /></Row>
              <Row><label className={label}>Language</label><input className={field} defaultValue="English (en)" disabled /></Row>
            </div>
          </div>
        </Card>
      )}

      {tab === 'writing' && (
        <Card className="max-w-2xl p-6">
          <div className="space-y-4">
            <Row><label className={label}>Default editor</label><input className={field} defaultValue="Markdown (block toolbar)" disabled /></Row>
            <Row><label className={label}>Default category</label><input className={field} defaultValue="Uncategorized" disabled /></Row>
            <Row><label className={label}>Default author</label><input className={field} defaultValue={siteConfig.author.name} disabled /></Row>
            <p className="text-xs text-gray-400">Posts are committed to <code>content/posts/*.md</code> via the GitHub API.</p>
          </div>
        </Card>
      )}

      {tab === 'reading' && (
        <Card className="max-w-2xl p-6">
          <div className="space-y-4">
            <Row>
              <label className={label}>Posts per page (blog grid)</label>
              <input type="number" min={3} max={24} className={field} value={prefs.perPage}
                onChange={(e) => savePrefs({ ...prefs, perPage: Number(e.target.value) })} />
              <p className="mt-1 text-xs text-gray-400">Saved locally. Wire into the blog grid to take effect site-wide.</p>
            </Row>
            <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-zinc-200">
              <input type="checkbox" className="h-4 w-4 rounded accent-navy" checked={prefs.showExcerpt} onChange={(e) => savePrefs({ ...prefs, showExcerpt: e.target.checked })} />
              Show excerpts in post cards
            </label>
            <button onClick={() => notify('Reading preferences saved locally.', 'success')} className="rounded-lg bg-navy px-4 py-2 text-sm font-medium text-white hover:bg-navy-light">Save changes</button>
          </div>
        </Card>
      )}

      {tab === 'permalinks' && (
        <Card className="max-w-2xl p-6">
          <div className="space-y-4">
            <Row><label className={label}>Post URL structure</label><input className={field} defaultValue="/blog/%slug%" disabled /></Row>
            <Row><label className={label}>Tag URL structure</label><input className={field} defaultValue="/tags/%slug%" disabled /></Row>
            <p className="text-xs text-gray-400">Routing is defined by the App Router folder structure in <code>app/(site)</code>.</p>
          </div>
        </Card>
      )}

      {tab === 'privacy' && (
        <Card className="max-w-2xl p-6">
          <div className="space-y-3 text-sm text-gray-600 dark:text-zinc-300">
            <p>Your published legal pages:</p>
            <ul className="space-y-2">
              {[['Privacy Policy', '/privacy-policy'], ['Terms of Use', '/terms'], ['Disclaimer', '/disclaimer']].map(([n, h]) => (
                <li key={h} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 dark:border-zinc-800">
                  <span>{n}</span>
                  <Link href={h} target="_blank" className="text-navy hover:text-clay dark:text-navy-light">View →</Link>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}

      {tab === 'integrations' && (
        <div className="max-w-2xl space-y-3">
          <IntegrationRow name="GitHub (post storage)" ok={status.github} detail={status.github ? `${status.githubOwner}/${status.githubRepo} · ${status.githubBranch}` : ''} help="Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO." />
          <IntegrationRow name="Google AdSense" ok={status.adsense} detail={status.adsense ? status.adsenseClient : ''} help="Set NEXT_PUBLIC_ADSENSE_CLIENT." />
          <IntegrationRow name="Vercel Deploy Hook" ok={status.deployHook} help="Optional — set VERCEL_DEPLOY_HOOK for instant rebuilds." />
          <IntegrationRow name="Session secret" ok={status.sessionSecret} help="Set SESSION_SECRET for signed sessions (a built-in fallback is used otherwise)." />
          <IntegrationRow name="Google Analytics" ok={status.analytics} detail={status.analytics ? `${status.gaId} · tag installed site-wide` : ''} help="Add GA to light up traffic dashboards." />
          <IntegrationRow name="Google Search Console" ok={status.searchConsole} detail={status.searchConsole ? 'Property verified' : ''} help="Verify your property to surface search metrics." />
        </div>
      )}
    </div>
  );
}
