// Central place for site-wide metadata. Edit these once and the whole
// site (header, footer, SEO tags, schema) updates.

export const siteConfig = {
  name: 'Independent Dealer License',
  shortName: 'IDL',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://independentdealerlicense.com',
  description:
    'Plain-English guides to getting and keeping an independent used-car dealer license — costs, surety bonds, insurance, and the paperwork nobody warns you about.',
  keywords: [
    'independent dealer license',
    'used car dealer license',
    'how to get a dealer license',
    'dealer surety bond',
    'dealer license cost',
    'car dealer insurance',
    'start a used car dealership',
    'dealer license requirements',
  ],
  author: {
    name: 'Marcus Delaney',
    role: 'Former licensing clerk, now independent dealer',
    bio: 'Marcus spent nine years behind the counter at a state DMV licensing office before opening his own small used-car lot. He writes the guides he wishes someone had handed him on day one.',
    avatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    twitter: '@dealerlicense',
    url: 'https://independentdealerlicense.com/about',
  },
  nav: [
    { label: 'Blog', href: '/blog' },
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
  social: {
    twitter: 'https://twitter.com/dealerlicense',
  },
  // Google AdSense publisher ID — replace with your own ca-pub-XXXX value.
  adsenseClient: process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX',
  // Google Analytics (GA4) measurement ID. Not a secret — appears in page HTML.
  gaId: process.env.NEXT_PUBLIC_GA_ID || 'G-4P2QY3KKZC',
  defaultOgImage:
    'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=1200&q=80',
};

export const siteUrl = siteConfig.url;
