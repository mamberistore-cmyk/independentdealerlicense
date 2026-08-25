import { getPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/config';
import BlogList from '@/components/BlogList';

export const metadata = {
  title: 'The Blog — Every Guide, One Place',
  description:
    'All of our plain-English guides to independent dealer licensing: costs, surety bonds, insurance, state-by-state rules, and the mistakes to skip.',
  alternates: { canonical: '/blog' },
  openGraph: {
    title: `The Blog · ${siteConfig.name}`,
    description:
      'Every guide to getting and keeping an independent used-car dealer license.',
    url: `${siteConfig.url}/blog`,
    type: 'website',
  },
};

export default function BlogPage() {
  const posts = getPosts();
  const tags = getAllTags();

  const breadcrumb = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: siteConfig.url },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${siteConfig.url}/blog` },
    ],
  };

  return (
    <div className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }}
      />
      <header className="mb-10 max-w-2xl">
        <span className="eyebrow">The archive</span>
        <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">
          Every guide, in one place
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-ink-soft">
          {posts.length} articles and counting. Use the search box if you’re
          hunting for something specific, or filter by topic below. No gatekeeping,
          no “premium tier” — it’s all here.
        </p>
      </header>

      <BlogList posts={posts} tags={tags} />
    </div>
  );
}
