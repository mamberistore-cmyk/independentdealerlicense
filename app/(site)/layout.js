import Script from 'next/script';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { siteConfig } from '@/lib/config';

const client = siteConfig.adsenseClient;
const gaId = siteConfig.gaId;

export const metadata = {
  other: {
    // Tells AdSense which publisher owns this site.
    'google-adsense-account': client,
  },
};

export default function SiteLayout({ children }) {
  const navSchema = {
    '@context': 'https://schema.org',
    '@type': 'SiteNavigationElement',
    name: siteConfig.nav.map((n) => n.label),
    url: siteConfig.nav.map((n) => `${siteConfig.url}${n.href}`),
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icon.svg`,
  };

  return (
    <>
      {/* Google Analytics (GA4). Loads after hydration so it never blocks paint. */}
      {gaId && (
        <>
          <Script
            id="ga-lib"
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
          />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
          </Script>
        </>
      )}

      {/* Google AdSense — Auto Ads. Loads lazily so it never blocks paint. */}
      <Script
        id="adsbygoogle-init"
        async
        strategy="afterInteractive"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(navSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-cream-50"
      >
        Skip to content
      </a>

      <Header />
      <main id="main">{children}</main>
      <Footer />
    </>
  );
}
