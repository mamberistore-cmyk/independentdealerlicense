import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllTags, getPostsByTag } from '@/lib/posts';
import { slugify } from '@/lib/slug';
import { siteConfig } from '@/lib/config';
import PostCard from '@/components/PostCard';

export function generateStaticParams() {
  return getAllTags().map(({ tag }) => ({ tag: slugify(tag) }));
}

export function generateMetadata({ params }) {
  const match = getAllTags().find(({ tag }) => slugify(tag) === params.tag);
  const label = match ? match.tag : params.tag;
  return {
    title: `${label} — Articles`,
    description: `Every ${siteConfig.name} guide tagged “${label}.”`,
    alternates: { canonical: `${siteConfig.url}/tags/${params.tag}` },
  };
}

export default function TagPage({ params }) {
  const match = getAllTags().find(({ tag }) => slugify(tag) === params.tag);
  if (!match) notFound();

  const posts = getPostsByTag(match.tag);

  return (
    <div className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
      <nav className="mb-6 flex items-center gap-2 text-xs text-ink-muted">
        <Link href="/" className="hover:text-navy">Home</Link>
        <span aria-hidden="true">/</span>
        <Link href="/blog" className="hover:text-navy">Blog</Link>
        <span aria-hidden="true">/</span>
        <span className="text-ink">{match.tag}</span>
      </nav>

      <span className="eyebrow">Topic</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold capitalize tracking-tight text-ink">
        {match.tag}
      </h1>
      <p className="mt-3 text-ink-soft">
        {posts.length} article{posts.length === 1 ? '' : 's'} on this topic.
      </p>

      <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <PostCard key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
