'use client';

import { useRef, useState } from 'react';
import Icon from './Icon';
import { useToast } from './Toast';
import { tidyText } from '@/lib/tidyText';
import { distributeImages } from '@/lib/insertImages';

const tools = [
  { key: 'bold', label: 'Bold', icon: 'B', wrap: ['**', '**'], text: 'bold text' },
  { key: 'italic', label: 'Italic', icon: 'I', wrap: ['*', '*'], text: 'italic text' },
  { key: 'h2', label: 'Heading 2', icon: 'H2', line: '## ', text: 'Section heading' },
  { key: 'h3', label: 'Heading 3', icon: 'H3', line: '### ', text: 'Subheading' },
  { key: 'link', label: 'Link', icon: 'link', custom: 'link' },
  { key: 'quote', label: 'Quote', icon: 'comments', line: '> ', text: 'A memorable quote' },
  { key: 'ul', label: 'Bullet list', icon: 'list', line: '- ', text: 'List item' },
  { key: 'ol', label: 'Numbered list', icon: 'posts', line: '1. ', text: 'List item' },
  { key: 'code', label: 'Code block', icon: 'edit', block: '```\n', blockEnd: '\n```', text: 'code' },
  { key: 'image', label: 'Image', icon: 'media', custom: 'image' },
  { key: 'table', label: 'Table', icon: 'grid', insert: '\n| Column | Column |\n| --- | --- |\n| Cell | Cell |\n' },
  { key: 'hr', label: 'Divider', icon: 'redirects', insert: '\n---\n' },
];

