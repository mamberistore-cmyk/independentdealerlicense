'use client';

import { useMemo } from 'react';
import { usePosts } from './usePosts';
import { Card, Button } from './ui';
import Icon from './Icon';
import { siteConfig } from '@/lib/config';

// Tunable targets for what "AdSense-ready" means for this site.
const MIN_POSTS = 10;
const MIN_AVG_WORDS = 600;

function evaluate(posts) {
  const published = posts.filter((p) => p.status === 'published');
  const n = published.length;
  const avgWords = n ? Math.round(published.reduce((s, p) => s + (p.words || 0), 0) / n) : 0;
  const withDesc = published.filter((p) => p.description && p.description.length >= 50).length;
  const withCover = published.filter((p) => p.cover).length;
  const url = siteConfig.url || '';
  const customDomain = Boolean(url) && !url.includes('vercel.app') && !url.includes('XXXX');
  const adsenseReal = siteConfig.adsenseClient && !siteConfig.adsenseClient.includes('XXXX');

  const checks = [
    {
      group: 'Content',
      label: `At least ${MIN_POSTS} published posts`,
      weight: 25,
      done: n >= MIN_POSTS,
      detail: `${n} / ${MIN_POSTS} published`,
      fix: 'Write more original articles — this is the #1 reason sites get rejected.',
    },
    {
      group: 'Content',
      label: `Substantial articles (avg ≥ ${MIN_AVG_WORDS} words)`,
      weight: 10,
      done: n > 0 && avgWords >= MIN_AVG_WORDS,
      detail: n ? `${avgWords} words avg` : 'no posts yet',
      fix: 'Aim for in-depth posts, not thin pages.',
    },
    {
      group: 'Content',
      label: 'Every post has a meta description',
      weight: 10,
      done: n > 0 && withDesc === n,
      detail: `${withDesc} / ${n} posts`,
      fix: 'Fill the SEO → Meta description field in the editor.',
    },
    {
      group: 'Content',
      label: 'Every post has a featured image',
      weight: 8,
      done: n > 0 && withCover === n,
      detail: `${withCover} / ${n} posts`,
      fix: 'Add a featured image URL to each post.',
    },
    {
      group: 'Required pages',
      label: 'Privacy Policy page',
      weight: 8,
      done: true,
      detail: '/privacy-policy',
      link: '/privacy-policy',
    },
    { group: 'Required pages', label: 'About page', weight: 6, done: true, detail: '/about', link: '/about' },
    { group: 'Required pages', label: 'Contact page', weight: 6, done: true, detail: '/contact', link: '/contact' },
    { group: 'Required pages', label: 'Terms & Disclaimer', weight: 5, done: true, detail: '/terms · /disclaimer', link: '/terms' },
    {
      group: 'Technical',
      label: 'Custom domain (not a *.vercel.app URL)',
      weight: 10,
      done: customDomain,
      detail: url.replace(/^https?:\/\//, '') || 'not set',
      fix: 'Connect a real domain and set NEXT_PUBLIC_SITE_URL.',
    },
    {
      group: 'Technical',
      label: 'AdSense publisher ID configured',
      weight: 12,
      done: adsenseReal,
      detail: adsenseReal ? siteConfig.adsenseClient : 'placeholder (ca-pub-XXXX)',
      fix: 'After signing up, set NEXT_PUBLIC_ADSENSE_CLIENT to your ca-pub-… ID.',
    },
  ];

  const earned = checks.filter((c) => c.done).reduce((s, c) => s + c.weight, 0);
  const percent = Math.round(earned);
  return { checks, percent, n };
}

function statusMeta(percent) {
  if (percent >= 100) return { label: 'Ready to apply', color: '#059669', tone: 'ready' };
  if (percent >= 75) return { label: 'Almost there', color: '#0284c7', tone: 'close' };
  if (percent >= 40) return { label: 'Getting there', color: '#d97706', tone: 'mid' };
  return { label: 'Not ready yet', color: '#dc2626', tone: 'low' };
}

export default function AdsenseReadiness() {
  const { posts, loading } = usePosts();
  const { checks, percent } = useMemo(() => evaluate(posts), [posts]);
  const status = statusMeta(percent);
  const groups = ['Content', 'Required pages', 'Technical'];

  if (loading) {
    return <div className="h-64 rounded-xl shimmer" />;
  }

  return (
    <div className="space-y-5">
      {/* Overall progress */}
      <Card className="p-6">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <div className="relative grid h-24 w-24 place-items-center">
              <svg viewBox="0 0 100 100" className="h-24 w-24 -rotate-90">
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" className="stroke-gray-200 dark:stroke-zinc-800" />
                <circle cx="50" cy="50" r="42" fill="none" strokeWidth="9" stroke={status.color} strokeLinecap="round"
                  strokeDasharray={`${(percent / 100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`} />
              </svg>
              <span className="absolute text-xl font-bold text-gray-900 dark:text-zinc-50">{percent}%</span>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">AdSense readiness</p>
              <p className="text-lg font-semibold" style={{ color: status.color }}>{status.label}</p>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-zinc-400">
                {percent >= 100 ? 'All checks passed — you can apply now.' : 'Complete the red items below to reach 100%.'}
              </p>
            </div>
          </div>

          <div className="sm:ml-auto">
            <Button
              href="https://www.google.com/adsense/start/"
              target="_blank"
              variant={percent >= 100 ? 'primary' : 'secondary'}
              icon="external"
            >
              {percent >= 100 ? 'Apply to AdSense' : 'Open AdSense'}
            </Button>
            {percent < 100 && (
              <p className="mt-2 max-w-[200px] text-xs text-gray-400">Finish the checklist first for the best chance of approval.</p>
            )}
          </div>
        </div>
      </Card>

      {/* Checklist by group */}
      {groups.map((g) => {
        const items = checks.filter((c) => c.group === g);
        const gd = items.filter((c) => c.done).length;
        return (
          <Card key={g} className="overflow-hidden">
            <div className="flex items-center justify-between border-b border-gray-200 px-5 py-3 dark:border-zinc-800">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-zinc-50">{g}</h3>
              <span className="text-xs text-gray-400">{gd}/{items.length} done</span>
            </div>
            <ul className="divide-y divide-gray-100 dark:divide-zinc-800">
              {items.map((c) => (
                <li key={c.label} className="flex items-start gap-3 px-5 py-3.5">
                  <span className={`mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full ${c.done ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400' : 'bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400'}`}>
                    <Icon name={c.done ? 'check' : 'close'} className="h-3 w-3" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium ${c.done ? 'text-gray-800 dark:text-zinc-200' : 'text-gray-900 dark:text-zinc-100'}`}>{c.label}</p>
                    {!c.done && c.fix && <p className="mt-0.5 text-xs text-red-500 dark:text-red-400">{c.fix}</p>}
                  </div>
                  <span className="shrink-0 text-xs text-gray-400">{c.detail}</span>
                </li>
              ))}
            </ul>
          </Card>
        );
      })}
    </div>
  );
}
