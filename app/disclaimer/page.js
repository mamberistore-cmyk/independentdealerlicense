import { siteConfig } from '@/lib/config';

export const metadata = {
  title: 'Disclaimer',
  description:
    'Independent Dealer License provides general information, not legal or financial advice.',
  alternates: { canonical: '/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-16 sm:px-6">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">Disclaimer</h1>
      <p className="mt-3 text-sm text-ink-muted">Last updated: January 2, 2026</p>

      <div className="article-prose mt-8">
        <p>
          The information provided by {siteConfig.name} is for general
          informational and educational purposes only. All information is provided
          in good faith based on the author’s personal experience in vehicle
          licensing and the used-car business.
        </p>

        <h2>Not professional advice</h2>
        <p>
          Nothing on this site constitutes legal, tax, accounting, or financial
          advice. Dealer licensing laws, bond amounts, fees, and insurance
          requirements differ by state and can change without notice. Before making
          decisions, consult your state motor vehicle department and, where
          appropriate, a licensed attorney or accountant.
        </p>

        <h2>Accuracy</h2>
        <p>
          We make no representation or warranty of any kind regarding the accuracy,
          adequacy, or completeness of any information. Any reliance you place on
          this material is strictly at your own risk.
        </p>

        <h2>Affiliate and advertising disclosure</h2>
        <p>
          This site is monetized through Google AdSense display advertising and may
          occasionally include affiliate links. If you click certain links and make
          a purchase, we may earn a small commission at no extra cost to you. This
          never changes what we recommend.
        </p>

        <h2>External links</h2>
        <p>
          Our articles may contain links to external websites that are not provided
          or maintained by us. We do not guarantee the accuracy or completeness of
          any information on these external sites.
        </p>
      </div>
    </div>
  );
}
