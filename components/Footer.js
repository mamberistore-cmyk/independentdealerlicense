import Link from 'next/link';
import { siteConfig } from '@/lib/config';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-cream-300/70 bg-cream-50">
      <div className="mx-auto max-w-wrap px-5 py-14 sm:px-8">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <h3 className="font-serif text-lg font-semibold text-ink">
              {siteConfig.name}
            </h3>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-muted">
              Notes from someone who has stood on both sides of the licensing
              counter. No fluff, no upsells — just the paperwork, the costs, and
              the small mistakes that cost people big money.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Read
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/blog" className="text-ink-soft hover:text-navy">All articles</Link></li>
              <li><Link href="/about" className="text-ink-soft hover:text-navy">About</Link></li>
              <li><Link href="/contact" className="text-ink-soft hover:text-navy">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-muted">
              Legal
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/privacy-policy" className="text-ink-soft hover:text-navy">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-ink-soft hover:text-navy">Terms of Use</Link></li>
              <li><Link href="/disclaimer" className="text-ink-soft hover:text-navy">Disclaimer</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-cream-300/70 pt-6 text-xs text-ink-muted sm:flex-row sm:items-center sm:justify-between">
          <p>© {year} {siteConfig.name}. All rights reserved.</p>
          <p className="max-w-md leading-relaxed">
            This site is reader-supported and displays ads through Google
            AdSense. We may earn a commission when you act on our guidance. This
            is general information, not legal advice.
          </p>
        </div>
      </div>
    </footer>
  );
}