export default function MarkdownField({ value, onChange, minRows = 18, imageKeyword = '' }) {
  const ref = useRef(null);
  const { notify } = useToast();
  const [tab, setTab] = useState('write');
  const [preview, setPreview] = useState('');
  const [loadingPreview, setLoadingPreview] = useState(false);
  const [autoTidy, setAutoTidy] = useState(true);
  const [imgOpen, setImgOpen] = useState(false);
  const [imgCount, setImgCount] = useState(3);
  const [imgQuery, setImgQuery] = useState('');
  const [imgLoading, setImgLoading] = useState(false);

  // Fetch N relevant photos from Unsplash and auto-distribute them in the body.
  const insertImages = async () => {
    const query = (imgQuery || imageKeyword || 'business').trim();
    setImgLoading(true);
    try {
      const res = await fetch(`/api/unsplash?query=${encodeURIComponent(query)}&count=${imgCount}`);
      const data = await res.json();
      if (!res.ok) {
        notify(
          data.configured === false
            ? 'Add UNSPLASH_ACCESS_KEY in your env to enable auto-images.'
            : data.error || 'Could not fetch images.',
          'error',
          4000
        );
        return;
      }
      if (!data.photos?.length) {
        notify('No images found for that keyword.', 'info');
        return;
      }
      onChange(distributeImages(value, data.photos));
      notify(`${data.photos.length} image${data.photos.length === 1 ? '' : 's'} added & distributed`, 'success');
      setImgOpen(false);
    } catch (e) {
      notify('Network error fetching images.', 'error');
    } finally {
      setImgLoading(false);
    }
  };

  // When pasting, clean up the LAYOUT of the pasted text (broken lines,
  // stray spaces) but keep every word — then insert it at the cursor.
  const onPaste = (e) => {
    if (!autoTidy) return;
    const text = e.clipboardData?.getData('text/plain');
    if (!text || !text.includes('\n')) return; // single line: nothing to reflow
    e.preventDefault();
    const ta = ref.current;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const cleaned = tidyText(text);
    const next = value.slice(0, start) + cleaned + value.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = start + cleaned.length;
      ta.setSelectionRange(pos, pos);
    });
    notify('Pasted text tidied — your words are unchanged', 'success', 2200);
  };

  // Tidy the whole document on demand.
  const tidyAll = () => {
    const cleaned = tidyText(value);
    if (cleaned === value.trim()) {
      notify('Already tidy 👍', 'info', 1800);
      return;
    }
    onChange(cleaned);
    notify('Formatting tidied — words untouched', 'success');
  };

  const apply = (tool) => {
    const ta = ref.current;
    if (!ta) return;
    const start = ta.selectionStart;
    const end = ta.selectionEnd;
    const val = value;
    const sel = val.slice(start, end);
    let insert;
    let cursorOffset = null;

    if (tool.custom === 'link') {
      const label = sel || 'link text';
      insert = `[${label}](https://)`;
      cursorOffset = start + insert.length - 1;
    } else if (tool.custom === 'image') {
      insert = `![${sel || 'alt text'}](https://images.unsplash.com/...)`;
    } else if (tool.wrap) {
      insert = `${tool.wrap[0]}${sel || tool.text}${tool.wrap[1]}`;
    } else if (tool.line) {
      const text = sel || tool.text;
      insert = text.split('\n').map((l) => `${tool.line}${l}`).join('\n');
    } else if (tool.block) {
      insert = `${tool.block}${sel || tool.text}${tool.blockEnd}`;
    } else if (tool.insert) {
      insert = tool.insert;
    }

    const next = val.slice(0, start) + insert + val.slice(end);
    onChange(next);
    requestAnimationFrame(() => {
      ta.focus();
      const pos = cursorOffset ?? start + insert.length;
      ta.setSelectionRange(pos, pos);
    });
  };

  const runPreview = async () => {
    setTab('preview');
    setLoadingPreview(true);
    try {
      const res = await fetch('/api/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: value }),
      });
      const data = await res.json();
      setPreview(data.html || '');
    } catch (e) {
      setPreview('<p>Preview failed.</p>');
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-center gap-1 border-b border-gray-200 bg-gray-50 px-2 py-1.5 dark:border-zinc-800 dark:bg-zinc-900/60">
        {tools.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => apply(t)}
            title={t.label}
            className="grid h-8 min-w-8 place-items-center rounded-md px-1.5 text-xs font-semibold text-gray-600 hover:bg-white hover:text-navy dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            {t.icon.length <= 2 ? t.icon : <Icon name={t.icon} className="h-4 w-4" />}
          </button>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <button
            type="button"
            onClick={() => { setImgQuery((q) => q || imageKeyword); setImgOpen((v) => !v); }}
            title="Auto-insert relevant images, distributed through the post"
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold ${imgOpen ? 'bg-white text-navy dark:bg-zinc-700 dark:text-white' : 'text-gray-600 hover:bg-white hover:text-navy dark:text-zinc-300 dark:hover:bg-zinc-700'}`}
          >
            🖼 Images
          </button>
          <button
            type="button"
            onClick={tidyAll}
            title="Fix layout & spacing, auto-detect H2 headings — never changes your words"
            className="flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-gray-600 hover:bg-white hover:text-navy dark:text-zinc-300 dark:hover:bg-zinc-700"
          >
            ✨ Tidy
          </button>
          <button
            type="button"
            onClick={() => setAutoTidy((v) => !v)}
            title="Automatically tidy text you paste (layout only)"
            className={`hidden rounded-md px-2 py-1 text-[11px] font-medium sm:block ${autoTidy ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300' : 'text-gray-400 dark:text-zinc-500'}`}
          >
            Auto-tidy paste: {autoTidy ? 'On' : 'Off'}
          </button>
          <div className="flex rounded-lg bg-gray-200/70 p-0.5 dark:bg-zinc-800">
            <button type="button" onClick={() => setTab('write')} className={`rounded-md px-3 py-1 text-xs font-medium ${tab === 'write' ? 'bg-white text-navy shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-gray-500 dark:text-zinc-400'}`}>Write</button>
            <button type="button" onClick={runPreview} className={`rounded-md px-3 py-1 text-xs font-medium ${tab === 'preview' ? 'bg-white text-navy shadow-sm dark:bg-zinc-700 dark:text-white' : 'text-gray-500 dark:text-zinc-400'}`}>Preview</button>
          </div>
        </div>
      </div>

      {imgOpen && (
        <div className="flex flex-wrap items-end gap-3 border-b border-gray-200 bg-gray-50 px-3 py-3 dark:border-zinc-800 dark:bg-zinc-900/60">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-zinc-400">How many</label>
            <select value={imgCount} onChange={(e) => setImgCount(Number(e.target.value))} className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              {[1, 2, 3, 4, 5, 6].map((n) => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div className="min-w-[180px] flex-1">
            <label className="mb-1 block text-[11px] font-medium text-gray-500 dark:text-zinc-400">Keyword / topic</label>
            <input value={imgQuery} onChange={(e) => setImgQuery(e.target.value)} placeholder={imageKeyword || 'e.g. used car dealership'} className="w-full rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200" />
          </div>
          <button
            type="button"
            onClick={insertImages}
            disabled={imgLoading}
            className="rounded-lg bg-navy px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-light disabled:opacity-60"
          >
            {imgLoading ? 'Fetching…' : 'Insert & distribute'}
          </button>
          <p className="w-full text-[11px] text-gray-400">Images from Unsplash are placed evenly through the post, right after section headings where possible. Each keeps its photographer credit.</p>
        </div>
      )}

      {tab === 'write' ? (
        <textarea
          ref={ref}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onPaste={onPaste}
          rows={minRows}
          spellCheck
          className="block w-full resize-y bg-transparent px-4 py-4 font-mono text-[13.5px] leading-relaxed text-gray-800 outline-none dark:text-zinc-200"
          placeholder="Write your post in Markdown…"
        />
      ) : (
        <div className="min-h-[320px] px-5 py-5">
          {loadingPreview ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-4 rounded shimmer" />)}
            </div>
          ) : (
            <div className="article-prose max-w-none text-[16px]" dangerouslySetInnerHTML={{ __html: preview || '<p class="text-gray-400">Nothing to preview yet.</p>' }} />
          )}
        </div>
      )}
    </div>
  );
}
