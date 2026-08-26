'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { usePosts } from './usePosts';
import { PageHeader, Card, Button, Badge, EmptyState } from './ui';
import Icon from './Icon';
import ConfirmDialog from './ConfirmDialog';
import { useToast } from './Toast';
import { BASE } from '@/lib/adminNav';

const PER_PAGE = 8;
const STATUSES = ['all', 'published', 'draft', 'scheduled', 'pending', 'private'];

export default function PostsManager({ initialQuery = '' }) {
  const { posts, loading, githubReady, refresh } = usePosts();
  const { notify } = useToast();

  const [query, setQuery] = useState(initialQuery);
  const [status, setStatus] = useState('all');
  const [category, setCategory] = useState('all');
  const [author, setAuthor] = useState('all');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());
  const [confirm, setConfirm] = useState(null); // {type, slugs, title}
  const [busy, setBusy] = useState(false);

  const categories = useMemo(
    () => ['all', ...Array.from(new Set(posts.map((p) => p.category).filter(Boolean)))],
    [posts]
  );
  const authors = useMemo(
    () => ['all', ...Array.from(new Set(posts.map((p) => p.author).filter(Boolean)))],
    [posts]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = posts.filter((p) => {
      if (status !== 'all' && p.status !== status) return false;
      if (category !== 'all' && p.category !== category) return false;
      if (author !== 'all' && p.author !== author) return false;
      if (q && !(`${p.title} ${p.tags.join(' ')} ${p.category}`.toLowerCase().includes(q))) return false;
      return true;
    });
    list = list.sort((a, b) => {
      if (sort === 'title') return a.title.localeCompare(b.title);
      const da = new Date(a.date || 0).getTime();
      const db = new Date(b.date || 0).getTime();
      return sort === 'oldest' ? da - db : db - da;
    });
    return list;
  }, [posts, query, status, category, author, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const current = Math.min(page, totalPages);
  const pageItems = filtered.slice((current - 1) * PER_PAGE, current * PER_PAGE);

  const allOnPageSelected = pageItems.length > 0 && pageItems.every((p) => selected.has(p.slug));
  const toggleAll = () => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (allOnPageSelected) pageItems.forEach((p) => next.delete(p.slug));
      else pageItems.forEach((p) => next.add(p.slug));
      return next;
    });
  };
  const toggleOne = (slug) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const resetToFirstPage = () => setPage(1);

  const doTrash = async (slugs) => {
    setBusy(true);
    let ok = 0;
    for (const slug of slugs) {
      const post = posts.find((p) => p.slug === slug);
      try {
        const res = await fetch('/api/delete-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ slug, sha: post?.sha, title: post?.title }),
        });
        if (res.ok) ok += 1;
      } catch (e) {
        /* continue */
      }
    }
    setBusy(false);
    setConfirm(null);
    setSelected(new Set());
    notify(`${ok} post${ok === 1 ? '' : 's'} moved to trash. Rebuilding…`, ok ? 'success' : 'error');
    refresh();
  };

  const duplicate = async (slug) => {
    notify('Duplicating…', 'info', 1500);
    try {
      const res = await fetch(`/api/post?slug=${encodeURIComponent(slug)}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const fm = data.frontmatter || {};
      const create = await fetch('/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...fm,
          title: `${fm.title || slug} (Copy)`,
          tags: Array.isArray(fm.tags) ? fm.tags.join(', ') : fm.tags || '',
          status: 'draft',
          body: data.content,
        }),
      });
      const cr = await create.json();
      if (!create.ok) throw new Error(cr.error);
      notify('Duplicated as a draft.', 'success');
      refresh();
    } catch (e) {
      notify(e.message || 'Could not duplicate.', 'error');
    }
  };

  const selectClass =
    'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-700 outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200';

  return (
    <div>
      <PageHeader title="Posts" subtitle={`${posts.length} total · manage everything you’ve written`}>
        <Button href={`${BASE}/posts/new`} icon="add">Add New Post</Button>
      </PageHeader>

      {/* Filters */}
      <Card className="mb-4 p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative min-w-[200px] flex-1">
            <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); resetToFirstPage(); }}
              placeholder="Search posts…"
              className="w-full rounded-lg border border-gray-200 bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
            />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); resetToFirstPage(); }} className={selectClass} aria-label="Filter by status">
            {STATUSES.map((s) => <option key={s} value={s}>{s === 'all' ? 'All statuses' : s[0].toUpperCase() + s.slice(1)}</option>)}
          </select>
          <select value={category} onChange={(e) => { setCategory(e.target.value); resetToFirstPage(); }} className={selectClass} aria-label="Filter by category">
            {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All categories' : c}</option>)}
          </select>
          <select value={author} onChange={(e) => { setAuthor(e.target.value); resetToFirstPage(); }} className={selectClass} aria-label="Filter by author">
            {authors.map((a) => <option key={a} value={a}>{a === 'all' ? 'All authors' : a}</option>)}
          </select>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className={selectClass} aria-label="Sort">
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>
      </Card>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-navy/20 bg-navy/5 px-4 py-2.5 text-sm dark:border-navy-light/30 dark:bg-navy/10">
          <span className="font-medium text-navy dark:text-navy-light">{selected.size} selected</span>
          <div className="flex items-center gap-2">
            <Button variant="danger" size="sm" icon="trash" onClick={() => setConfirm({ type: 'bulk', slugs: [...selected] })}>
              Move to trash
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setSelected(new Set())}>Clear</Button>
          </div>
        </div>
      )}

      {/* Table */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="space-y-2 p-5">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 rounded-lg shimmer" />)}
          </div>
        ) : !githubReady ? (
          <EmptyState icon="warning" title="GitHub not connected" message="Add GITHUB_TOKEN, GITHUB_OWNER and GITHUB_REPO to load and manage your posts." />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="posts"
            title={posts.length ? 'No posts match your filters' : 'No posts yet'}
            message={posts.length ? 'Try clearing the search or filters.' : 'Write your first article to get started.'}
            action={!posts.length && <Button href={`${BASE}/posts/new`} icon="add">Create your first post</Button>}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[820px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                  <th className="w-10 px-4 py-3">
                    <input type="checkbox" checked={allOnPageSelected} onChange={toggleAll} className="h-4 w-4 rounded border-gray-300 accent-navy" aria-label="Select all" />
                  </th>
                  <th className="px-3 py-3 font-medium">Post</th>
                  <th className="px-3 py-3 font-medium">Author</th>
                  <th className="px-3 py-3 font-medium">Category</th>
                  <th className="px-3 py-3 font-medium">Status</th>
                  <th className="px-3 py-3 font-medium">Date</th>
                  <th className="px-3 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                {pageItems.map((p) => (
                  <tr key={p.slug} className="group hover:bg-gray-50 dark:hover:bg-zinc-800/40">
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selected.has(p.slug)} onChange={() => toggleOne(p.slug)} className="h-4 w-4 rounded border-gray-300 accent-navy" aria-label={`Select ${p.title}`} />
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="h-11 w-16 shrink-0 overflow-hidden rounded-md bg-gradient-to-br from-navy/15 to-clay/15">
                          {p.cover ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.cover} alt="" className="h-full w-full object-cover" loading="lazy" />
                          ) : null}
                        </span>
                        <div className="min-w-0">
                          <Link href={`${BASE}/posts/${p.slug}/edit`} className="line-clamp-1 font-medium text-gray-900 hover:text-navy dark:text-zinc-100">{p.title}</Link>
                          <p className="line-clamp-1 text-xs text-gray-400 dark:text-zinc-500">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500 dark:text-zinc-400">{p.author || '—'}</td>
                    <td className="px-3 py-3 text-gray-500 dark:text-zinc-400">{p.category}</td>
                    <td className="px-3 py-3"><Badge status={p.status}>{p.status}</Badge></td>
                    <td className="px-3 py-3 text-gray-500 dark:text-zinc-400">
                      {p.date ? new Date(p.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`${BASE}/posts/${p.slug}/edit`} title="Edit" className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-navy dark:text-zinc-400 dark:hover:bg-zinc-700"><Icon name="edit" className="h-4 w-4" /></Link>
                        <button onClick={() => duplicate(p.slug)} title="Duplicate" className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-navy dark:text-zinc-400 dark:hover:bg-zinc-700"><Icon name="duplicate" className="h-4 w-4" /></button>
                        <Link href={`/blog/${p.slug}`} target="_blank" title="Preview" className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-gray-100 hover:text-navy dark:text-zinc-400 dark:hover:bg-zinc-700"><Icon name="eye" className="h-4 w-4" /></Link>
                        <button onClick={() => setConfirm({ type: 'single', slugs: [p.slug], title: p.title })} title="Trash" className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 dark:text-zinc-400 dark:hover:bg-red-950/40"><Icon name="trash" className="h-4 w-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filtered.length > PER_PAGE && (
          <div className="flex items-center justify-between border-t border-gray-200 px-5 py-3 text-sm dark:border-zinc-800">
            <span className="text-gray-500 dark:text-zinc-400">
              Showing {(current - 1) * PER_PAGE + 1}–{Math.min(current * PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="sm" disabled={current <= 1} onClick={() => setPage(current - 1)}>Prev</Button>
              <span className="px-2 text-gray-500 dark:text-zinc-400">Page {current} / {totalPages}</span>
              <Button variant="secondary" size="sm" disabled={current >= totalPages} onClick={() => setPage(current + 1)}>Next</Button>
            </div>
          </div>
        )}
      </Card>

      <ConfirmDialog
        open={Boolean(confirm)}
        title={confirm?.type === 'bulk' ? `Trash ${confirm.slugs.length} posts?` : 'Move this post to trash?'}
        message={confirm?.type === 'bulk'
          ? 'These posts will be removed from your repository. This triggers a rebuild.'
          : `“${confirm?.title}” will be removed from your repository. This triggers a rebuild.`}
        confirmLabel="Move to trash"
        busy={busy}
        onConfirm={() => doTrash(confirm.slugs)}
        onCancel={() => setConfirm(null)}
      />
    </div>
  );
}
