'use client';

import Icon from './Icon';

// A KPI card. When `value` is null/undefined it renders an honest
// "needs integration" state instead of a fabricated number.
export default function StatCard({ icon, label, value, delta, hint, connect }) {
  const hasValue = value !== null && value !== undefined;
  const up = typeof delta === 'number' ? delta >= 0 : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-navy/10 text-navy dark:bg-navy-light/20 dark:text-navy-light">
          <Icon name={icon} className="h-[18px] w-[18px]" />
        </span>
        {hasValue && typeof delta === 'number' && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
              up
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300'
                : 'bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-300'
            }`}
          >
            {up ? '▲' : '▼'} {Math.abs(delta)}%
          </span>
        )}
        {connect && !hasValue && (
          <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
            Connect
          </span>
        )}
      </div>
      <p className="mt-4 text-2xl font-semibold tracking-tight text-gray-900 dark:text-zinc-50">
        {hasValue ? value : '—'}
      </p>
      <p className="mt-0.5 text-sm text-gray-500 dark:text-zinc-400">{label}</p>
      {hint && <p className="mt-1 text-xs text-gray-400 dark:text-zinc-500">{hint}</p>}
    </div>
  );
}
