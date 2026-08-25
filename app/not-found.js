import Link from 'next/link';

export const metadata = {
  title: 'Page not found',
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-wrap flex-col items-center px-5 py-28 text-center sm:px-8">
      <p className="font-serif text-7xl font-semibold text-navy">404</p>
      <h1 className="mt-4 font-serif text-2xl font-semibold text-ink">
        This page took a wrong turn at the DMV.
      </h1>
      <p className="mt-3 max-w-md text-ink-soft">
        The page you’re after doesn’t exist, moved, or was never here. Happens to
        the best of us — let’s get you back on the road.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/"
          className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-cream-50 shadow-soft transition-colors hover:bg-navy-light"
        >
          Back home
        </Link>
        <Link
          href="/blog"
          className="rounded-full border border-cream-300 bg-cream-50 px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-navy/40"
        >
          Browse the blog
        </Link>
      </div>
    </div>
  );
}
