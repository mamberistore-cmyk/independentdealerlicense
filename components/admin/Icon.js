// A compact, consistent line-icon set (24×24, 1.7 stroke) so the whole admin
// shares one visual language. Usage: <Icon name="posts" className="h-5 w-5" />
const paths = {
  overview: <path d="M4 13h7V4H4v9Zm0 7h7v-5H4v5Zm9 0h7v-9h-7v9Zm0-16v5h7V4h-7Z" />,
  analytics: <path d="M4 20V10M10 20V4M16 20v-7M22 20H2" />,
  posts: <path d="M8 4h9a2 2 0 0 1 2 2v14l-3-2-3 2-3-2-3 2V6a2 2 0 0 1 2-2Zm1 5h6M9 13h6" />,
  add: <path d="M12 5v14M5 12h14" />,
  categories: <path d="M3 7a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />,
  tags: <path d="M3 12V5a2 2 0 0 1 2-2h7l9 9-9 9-9-9ZM7.5 7.5h.01" />,
  media: <path d="M3 5h18v14H3zM3 15l5-5 4 4 3-3 6 6M16 9a1 1 0 1 0 0-.01" />,
  pages: <path d="M6 2h8l6 6v14H6zM14 2v6h6" />,
  comments: <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.5A8 8 0 1 1 21 12Z" />,
  appearance: <path d="M12 3a9 9 0 1 0 0 18 2 2 0 0 0 2-2c0-1.5 1-2 2-2h1a3 3 0 0 0 3-3 8 8 0 0 0-8-9Zm-5 9a1 1 0 1 0 0-.01M10 7a1 1 0 1 0 0-.01M15 7a1 1 0 1 0 0-.01" />,
  users: <path d="M16 20v-1a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v1M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7ZM21 20v-1a4 4 0 0 0-3-3.9M16 4.1a4 4 0 0 1 0 7.8" />,
  seo: <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3Z" />,
  searchconsole: <path d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM21 21l-5-5" />,
  sitemap: <path d="M9 3h6v4H9zM3 17h6v4H3zM15 17h6v4h-6zM12 7v4M6 17v-2h12v2" />,
  redirects: <path d="M4 7h11a4 4 0 0 1 0 8H8m0 0 3 3m-3-3 3-3" />,
  adsense: <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />,
  placements: <path d="M3 4h18v16H3zM3 9h18M9 9v11" />,
  revenue: <path d="M3 17l6-6 4 4 8-8M21 7v5m0-5h-5" />,
  settings: <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 7 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0-1.2-2.9H1a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 2.6 7a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.7 1.7 0 0 0 8 2.6h.1A1.7 1.7 0 0 0 9 1.1V1a2 2 0 1 1 4 0v.1A1.7 1.7 0 0 0 15 2.6a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.5 1H23a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1Z" />,
  sun: <path d="M12 4V2m0 20v-2m8-8h2M2 12h2m13.7 5.7 1.4 1.4M4.9 4.9l1.4 1.4m0 11.4-1.4 1.4M19.1 4.9l-1.4 1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z" />,
  moon: <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />,
  menu: <path d="M4 6h16M4 12h16M4 18h16" />,
  close: <path d="M6 6l12 12M18 6 6 18" />,
  chevron: <path d="M9 6l6 6-6 6" />,
  external: <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />,
  bell: <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0" />,
  logout: <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />,
  trash: <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m2 0v14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6M10 11v6M14 11v6" />,
  edit: <path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5Z" />,
  duplicate: <path d="M8 8h11a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1ZM4 16a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h11a1 1 0 0 1 1 1" />,
  eye: <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7-10-7-10-7Zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />,
  check: <path d="M20 6 9 17l-5-5" />,
  upload: <path d="M12 15V3m0 0L8 7m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />,
  filter: <path d="M3 5h18l-7 8v6l-4-2v-4L3 5Z" />,
  search: <path d="M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14ZM21 21l-4-4" />,
  warning: <path d="M12 3l10 17H2L12 3ZM12 9v5M12 17h.01" />,
  info: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 8h.01M11 12h1v5h1" />,
  clock: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM12 7v5l3 2" />,
  link: <path d="M10 13a5 5 0 0 0 7 0l2-2a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-2 2a5 5 0 0 0 7 7l1-1" />,
  globe: <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20Z" />,
  save: <path d="M5 3h11l3 3v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2ZM7 3v6h8V3M7 21v-6h10v6" />,
  calendar: <path d="M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6ZM3 10h18M8 2v4M16 2v4" />,
  grid: <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />,
  list: <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />,
  drag: <path d="M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01" />,
};

export default function Icon({ name, className = 'h-5 w-5' }) {
  const d = paths[name];
  if (!d) return null;
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d}
    </svg>
  );
}
