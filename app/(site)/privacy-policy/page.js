import { siteConfig } from '@/lib/config';

export const metadata = {
  title: 'Privacy Policy',
  description:
    'How Independent Dealer License handles data, cookies, and third-party advertising through Google AdSense.',
  alternates: { canonical: '/privacy-policy' },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-prose px-5 py-16 sm:px-6">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-ink">Privacy Policy</h1>
      <p className="mt-3 text-sm text-ink-muted">Last updated: January 2, 2026</p>

      <div className="article-prose mt-8">
        <p>
          This Privacy Policy explains what information {siteConfig.name} (“we,”
          “us”) collects when you visit {siteConfig.url}, how we use it, and the
          choices you have. We’ve tried to write it in plain English.
        </p>

        <h2>Information we collect</h2>
        <p>
          We do not ask you to create an account, and we do not run a newsletter,
          so we don’t collect names or email addresses unless you choose to email
          us directly through the contact page (which opens your own email client).
          Like most websites, our hosting provider automatically logs standard
          technical data such as your IP address, browser type, and the pages you
          visit. This is used for security and aggregate analytics only.
        </p>
        <p>
          We use <strong>Google Analytics</strong> to understand how visitors use
          the site. Google Analytics sets cookies and collects anonymized usage
          data (such as pages viewed and approximate location) on our behalf. You
          can opt out with the{' '}
          <a href="https://tools.google.com/dlpage/gaoptout" rel="nofollow noopener" target="_blank">
            Google Analytics Opt-out Browser Add-on
          </a>.
        </p>

        <h2>Cookies and advertising</h2>
        <p>
          We display ads through Google AdSense. Third-party vendors, including
          Google, use cookies to serve ads based on your prior visits to this and
          other websites.
        </p>
        <ul>
          <li>
            Google’s use of advertising cookies enables it and its partners to
            serve ads to you based on your visit to our site and/or other sites on
            the internet.
          </li>
          <li>
            You may opt out of personalized advertising by visiting{' '}
            <a href="https://www.google.com/settings/ads" rel="nofollow noopener" target="_blank">
              Google Ads Settings
            </a>.
          </li>
          <li>
            You can also opt out of a third-party vendor’s use of cookies for
            personalized advertising by visiting{' '}
            <a href="https://www.aboutads.info" rel="nofollow noopener" target="_blank">
              www.aboutads.info
            </a>.
          </li>
        </ul>

        <h2>How we use information</h2>
        <p>
          We use the limited technical data described above to keep the site
          running, understand which articles are useful, and prevent abuse. We do
          not sell your personal information.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live (for example, under the GDPR or the CCPA),
          you may have the right to access, correct, or delete information about
          you, and to object to certain processing. Because we collect so little,
          the simplest route is usually to contact us and we’ll help.
        </p>

        <h2>Children’s privacy</h2>
        <p>
          This site is intended for adults exploring a business license. We do not
          knowingly collect information from children under 13.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as the site evolves. When we do, we’ll revise
          the “last updated” date above.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Reach us through the{' '}
          <a href="/contact">contact page</a>.
        </p>
      </div>
    </div>
  );
}
