'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const today = () => new Date().toISOString().slice(0, 10);

const starterBody = `Open with a real hook — a story, a number, a mistake you made.

## A section heading

Write like you talk. Short paragraphs. A concrete example beats an adjective.

- A practical point
- Another one
- The thing nobody tells you

> Drop in a quote or a warning box when it earns the space.

Wrap up with the single most useful takeaway.`;

export default function DashboardClient({ githubReady, deployHook }) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: today(),
    tags: '',
    body: starterBody,
  });
  const [preview, setPreview] = useState('');
  const [previewing, setPreviewing] = useState(false);
  const [status, setStatus] = useState(null); // {type, message, slug}
  const [publishing, setPublishing] = useState(false);

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const doPreview = async () => {
    setPreviewing(true);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: form.body }),
      });
      const data = await res.json();
      setPreview(data.html || '');
    } catch (e) {
      setPreview('<p>Preview failed.</p>');
    } finally {
      setPreviewing(false);
    }
  };

  const publish = async (e) => {
    e.preventDefault();
    setStatus(null);
    setPublishing(true);
    try {
      const res = await fetch('/api/create-post', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Published! Rebuilding the site now.', slug: data.slug });
        setForm((f) => ({ ...f, title: '', description: '', tags: '', body: starterBody }));
        setPreview('');
      } else {
        setStatus({ type: 'error', message: data.error || 'Publish failed.' });
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Network error while publishing.' });
    } finally {
      setPublishing(false);
    }
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.replace('/admin');
    router.refresh();
  };

  const field =
    'w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm text-ink shadow-soft outline-none transition-colors placeholder:text-ink-muted focus:border-navy/40';

  return (
    <div className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="eyebrow">Editor</span>
          <h1 className="mt-2 font-serif text-3xl font-semibold text-ink">New post</h1>
        </div>
        <button
          onClick={logout}
          className="rounded-full border border-cream-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-clay/50 hover:text-clay"
        >
          Log out
        </button>
      </div>

      {!githubReady && (
        <div className="mb-6 rounded-xl border border-clay-light/50 bg-clay-soft px-4 py-3 text-sm text-clay">
          GitHub isn’t configured yet. Add <code>GITHUB_TOKEN</code>, <code>GITHUB_OWNER</code>,
          and <code>GITHUB_REPO</code> to your environment variables before publishing.
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        {/* Form */}
        <form onSubmit={publish} className="space-y-5 rounded-xl2 border border-cream-300/70 bg-cream-50 p-6 shadow-soft sm:p-8">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">Title</label>
            <input id="title" required value={form.title} onChange={update('title')} className={field} placeholder="How to Get a Dealer License – Step-by-Step" />
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">
              Description <span className="font-normal text-ink-muted">(SEO meta, ~150 chars)</span>
            </label>
            <textarea id="description" rows={2} value={form.description} onChange={update('description')} className={field} placeholder="A short, specific summary that shows up in Google." />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="date" className="mb-1.5 block text-sm font-medium text-ink">Date</label>
              <input id="date" type="date" value={form.date} onChange={update('date')} className={field} />
            </div>
            <div>
              <label htmlFor="tags" className="mb-1.5 block text-sm font-medium text-ink">
                Tags <span className="font-normal text-ink-muted">(comma-separated)</span>
              </label>
              <input id="tags" value={form.tags} onChange={update('tags')} className={field} placeholder="cost, surety bond, beginners" />
            </div>
          </div>

          <div>
            <label htmlFor="body" className="mb-1.5 block text-sm font-medium text-ink">Body (Markdown)</label>
            <textarea id="body" required rows={18} value={form.body} onChange={update('body')} className={`${field} font-mono text-[13px] leading-relaxed`} />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={publishing || !githubReady}
              className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
            >
              {publishing ? 'Publishing…' : 'Publish'}
            </button>
            <button
              type="button"
              onClick={doPreview}
              disabled={previewing}
              className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-navy/40"
            >
              {previewing ? 'Rendering…' : 'Preview'}
            </button>
          </div>

          {status && (
            <div
              className={`rounded-xl px-4 py-3 text-sm ${
                status.type === 'success'
                  ? 'bg-green-50 text-green-800'
                  : 'bg-clay-soft text-clay'
              }`}
            >
              {status.message}
              {status.slug && (
                <>
                  {' '}
                  <a href={`/blog/${status.slug}`} className="font-semibold underline" target="_blank" rel="noreferrer">
                    View post →
                  </a>
                </>
              )}
            </div>
          )}
        </form>

        {/* Preview */}
        <aside className="rounded-xl2 border border-cream-300/70 bg-cream-50 p-6 shadow-soft sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">Live preview</p>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
            {form.title || 'Your title appears here'}
          </h2>
          {form.description && (
            <p className="mt-2 text-sm text-ink-muted">{form.description}</p>
          )}
          <div className="my-4 h-px bg-cream-300" />
          {preview ? (
            <div className="article-prose text-[16px]" dangerouslySetInnerHTML={{ __html: preview }} />
          ) : (
            <p className="text-sm text-ink-muted">
              Hit <strong>Preview</strong> to render your Markdown exactly as it’ll
              publish.
            </p>
          )}
        </aside>
      </div>
    </div>
  );
}
