import Link from 'next/link';
import { slugify } from '@/lib/slug';

export default function Tag({ label, href, size = 'sm' }) {
  const classes =
    size === 'sm'
      ? 'px-2.5 py-0.5 text-[11px]'
      : 'px-3 py-1 text-xs';

  const content = (
    <span
      className={`inline-flex items-center rounded-full border border-clay-light/50 bg-clay-soft font-medium uppercase tracking-wide text-clay ${classes}`}
    >
      {label}
    </span>
  );

  if (href === false) return content;

  return (
    <Link href={href || `/tags/${slugify(label)}`} className="transition-transform hover:-translate-y-0.5">
      {content}
    </Link>
  );
}
