'use client';

import { PageHeader, Card, Button } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { useLocalConfig } from '@/components/admin/useLocalConfig';
import { useToast } from '@/components/admin/Toast';

const DEFAULTS = [
  { id: 'header', name: 'Header', desc: 'Below the top navigation', enabled: false, device: 'all', code: '' },
  { id: 'before', name: 'Before content', desc: 'Above the article body', enabled: true, device: 'all', code: '' },
  { id: 'inside', name: 'Inside content', desc: 'Mid-article, after a few paragraphs', enabled: true, device: 'all', code: '' },
  { id: 'after', name: 'After content', desc: 'Below the article', enabled: true, device: 'all', code: '' },
  { id: 'sidebar', name: 'Sidebar', desc: 'Sticky sidebar unit', enabled: false, device: 'desktop', code: '' },
  { id: 'footer', name: 'Footer', desc: 'Above the footer', enabled: false, device: 'all', code: '' },
];

export default function PlacementsPage() {
  const [placements, save, loaded] = useLocalConfig('idl.adPlacements', DEFAULTS);
  const { notify } = useToast();

  const update = (id, patch) => save(placements.map((p) => (p.id === id ? { ...p, ...patch } : p)));

  return (
    <div>
      <PageHeader title="Ad Placements" subtitle="Control where ads render across your posts." />

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>These preferences are saved in your browser. With Auto Ads enabled, Google places ads automatically; use the <code>&lt;AdUnit slot=&quot;…&quot; /&gt;</code> component for manual slots defined here.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(loaded ? placements : DEFAULTS).map((p) => (
          <Card key={p.id} className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-100">{p.name}</h3>
                <p className="text-xs text-gray-500 dark:text-zinc-400">{p.desc}</p>
              </div>
              <button
                onClick={() => update(p.id, { enabled: !p.enabled })}
                className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${p.enabled ? 'bg-navy' : 'bg-gray-300 dark:bg-zinc-700'}`}
                aria-pressed={p.enabled}
                aria-label={`Toggle ${p.name}`}
              >
                <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${p.enabled ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400">Device targeting</label>
                <select value={p.device} onChange={(e) => update(p.id, { device: e.target.value })} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                  <option value="all">All devices</option>
                  <option value="desktop">Desktop only</option>
                  <option value="mobile">Mobile only</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400">Ad code / slot ID</label>
                <input value={p.code} onChange={(e) => update(p.id, { code: e.target.value })} placeholder="e.g. 1234567890" className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
              </div>
              <div className="rounded-lg border border-dashed border-gray-300 py-6 text-center text-xs text-gray-400 dark:border-zinc-700">
                {p.enabled ? 'Ad preview area' : 'Disabled'}
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={() => { save(DEFAULTS); notify('Reset to defaults.', 'info'); }}>Reset to defaults</Button>
      </div>
    </div>
  );
}
