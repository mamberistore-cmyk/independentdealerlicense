import { siteConfig } from '@/lib/config';

export const metadata = {
  title: 'Terms of Use',
  description: 'The terms that govern your use of Independent Dealer License.',
  alternates: { canonical: '/terms' },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-16 sm:px-6">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">Terms of Use</h1>
      <p className="mt-3 text-sm text-ink-muted">Last updated: January 2, 2026</p>

      <div className="article-prose mt-8">
        <p>
          By accessing {siteConfig.name} at {siteConfig.url}, you agree to these
          terms. If you don’t agree, please don’t use the site.
        </p>

        <h2>Informational purpose only</h2>
        <p>
          All content on this site is provided for general informational purposes.
          It is not legal, financial, or professional advice, and it does not
          create any advisor–client relationship. Licensing rules vary by state
          and change frequently. Always verify current requirements with your
          state’s motor vehicle department before acting.
        </p>

        <h2>No guarantees</h2>
        <p>
          We work hard to keep articles accurate and current, but we make no
          warranty that the information is complete, correct, or up to date. You
          use this information at your own risk.
        </p>

        <h2>Intellectual property</h2>
        <p>
          The articles, design, and original graphics on this site are our
          property and are protected by copyright. You may share links and short
          quotations with attribution, but please don’t republish full articles
          without permission.
        </p>

        <h2>Third-party links and ads</h2>
        <p>
          We link to third-party resources and display advertising through Google
          AdSense. We aren’t responsible for the content, products, or practices of
          those third parties.
        </p>

        <h2>Limitation of liability</h2>
        <p>
          To the fullest extent permitted by law, {siteConfig.name} and its author
          will not be liable for any damages arising from your use of, or reliance
          on, the information on this site.
        </p>

        <h2>Changes</h2>
        <p>
          We may update these terms from time to time. Continued use of the site
          after changes means you accept the revised terms.
        </p>
      </div>
    </div>
  );
}
