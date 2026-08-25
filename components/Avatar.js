import Image from 'next/image';
import { siteConfig } from '@/lib/config';

export default function Avatar({ author, size = 40, showMeta = false, meta }) {
  const person = author || siteConfig.author;
  const src = person?.avatar || siteConfig.author.avatar;

  return (
    <div className="flex items-center gap-3">
      <span
        className="relative shrink-0 overflow-hidden rounded-full ring-2 ring-cream-50 shadow-soft"
        style={{ width: size, height: size }}
      >
        <Image
          src={src}
          alt={person?.name || 'Author'}
          width={size}
          height={size}
          className="h-full w-full object-cover"
        />
      </span>
      {showMeta && (
        <span className="flex flex-col leading-tight">
          <span className="text-sm font-semibold text-ink">{person?.name}</span>
          <span className="text-xs text-ink-muted">{meta || person?.role}</span>
        </span>
      )}
    </div>
  );
}
