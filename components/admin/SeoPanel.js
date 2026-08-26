'use client';

import { useMemo } from 'react';
import { scoreSeo } from '@/lib/seoScore';
import { siteConfig } from '@/lib/config';
import Icon from './Icon';

function ScoreRing({ score }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const dash = (score / 100) * c;
  const color = score >= 80 ? '#059669' : score >= 60 ? '#0284c7' : score >= 40 ? '#d97706' : '#dc2626';
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16">
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="stroke-gray-200 dark:stroke-zinc-700" />
      <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" stroke={color} strokeLinecap="round" strokeDasharray={`${dash} ${c}`} transform="rotate(-90 32 32)" />
      <text x="32" y="37" textAnchor="middle" className="fill-gray-900 text-[15px] font-semibold dark:fill-zinc-100">{score}</text>
    </svg>
  );
}

const inputCls =
  'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200';
const labelCls = 'mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400';

export default function SeoPanel({ fields, update }) {
  const result = useMemo(
    () =>
      scoreSeo({
        title: fields.title,
        seoTitle: fields.seoTitle,
        description: fields.description,
        slug: fields.slug,
        focusKeyword: fields.focusKeyword,
        body: fields.body,
        cover: fields.cover,
      }),
    [fields]
  );

  const previewTitle = fields.seoTitle || fields.title || 'Your post title';
  const previewUrl = `${siteConfig.url.replace(/^https?:\/\//, '')}/blog/${fields.slug || 'post-url'}`;
  const previewDesc = fields.description || 'Your meta description shows up right here in Google results — keep it between 120 and 160 characters.';

  return (
    <div className="space-y-4">
      {/* Score */}
      <div className="flex items-center gap-4 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-zinc-800 dark:bg-zinc-900/60">
        <ScoreRing score={result.score} />
        <div>
          <p className="text-sm font-semibold text-gray-900 dark:text-zinc-100">SEO Score: {result.score}/100</p>
          <p className="text-xs text-gray-500 dark:text-zinc-400">{result.label}</p>
        </div>
      </div>

      {/* Google preview */}
      <div className="rounded-lg border border-gray-200 p-3 dark:border-zinc-800">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Search preview</p>
        <p className="truncate text-[13px] text-gray-500 dark:text-zinc-400">{previewUrl}</p>
        <p className="truncate text-[16px] text-[#1a0dab] dark:text-sky-400">{previewTitle}</p>
        <p className="line-clamp-2 text-[12px] text-gray-600 dark:text-zinc-400">{previewDesc}</p>
      </div>

      {/* Inputs */}
      <div>
        <label className={labelCls}>SEO title</label>
        <input value={fields.seoTitle} onChange={(e) => update('seoTitle', e.target.value)} className={inputCls} placeholder={fields.title || 'Custom title for search engines'} />
        <p className="mt-1 text-[11px] text-gray-400">{(fields.seoTitle || fields.title || '').length} / 60 characters</p>
      </div>
      <div>
        <label className={labelCls}>Meta description</label>
        <textarea value={fields.description} onChange={(e) => update('description', e.target.value)} rows={3} className={inputCls} placeholder="120–160 characters that sell the click." />
        <p className="mt-1 text-[11px] text-gray-400">{(fields.description || '').length} / 160 characters</p>
      </div>
      <div>
        <label className={labelCls}>Focus keyword</label>
        <input value={fields.focusKeyword} onChange={(e) => update('focusKeyword', e.target.value)} className={inputCls} placeholder="e.g. dealer license cost" />
      </div>
      <div>
        <label className={labelCls}>URL slug</label>
        <input value={fields.slug} onChange={(e) => update('slug', e.target.value)} className={inputCls} placeholder="post-url-slug" />
      </div>
      <div>
        <label className={labelCls}>Canonical URL (optional)</label>
        <input value={fields.canonical} onChange={(e) => update('canonical', e.target.value)} className={inputCls} placeholder="Leave blank to use the default" />
      </div>

      {/* Checklist */}
      <div className="rounded-lg border border-gray-200 p-3 dark:border-zinc-800">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-gray-400">Analysis</p>
        <ul className="space-y-1.5">
          {result.checks.map((c) => (
            <li key={c.label} className="flex items-start gap-2 text-xs">
              <span className={`mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full ${c.ok ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-gray-200 text-gray-400 dark:bg-zinc-700 dark:text-zinc-500'}`}>
                <Icon name={c.ok ? 'check' : 'close'} className="h-2.5 w-2.5" />
              </span>
              <span className={c.ok ? 'text-gray-600 dark:text-zinc-300' : 'text-gray-500 dark:text-zinc-400'}>
                {c.label}
                {!c.ok && c.hint && <span className="block text-[11px] text-gray-400">{c.hint}</span>}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
