import Image from 'next/image';
import Link from 'next/link';
import Tag from './Tag';

export default function PostCard({ post, featured = false }) {
  if (featured) {
    return (
      <article className="group grid overflow-hidden rounded-xl2 border border-cream-300/70 bg-cream-50 shadow-soft transition-shadow hover:shadow-lift md:grid-cols-2">
        <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden md:aspect-auto">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 768px) 100vw, 560px"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          <span className="absolute left-4 top-4 rounded-full bg-navy/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-cream-50">
            Featured
          </span>
        </Link>
        <div className="flex flex-col justify-center gap-4 p-7 sm:p-9">
          <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
            <time dateTime={post.date}>{post.dateLabel}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime} min read</span>
          </div>
          <h2 className="font-serif text-2xl font-semibold leading-snug text-ink sm:text-3xl">
            <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-navy">
              {post.title}
            </Link>
          </h2>
          <p className="text-[15px] leading-relaxed text-ink-soft">{post.description}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {post.tags.slice(0, 3).map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl2 border border-cream-300/70 bg-cream-50 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/blog/${post.slug}`} className="relative block aspect-[16/10] overflow-hidden">
        <Image
          src={post.cover}
          alt={post.title}
          fill
          sizes="(max-width: 768px) 100vw, 360px"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-6">
        <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
          <time dateTime={post.date}>{post.dateLabel}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h3 className="font-serif text-xl font-semibold leading-snug text-ink">
          <Link href={`/blog/${post.slug}`} className="transition-colors hover:text-navy">
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-3 text-sm leading-relaxed text-ink-soft">{post.description}</p>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 2).map((t) => (
              <Tag key={t} label={t} />
            ))}
          </div>
          <Link
            href={`/blog/${post.slug}`}
            className="inline-flex items-center gap-1 text-sm font-medium text-navy transition-colors hover:text-clay"
          >
            Read more
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
