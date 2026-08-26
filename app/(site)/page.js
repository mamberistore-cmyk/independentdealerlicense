import Link from 'next/link';
import { getPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import PostCard from '@/components/PostCard';
import Avatar from '@/components/Avatar';
import Tag from '@/components/Tag';
import AdUnit from '@/components/AdUnit';

export const metadata = {
  title: 'Independent Dealer License — Getting Licensed Without the Runaround',
  description: siteConfig.description,
  alternates: { canonical: '/' },
};

export default function HomePage() {
  const posts = getPosts();
  const featured = posts[0];
  const recent = posts.slice(1, 7);
  const tags = getAllTags().slice(0, 10);

  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-wrap px-5 pb-6 pt-14 sm:px-8 sm:pt-20">
          <div className="grid items-center gap-12 md:grid-cols-[1.25fr_0.9fr]">
            <div className="animate-fade-up">
              <span className="eyebrow">Field notes, not a sales pitch</span>
              <h1 className="mt-5 font-serif text-4xl font-semibold leading-[1.08] tracking-tight text-ink sm:text-5xl">
                The dealer license guide I{' '}
                <span className="relative whitespace-nowrap text-navy">
                  wish someone
                  <svg
                    className="absolute -bottom-2 left-0 w-full text-clay"
                    viewBox="0 0 300 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path d="M2 9C60 3 130 3 298 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                had handed me.
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-relaxed text-ink-soft">
                I spent nine years stamping applications at a state licensing
                office, then opened my own small lot. This is everything I learned
                on both sides of the counter — the bonds, the fees, the inspections,
                and the paperwork nobody warns you about.
              </p>
              <div className="mt-9 flex flex-wrap items-center gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition-all hover:bg-navy-light hover:shadow-lift"
                >
                  Start reading
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link
                  href="/blog/how-to-get-a-dealer-license-step-by-step"
                  className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-navy/40"
                >
                  The step-by-step walkthrough
                </Link>
              </div>

              <div className="mt-10 flex items-center gap-4">
                <Avatar showMeta meta="Writes every guide himself" />
              </div>
            </div>

            {/* Small "what you'll learn" card to break the AI-template feel */}
            <aside className="animate-fade-up rounded-xl2 border border-cream-300/70 bg-cream-50 p-7 shadow-soft [animation-delay:120ms]">
              <h2 className="font-serif text-lg font-semibold text-ink">
                What this blog actually covers
              </h2>
              <ul className="mt-5 space-y-4 text-sm text-ink-soft">
                {[
                  ['The real cost', 'Every fee, bond, and hidden line item — added up honestly.'],
                  ['State by state', 'Because Texas and California barely speak the same language.'],
                  ['Surety & insurance', 'What you legally need vs. what a salesman will upsell you.'],
                  ['Rookie mistakes', 'The four that cost me money so they don’t cost you.'],
                ].map(([title, body]) => (
                  <li key={title} className="flex gap-3">
                    <span className="mt-1 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-clay-soft text-clay">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                        <path d="M20 6L9 17l-5-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span>
                      <strong className="font-semibold text-ink">{title}. </strong>
                      {body}
                    </span>
                  </li>
                ))}
              </ul>
            </aside>
          </div>
        </div>
      </section>

      {/* ── Featured ────────────────────────────────────────── */}
      {featured && (
        <section className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
          <div className="mb-7 flex items-end justify-between">
            <div>
              <span className="eyebrow">Start here</span>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">The one to read first</h2>
            </div>
            <Link href="/blog" className="hidden text-sm font-medium text-navy hover:text-clay sm:inline">
              All articles →
            </Link>
          </div>
          <PostCard post={featured} featured />
        </section>
      )}

      <div className="mx-auto max-w-wrap px-5 sm:px-8">
        <AdUnit slot="1111111111" />
      </div>

      {/* ── Recent grid ─────────────────────────────────────── */}
      <section className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <span className="eyebrow">Fresh off the desk</span>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">Latest guides</h2>
          </div>
        </div>
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {recent.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      </section>

      {/* ── Topics ──────────────────────────────────────────── */}
      {tags.length > 0 && (
        <section className="mx-auto max-w-wrap px-5 py-10 sm:px-8">
          <div className="rounded-xl2 border border-cream-300/70 bg-gradient-to-br from-cream-50 to-cream-100 p-8 shadow-soft sm:p-10">
            <span className="eyebrow">Browse by topic</span>
            <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">
              Pick a thread and pull
            </h2>
            <div className="mt-6 flex flex-wrap gap-3">
              {tags.map(({ tag, count }) => (
                <Tag key={tag} label={`${tag} (${count})`} size="lg" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Closing note ───────────────────────────────────── */}
      <section className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
        <div className="rounded-xl2 bg-navy px-8 py-12 text-cream-50 shadow-lift sm:px-12">
          <div className="max-w-2xl">
            <h2 className="font-serif text-2xl font-semibold sm:text-3xl">
              No newsletter yet. Just good notes.
            </h2>
            <p className="mt-4 text-cream-200/90">
              I don’t sell a course, and I’m not going to ask for your email so I can
              pester you later. Bookmark the blog, come back when you hit the part of
              the process that’s driving you up the wall, and I’ll probably have
              written about it.
            </p>
            <Link
              href="/blog"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-cream-50 px-6 py-3 text-sm font-semibold text-navy transition-transform hover:-translate-y-0.5"
            >
              Read the archive
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
