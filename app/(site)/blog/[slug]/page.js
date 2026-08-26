import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { siteConfig } from '@/lib/config';
import Avatar from '@/components/Avatar';
import Tag from '@/components/Tag';
import PostCard from '@/components/PostCard';
import AdUnit from '@/components/AdUnit';

// Pre-render every post at build time for maximum PageSpeed.
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { title: 'Not found' };

  const url = `${siteConfig.url}/blog/${post.slug}`;
  const canonical = post.canonical || url;
  const ogImage = post.ogImage || post.cover;
  return {
    title: post.seoTitle || post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      url,
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || post.description,
      publishedTime: post.date,
      authors: [siteConfig.author.name],
      tags: post.tags,
      images: [{ url: ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.ogTitle || post.seoTitle || post.title,
      description: post.ogDescription || post.description,
      images: [ogImage],
    },
  };
}

export default async function PostPage({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const related = getRelatedPosts(post.slug, post.tags, 3);
  const author = post.author ? { name: post.author, ...siteConfig.author } : siteConfig.author;
  const url = `${siteConfig.url}/blog/${post.slug}`;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: [post.cover],
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: siteConfig.author.name,
      url: siteConfig.author.url,
    },
    publisher: {
      '@type': 'Organization',
      name: siteConfig.name,
      logo: { '@type': 'ImageObject', url: `${siteConfig.url}/icon.svg` },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    keywords: post.tags.join(', '),
    wordCount: post.words,
  };

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: url },
    ],
  };

  return (
    <article className="pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      {/* Header block */}
      <header className="mx-auto max-w-prose px-5 pt-12 sm:px-6">
        <nav className="mb-6 flex items-center gap-2 text-xs text-ink-muted" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-navy">Home</Link>
          <span aria-hidden="true">/</span>
          <Link href="/blog" className="hover:text-navy">Blog</Link>
        </nav>

        <div className="flex flex-wrap gap-2">
          {post.tags.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>

        <h1 className="mt-5 font-serif text-3xl font-semibold leading-[1.14] tracking-tight text-ink sm:text-[2.6rem]">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b border-cream-300/70 pb-6">
          <Avatar showMeta meta={`${post.dateLabel} · ${post.readingTime} min read`} />
        </div>
      </header>

      {/* Cover */}
      <div className="mx-auto mt-8 max-w-4xl px-5 sm:px-6">
        <div className="relative aspect-[16/8] overflow-hidden rounded-xl2 shadow-soft">
          <Image
            src={post.cover}
            alt={post.title}
            fill
            sizes="(max-width: 896px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto max-w-prose px-5 py-12 sm:px-6">
        <div className="article-prose" dangerouslySetInnerHTML={{ __html: html }} />

        <AdUnit slot="2222222222" label="Sponsored" />

        {/* Author card */}
        <div className="mt-12 rounded-xl2 border border-cream-300/70 bg-cream-50 p-6 shadow-soft sm:p-8">
          <div className="flex items-start gap-4">
            <Avatar size={56} />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-clay">
                Written by
              </p>
              <h3 className="mt-1 font-serif text-lg font-semibold text-ink">
                {siteConfig.author.name}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {siteConfig.author.bio}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-full border border-cream-300 bg-cream-50 px-5 py-2.5 text-sm font-medium text-ink transition-colors hover:border-navy/40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M19 12H5M11 18l-6-6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to all articles
          </Link>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-wrap border-t border-cream-300/70 px-5 py-14 sm:px-8">
          <span className="eyebrow">Keep going</span>
          <h2 className="mt-2 font-serif text-2xl font-semibold text-ink">Related reading</h2>
          <div className="mt-8 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <PostCard key={p.slug} post={p} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
