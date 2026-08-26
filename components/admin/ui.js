'use client';

// Small, reusable presentational primitives shared across every admin page,
// so the whole panel keeps one consistent component system.
import Link from 'next/link';
import Icon from './Icon';

export function Card({ className = '', children, as: As = 'div', ...rest }) {
  return (
    <As
      className={`rounded-xl border border-gray-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 ${className}`}
      {...rest}
    >
      {children}
    </As>
  );
}

export function PageHeader({ title, subtitle, children }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{subtitle}</p>
        )}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2">{children}</div>}
    </div>
  );
}

const btnBase =
  'inline-flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus-visible:ring-2 focus-visible:ring-navy/40';

const variants = {
  primary: 'bg-navy text-white hover:bg-navy-light',
  secondary:
    'border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800',
  ghost: 'text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  subtle:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:bg-zinc-700',
};

const sizes = { sm: 'px-2.5 py-1.5 text-xs', md: 'px-4 py-2', lg: 'px-5 py-2.5' };

export function Button({ variant = 'primary', size = 'md', icon, href, className = '', children, ...rest }) {
  const cls = `${btnBase} ${variants[variant]} ${sizes[size]} ${className}`;
  const inner = (
    <>
      {icon && <Icon name={icon} className="h-4 w-4" />}
      {children}
    </>
  );
  if (href) {
    return (
      <Link href={href} className={cls} {...rest}>
        {inner}
      </Link>
    );
  }
  return (
    <button className={cls} {...rest}>
      {inner}
    </button>
  );
}

const badgeColors = {
  published: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20 dark:bg-emerald-950/50 dark:text-emerald-300 dark:ring-emerald-500/20',
  draft: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-500/20',
  scheduled: 'bg-amber-50 text-amber-700 ring-amber-600/20 dark:bg-amber-950/50 dark:text-amber-300 dark:ring-amber-500/20',
  pending: 'bg-sky-50 text-sky-700 ring-sky-600/20 dark:bg-sky-950/50 dark:text-sky-300 dark:ring-sky-500/20',
  private: 'bg-purple-50 text-purple-700 ring-purple-600/20 dark:bg-purple-950/50 dark:text-purple-300 dark:ring-purple-500/20',
  spam: 'bg-red-50 text-red-700 ring-red-600/20 dark:bg-red-950/50 dark:text-red-300 dark:ring-red-500/20',
  neutral: 'bg-gray-100 text-gray-600 ring-gray-500/20 dark:bg-zinc-800 dark:text-zinc-300 dark:ring-zinc-500/20',
};

export function Badge({ status = 'neutral', children }) {
  const color = badgeColors[status] || badgeColors.neutral;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset ${color}`}>
      {children || status}
    </span>
  );
}

export function EmptyState({ icon = 'info', title, message, action, tone = 'default' }) {
  return (
    <div className={`flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-16 text-center ${
      tone === 'connect'
        ? 'border-navy/20 bg-navy/[0.03] dark:border-navy-light/30 dark:bg-navy/10'
        : 'border-gray-300 bg-gray-50/60 dark:border-zinc-700 dark:bg-zinc-900/60'
    }`}>
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-full bg-white text-gray-400 shadow-sm dark:bg-zinc-800 dark:text-zinc-500">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-100">{title}</h3>
      {message && <p className="mt-1.5 max-w-md text-sm text-gray-500 dark:text-zinc-400">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

// Standard "this module needs a backend integration" notice — used instead of
// fabricating fake data, so every screen is honest about its data source.
export function IntegrationNotice({ service, what }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
      <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
      <p>
        <strong className="font-semibold">{service}</strong> {what} Connect it in{' '}
        <Link href="/admin/dashboard/settings?tab=integrations" className="underline">
          Settings → Integrations
        </Link>{' '}
        and this screen will show live data.
      </p>
    </div>
  );
}
