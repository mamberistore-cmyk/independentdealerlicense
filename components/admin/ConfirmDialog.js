'use client';

import { useEffect } from 'react';
import Icon from './Icon';
import { Button } from './ui';

export default function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Confirm',
  tone = 'danger',
  busy = false,
  onConfirm,
  onCancel,
}) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onCancel?.();
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />
      <div className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-start gap-4">
          <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-full ${tone === 'danger' ? 'bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300' : 'bg-navy/10 text-navy dark:bg-navy-light/20 dark:text-navy-light'}`}>
            <Icon name={tone === 'danger' ? 'trash' : 'info'} className="h-5 w-5" />
          </span>
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-zinc-50">{title}</h3>
            {message && <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">{message}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
          <Button variant={tone === 'danger' ? 'danger' : 'primary'} onClick={onConfirm} disabled={busy}>
            {busy ? 'Working…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
