import Link from 'next/link';
import { PageHeader, Card, Badge } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { siteConfig } from '@/lib/config';
import { BASE } from '@/lib/adminNav';

export const dynamic = 'force-dynamic';

const TABS = [
  { key: 'themes', label: 'Themes' },
  { key: 'customize', label: 'Customize' },
  { key: 'menus', label: 'Menus' },
  { key: 'widgets', label: 'Widgets' },
];

export default function AppearancePage({ searchParams }) {
  const tab = searchParams?.tab || 'themes';

  return (
    <div>
      <PageHeader title="Appearance" subtitle="Your site’s look, navigation, and layout." />

      <div className="mb-4 flex gap-1">
        {TABS.map((t) => (
          <Link key={t.key} href={`${BASE}/appearance?tab=${t.key}`} className={`rounded-lg px-3 py-1.5 text-sm font-medium ${tab === t.key ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}>{t.label}</Link>
        ))}
      </div>

      {tab === 'themes' && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="overflow-hidden">
            <div className="h-28 bg-gradient-to-br from-cream-100 to-clay-soft" />
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-900 dark:text-zinc-100">Editorial Warm</h3>
                <Badge status="published">Active</Badge>
              </div>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Inter + Fraunces, cream palette, paper texture.</p>
            </div>
          </Card>
          <Card className="grid place-items-center border-dashed p-8 text-center text-sm text-gray-400">
            <div>
              <Icon name="appearance" className="mx-auto h-6 w-6" />
              <p className="mt-2">The theme is coded with Tailwind in <code>tailwind.config.js</code> &amp; <code>globals.css</code>.</p>
            </div>
          </Card>
        </div>
      )}

      {tab === 'customize' && (
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Brand tokens</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[['Navy', '#1e3a5f'], ['Clay', '#c06f4f'], ['Cream', '#faf7f0'], ['Ink', '#23272f']].map(([name, hex]) => (
              <div key={name} className="rounded-lg border border-gray-200 p-3 dark:border-zinc-800">
                <span className="block h-10 w-full rounded-md" style={{ background: hex }} />
                <p className="mt-2 text-sm font-medium text-gray-800 dark:text-zinc-200">{name}</p>
                <p className="text-xs text-gray-400">{hex}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">Edit these in <code>tailwind.config.js</code> to rebrand the whole site.</p>
        </Card>
      )}

      {tab === 'menus' && (
        <Card className="p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Primary navigation</h2>
          <ul className="mt-4 space-y-2">
            {siteConfig.nav.map((n) => (
              <li key={n.href} className="flex items-center justify-between rounded-lg border border-gray-200 px-4 py-2.5 text-sm dark:border-zinc-800">
                <span className="flex items-center gap-2 text-gray-800 dark:text-zinc-200"><Icon name="drag" className="h-4 w-4 text-gray-300" /> {n.label}</span>
                <span className="font-mono text-xs text-gray-400">{n.href}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-gray-500 dark:text-zinc-400">Menu items are defined in <code>lib/config.js</code> (<code>siteConfig.nav</code>).</p>
        </Card>
      )}

      {tab === 'widgets' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {['Footer — Read', 'Footer — Legal'].map((w) => (
            <Card key={w} className="p-5">
              <h3 className="font-semibold text-gray-900 dark:text-zinc-100">{w}</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Rendered by <code>components/Footer.js</code>.</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
