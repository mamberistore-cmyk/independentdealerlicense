'use client';

import { useMemo, useState } from 'react';
import PostCard from './PostCard';

export default function BlogList({ posts, tags }) {
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return posts.filter((post) => {
      const matchesTag =
        active === 'All' ||
        post.tags.some((t) => t.toLowerCase() === active.toLowerCase());
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.description.toLowerCase().includes(q) ||
        post.tags.join(' ').toLowerCase().includes(q);
      return matchesTag && matchesQuery;
    });
  }, [posts, query, active]);

  const chips = ['All', ...tags.map((t) => t.tag)];

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-cream-300/70 pb-8">
        <div className="relative max-w-md">
          <svg
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted"
            width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true"
          >
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search guides — bonds, cost, Texas, mistakes…"
            aria-label="Search articles"
            className="w-full rounded-full border border-cream-300 bg-cream-50 py-3 pl-11 pr-4 text-sm text-ink shadow-soft outline-none transition-colors placeholder:text-ink-muted focus:border-navy/40"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {chips.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setActive(chip)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium capitalize transition-colors ${
                active === chip
                  ? 'bg-navy text-cream-50'
                  : 'border border-cream-300 bg-cream-50 text-ink-soft hover:border-navy/30'
              }`}
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="py-20 text-center text-ink-muted">
          Nothing matches that yet. Try a different word.
        </p>
      ) : (
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
