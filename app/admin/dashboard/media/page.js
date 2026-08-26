'use client';

import { useMemo, useState } from 'react';
import { usePosts } from '@/components/admin/usePosts';
import { PageHeader, Card, EmptyState, Button } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { useToast } from '@/components/admin/Toast';

export default function MediaPage() {
  const { posts, loading } = usePosts();
  const { notify } = useToast();
  const [view, setView] = useState('grid');
  const [selected, setSelected] = useState(null);

  // Real media = the featured images actually referenced by your posts.
  const media = useMemo(() => {
    const seen = new Map();
    posts.forEach((p) => {
      if (p.cover && !seen.has(p.cover)) {
        seen.set(p.cover, { url: p.cover, usedBy: p.title, name: p.cover.split('/').pop().split('?')[0] });
      }
    });
    return Array.from(seen.values());
  }, [posts]);

  const copy = (url) => {
    try { navigator.clipboard.writeText(url); notify('URL copied to clipboard', 'success'); }
    catch (e) { notify('Could not copy', 'error'); }
  };

  return (
    <div>
      <PageHeader title="Media Library" subtitle="Images referenced by your posts. Add new media by pasting a URL in the editor.">
        <div className="flex rounded-lg border border-gray-200 p-0.5 dark:border-zinc-700">
          <button onClick={() => setView('grid')} className={`grid h-8 w-8 place-items-center rounded-md ${view === 'grid' ? 'bg-navy text-white' : 'text-gray-500'}`} aria-label="Grid view"><Icon name="grid" className="h-4 w-4" /></button>
          <button onClick={() => setView('list')} className={`grid h-8 w-8 place-items-center rounded-md ${view === 'list' ? 'bg-navy text-white' : 'text-gray-500'}`} aria-label="List view"><Icon name="list" className="h-4 w-4" /></button>
        </div>
      </PageHeader>

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>This project stores posts as files in GitHub, not a binary asset store, so image <em>uploads</em> need an external host (Cloudinary, S3, or Unsplash URLs). The images your posts already use are catalogued below.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square rounded-xl shimmer" />)}</div>
      ) : media.length === 0 ? (
        <Card><EmptyState icon="media" title="No media yet" message="Add a featured image URL to a post and it’ll be catalogued here." /></Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <button key={m.url} onClick={() => setSelected(m)} className="group overflow-hidden rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt={m.usedBy} className="aspect-square w-full object-cover" loading="lazy" />
              <p className="truncate px-3 py-2 text-xs text-gray-500 dark:text-zinc-400">{m.usedBy}</p>
            </button>
          ))}
        </div>
      ) : (
        <Card className="divide-y divide-gray-100 dark:divide-zinc-800">
          {media.map((m) => (
            <div key={m.url} className="flex items-center gap-4 p-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={m.url} alt="" className="h-12 w-16 rounded-md object-cover" loading="lazy" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900 dark:text-zinc-100">Used by “{m.usedBy}”</p>
                <p className="truncate text-xs text-gray-400">{m.url}</p>
              </div>
              <Button size="sm" variant="secondary" icon="link" onClick={() => copy(m.url)}>Copy URL</Button>
            </div>
          ))}
        </Card>
      )}

      {/* Detail drawer */}
      {selected && (
        <div className="fixed inset-0 z-[80] flex justify-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} />
          <div className="relative h-full w-full max-w-sm overflow-y-auto border-l border-gray-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-zinc-50">Attachment details</h3>
              <button onClick={() => setSelected(null)} className="grid h-8 w-8 place-items-center rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800"><Icon name="close" /></button>
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={selected.url} alt="" className="w-full rounded-lg" />
            <dl className="mt-4 space-y-3 text-sm">
              <div><dt className="text-xs uppercase text-gray-400">Filename</dt><dd className="break-all text-gray-700 dark:text-zinc-300">{selected.name}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">Used by</dt><dd className="text-gray-700 dark:text-zinc-300">{selected.usedBy}</dd></div>
              <div><dt className="text-xs uppercase text-gray-400">URL</dt><dd className="break-all text-gray-700 dark:text-zinc-300">{selected.url}</dd></div>
            </dl>
            <Button className="mt-4 w-full" variant="secondary" icon="link" onClick={() => copy(selected.url)}>Copy URL</Button>
          </div>
        </div>
      )}
    </div>
  );
}
