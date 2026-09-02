'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MarkdownField from './MarkdownField';
import SeoPanel from './SeoPanel';
import Icon from './Icon';
import { Button } from './ui';
import { useToast } from './Toast';
import { slugify } from '@/lib/slug';
import { siteConfig } from '@/lib/config';
import { BASE } from '@/lib/adminNav';

const today = () => new Date().toISOString().slice(0, 10);

const STARTER = `Open with a real hook — a story, a number, a mistake you made.

## A section heading

Write like you talk. Short paragraphs. A concrete example beats an adjective.

- A practical point
- Another one

> Drop in a quote when it earns the space.

Wrap up with the single most useful takeaway.`;

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200';
const labelCls = 'mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400';

function Section({ title, icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <button type="button" onClick={() => setOpen((v) => !v)} className="flex w-full items-center justify-between px-4 py-3">
        <span className="flex items-center gap-2 text-sm font-semibold text-gray-800 dark:text-zinc-100">
          <Icon name={icon} className="h-4 w-4 text-gray-400" /> {title}
        </span>
        <Icon name="chevron" className={`h-4 w-4 text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      {open && <div className="border-t border-gray-100 p-4 dark:border-zinc-800">{children}</div>}
    </div>
  );
}

const STATUS_OPTIONS = [
  { value: 'draft', label: 'Draft' },
  { value: 'pending', label: 'Pending Review' },
  { value: 'published', label: 'Published' },
  { value: 'scheduled', label: 'Scheduled' },
];

export default function PostEditor({ mode = 'new', initial = null, categories = [] }) {
  const router = useRouter();
  const { notify } = useToast();

  const storageKey = `idl.draft.${mode === 'edit' && initial ? initial.slug : 'new'}`;

  const seed = () => {
    if (mode === 'edit' && initial) {
      const fm = initial.frontmatter || {};
      return {
        title: fm.title || '',
        slug: initial.slug,
        description: fm.description || '',
        excerpt: fm.excerpt || '',
        body: initial.content || '',
        tags: Array.isArray(fm.tags) ? fm.tags.join(', ') : fm.tags || '',
        category: fm.category || '',
        status: (fm.status || 'published').toLowerCase(),
        visibility: (fm.status || '').toLowerCase() === 'private' ? 'private' : 'public',
        date: fm.date ? String(fm.date).slice(0, 10) : today(),
        cover: fm.cover || '',
        author: fm.author || siteConfig.author.name,
        seoTitle: fm.seoTitle || '',
        focusKeyword: fm.focusKeyword || '',
        canonical: fm.canonical || '',
        ogTitle: fm.ogTitle || '',
        ogDescription: fm.ogDescription || '',
        ogImage: fm.ogImage || '',
      };
    }
    return {
      title: '', slug: '', description: '', excerpt: '', body: STARTER,
      tags: '', category: '', status: 'draft', visibility: 'public',
      date: today(), cover: '', author: siteConfig.author.name,
      seoTitle: '', focusKeyword: '', canonical: '', ogTitle: '', ogDescription: '', ogImage: '',
    };
  };

  const [fields, setFields] = useState(seed);
  const [slugTouched, setSlugTouched] = useState(mode === 'edit');
  const [saving, setSaving] = useState(false);
  const [autosavedAt, setAutosavedAt] = useState(null);
  const [recovered, setRecovered] = useState(null); // pending recovery payload
  const dirtyRef = useRef(false);
  const savedSnapshot = useRef(JSON.stringify(seed()));

  // Offer to restore a locally-saved draft on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.fields && JSON.stringify(parsed.fields) !== savedSnapshot.current) {
          setRecovered(parsed);
        }
      }
    } catch (e) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const update = useCallback(
    (key, value) => {
      if (key === 'slug' && mode === 'edit') return; // slug is fixed once created
      setFields((f) => {
        const next = { ...f, [key]: value };
        if (key === 'title' && !slugTouched && mode === 'new') {
          next.slug = slugify(value);
        }
        return next;
      });
    },
    [slugTouched, mode]
  );

  const seoUpdate = (key, value) => {
    if (key === 'slug') setSlugTouched(true);
    update(key, value);
  };

  // Debounced autosave to localStorage.
  useEffect(() => {
    dirtyRef.current = JSON.stringify(fields) !== savedSnapshot.current;
    const t = setTimeout(() => {
      try {
        localStorage.setItem(storageKey, JSON.stringify({ fields, at: Date.now() }));
        if (dirtyRef.current) setAutosavedAt(new Date());
      } catch (e) {}
    }, 800);
    return () => clearTimeout(t);
  }, [fields, storageKey]);

  // Warn before leaving with unsaved changes.
  useEffect(() => {
    const handler = (e) => {
      if (dirtyRef.current) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, []);

  const effectiveStatus = () => (fields.visibility === 'private' ? 'private' : fields.status);

  const checklist = [
    { label: 'Title completed', ok: fields.title.trim().length >= 5 },
    { label: 'Featured image added', ok: Boolean(fields.cover.trim()) },
    { label: 'Category selected', ok: Boolean(fields.category.trim()) },
    { label: 'SEO title completed', ok: Boolean((fields.seoTitle || fields.title).trim()) },
    { label: 'Meta description completed', ok: fields.description.trim().length >= 50 },
    { label: 'URL slug optimized', ok: /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(fields.slug) },
  ];

  const save = async (statusOverride) => {
    const status = statusOverride || effectiveStatus();
    if (!fields.title.trim()) return notify('Add a title first.', 'error');
    if (!fields.body.trim()) return notify('The post body is empty.', 'error');
    if (status === 'scheduled' && new Date(fields.date) <= new Date()) {
      return notify('Pick a future date to schedule.', 'error');
    }

    setSaving(true);
    const payload = { ...fields, status };
    try {
      let res;
      if (mode === 'edit') {
        res = await fetch('/api/update-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...payload, slug: initial.slug, sha: initial.sha }),
        });
      } else {
        res = await fetch('/api/create-post', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Save failed.');

      savedSnapshot.current = JSON.stringify(fields);
      dirtyRef.current = false;
      try { localStorage.removeItem(storageKey); } catch (e) {}

      const label = status === 'published' ? 'Published' : status === 'scheduled' ? 'Scheduled' : 'Saved';
      notify(`✓ ${label} successfully. Rebuilding the site…`, 'success');

      if (mode === 'new') {
        router.replace(`${BASE}/posts/${data.slug}/edit`);
        router.refresh();
      }
    } catch (e) {
      notify(e.message, 'error');
    } finally {
      setSaving(false);
    }
  };

  const catList = Array.from(new Set([...(categories || []), fields.category].filter(Boolean)));

  return (
    <div>
      {/* Sticky action bar */}
      <div className="sticky top-16 z-20 -mx-4 mb-5 flex flex-wrap items-center gap-3 border-b border-gray-200 bg-gray-50/95 px-4 py-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
        <Link href={`${BASE}/posts`} className="grid h-9 w-9 place-items-center rounded-lg text-gray-500 hover:bg-gray-200 dark:hover:bg-zinc-800">
          <Icon name="chevron" className="h-5 w-5 rotate-180" />
        </Link>
        <div className="mr-auto">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-zinc-50">{mode === 'edit' ? 'Edit post' : 'New post'}</h1>
          <p className="flex items-center gap-1.5 text-xs text-gray-400">
            <Icon name="save" className="h-3.5 w-3.5" />
            {autosavedAt ? `Autosaved locally · ${autosavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Changes save locally as you type'}
          </p>
        </div>
        <Button variant="secondary" size="md" icon="save" onClick={() => save('draft')} disabled={saving}>Save Draft</Button>
        <Button variant="secondary" size="md" icon="eye" href={`/blog/${fields.slug || ''}`} target="_blank">Preview</Button>
        <Button variant="secondary" size="md" icon="calendar" onClick={() => save('scheduled')} disabled={saving}>Schedule</Button>
        <Button variant="primary" size="md" icon="check" onClick={() => save('published')} disabled={saving}>
          {saving ? 'Saving…' : 'Publish'}
        </Button>
      </div>

      {recovered && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
          <span className="flex items-center gap-2"><Icon name="info" className="h-4 w-4" /> You have unsaved local changes from a previous session.</span>
          <span className="flex gap-2">
            <Button size="sm" variant="primary" onClick={() => { setFields(recovered.fields); setSlugTouched(true); setRecovered(null); }}>Restore</Button>
            <Button size="sm" variant="ghost" onClick={() => { try { localStorage.removeItem(storageKey); } catch (e) {} setRecovered(null); }}>Discard</Button>
          </span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
        {/* Main column */}
        <div className="space-y-4">
          <input
            value={fields.title}
            onChange={(e) => update('title', e.target.value)}
            placeholder="Post title"
            className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 font-serif text-2xl font-semibold text-gray-900 outline-none placeholder:text-gray-300 focus:border-navy/40 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-50"
          />
          <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
            <span className="shrink-0 text-gray-400">{siteConfig.url.replace(/^https?:\/\//, '')}/blog/</span>
            <input
              value={fields.slug}
              onChange={(e) => { setSlugTouched(true); update('slug', slugify(e.target.value)); }}
              placeholder="post-url-slug"
              disabled={mode === 'edit'}
              className="min-w-0 flex-1 bg-transparent text-gray-700 outline-none disabled:opacity-60 dark:text-zinc-200"
            />
          </div>
          <textarea
            value={fields.excerpt}
            onChange={(e) => update('excerpt', e.target.value)}
            rows={2}
            placeholder="Optional subtitle / excerpt shown in cards and previews…"
            className={inputCls}
          />
          <MarkdownField
            value={fields.body}
            onChange={(v) => update('body', v)}
            imageKeyword={(fields.tags.split(',')[0] || '').trim() || fields.category || fields.title}
          />
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Publish */}
          <Section title="Publish" icon="upload">
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Status</label>
                <select value={fields.status} onChange={(e) => update('status', e.target.value)} className={inputCls}>
                  {STATUS_OPTIONS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Visibility</label>
                <select value={fields.visibility} onChange={(e) => update('visibility', e.target.value)} className={inputCls}>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
              <div>
                <label className={labelCls}>Publish date</label>
                <input type="date" value={fields.date} onChange={(e) => update('date', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Author</label>
                <input value={fields.author} onChange={(e) => update('author', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3 dark:bg-zinc-800/50">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Pre-publish checklist</p>
              <ul className="space-y-1">
                {checklist.map((c) => (
                  <li key={c.label} className="flex items-center gap-2 text-xs">
                    <span className={`grid h-4 w-4 place-items-center rounded-full ${c.ok ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'}`}>
                      <Icon name={c.ok ? 'check' : 'close'} className="h-2.5 w-2.5" />
                    </span>
                    <span className={c.ok ? 'text-gray-600 dark:text-zinc-300' : 'text-gray-500 dark:text-zinc-400'}>{c.label}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* Featured image */}
          <Section title="Featured image" icon="media">
            {fields.cover ? (
              <div className="space-y-2">
                <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-zinc-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={fields.cover} alt="Featured" className="h-32 w-full object-cover" />
                </div>
                <Button size="sm" variant="ghost" icon="trash" onClick={() => update('cover', '')}>Remove</Button>
              </div>
            ) : (
              <p className="mb-2 text-xs text-gray-500 dark:text-zinc-400">Paste an image URL (e.g. from the Media Library or Unsplash).</p>
            )}
            <input value={fields.cover} onChange={(e) => update('cover', e.target.value)} className={`${inputCls} mt-2`} placeholder="https://images.unsplash.com/…" />
          </Section>

          {/* Categories */}
          <Section title="Category" icon="categories">
            <input list="category-list" value={fields.category} onChange={(e) => update('category', e.target.value)} className={inputCls} placeholder="Select or type a new category" />
            <datalist id="category-list">
              {catList.map((c) => <option key={c} value={c} />)}
            </datalist>
          </Section>

          {/* Tags */}
          <Section title="Tags" icon="tags">
            <input value={fields.tags} onChange={(e) => update('tags', e.target.value)} className={inputCls} placeholder="comma, separated, tags" />
            <div className="mt-2 flex flex-wrap gap-1.5">
              {fields.tags.split(',').map((t) => t.trim()).filter(Boolean).map((t) => (
                <span key={t} className="rounded-full bg-clay-soft px-2 py-0.5 text-[11px] text-clay">{t}</span>
              ))}
            </div>
          </Section>

          {/* SEO */}
          <Section title="SEO" icon="seo" defaultOpen={false}>
            <SeoPanel fields={fields} update={seoUpdate} />
          </Section>

          {/* Social */}
          <Section title="Social sharing" icon="globe" defaultOpen={false}>
            <div className="space-y-3">
              <div>
                <label className={labelCls}>Open Graph title</label>
                <input value={fields.ogTitle} onChange={(e) => update('ogTitle', e.target.value)} className={inputCls} placeholder={fields.title} />
              </div>
              <div>
                <label className={labelCls}>Open Graph description</label>
                <textarea value={fields.ogDescription} onChange={(e) => update('ogDescription', e.target.value)} rows={2} className={inputCls} placeholder={fields.description} />
              </div>
              <div>
                <label className={labelCls}>Social image URL</label>
                <input value={fields.ogImage} onChange={(e) => update('ogImage', e.target.value)} className={inputCls} placeholder="Defaults to the featured image" />
              </div>
            </div>
          </Section>
        </div>
      </div>
    </div>
  );
}
