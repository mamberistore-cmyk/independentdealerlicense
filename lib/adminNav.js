// Single source of truth for the admin sidebar. Each group has a label and
// items; each item has a label, href, and icon name (see components/admin/Icon).
export const BASE = '/admin/dashboard';

export const adminNav = [
  {
    label: 'Dashboard',
    items: [
      { label: 'Overview', href: `${BASE}`, icon: 'overview' },
      { label: 'Analytics', href: `${BASE}/analytics`, icon: 'analytics' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Posts', href: `${BASE}/posts`, icon: 'posts' },
      { label: 'Add New Post', href: `${BASE}/posts/new`, icon: 'add' },
      { label: 'Categories', href: `${BASE}/categories`, icon: 'categories' },
      { label: 'Tags', href: `${BASE}/tags`, icon: 'tags' },
      { label: 'Media Library', href: `${BASE}/media`, icon: 'media' },
      { label: 'Pages', href: `${BASE}/pages`, icon: 'pages' },
    ],
  },
  {
    label: 'Comments',
    items: [
      { label: 'All Comments', href: `${BASE}/comments`, icon: 'comments' },
      { label: 'Pending', href: `${BASE}/comments?status=pending`, icon: 'clock' },
      { label: 'Spam', href: `${BASE}/comments?status=spam`, icon: 'warning' },
    ],
  },
  {
    label: 'Appearance',
    items: [
      { label: 'Themes', href: `${BASE}/appearance?tab=themes`, icon: 'appearance' },
      { label: 'Customize', href: `${BASE}/appearance?tab=customize`, icon: 'edit' },
      { label: 'Menus', href: `${BASE}/appearance?tab=menus`, icon: 'list' },
      { label: 'Widgets', href: `${BASE}/appearance?tab=widgets`, icon: 'grid' },
    ],
  },
  {
    label: 'Users',
    items: [
      { label: 'All Users', href: `${BASE}/users`, icon: 'users' },
      { label: 'Add User', href: `${BASE}/users?tab=new`, icon: 'add' },
      { label: 'Roles', href: `${BASE}/users?tab=roles`, icon: 'seo' },
    ],
  },
  {
    label: 'SEO & Growth',
    items: [
      { label: 'SEO', href: `${BASE}/seo`, icon: 'seo' },
      { label: 'Search Console', href: `${BASE}/seo/search-console`, icon: 'searchconsole' },
      { label: 'Sitemap', href: `${BASE}/seo/sitemap`, icon: 'sitemap' },
      { label: 'Redirects', href: `${BASE}/seo/redirects`, icon: 'redirects' },
    ],
  },
  {
    label: 'Monetization',
    items: [
      { label: 'Google AdSense', href: `${BASE}/monetization/adsense`, icon: 'adsense' },
      { label: 'Ad Placements', href: `${BASE}/monetization/placements`, icon: 'placements' },
      { label: 'Revenue', href: `${BASE}/monetization/revenue`, icon: 'revenue' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'General', href: `${BASE}/settings`, icon: 'settings' },
      { label: 'Writing', href: `${BASE}/settings?tab=writing`, icon: 'edit' },
      { label: 'Reading', href: `${BASE}/settings?tab=reading`, icon: 'posts' },
      { label: 'Permalinks', href: `${BASE}/settings?tab=permalinks`, icon: 'link' },
      { label: 'Privacy', href: `${BASE}/settings?tab=privacy`, icon: 'seo' },
      { label: 'Integrations', href: `${BASE}/settings?tab=integrations`, icon: 'globe' },
    ],
  },
];
