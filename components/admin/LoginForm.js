'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin-verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        router.replace('/admin/dashboard');
        router.refresh();
      } else {
        setError(data.error || 'Incorrect password.');
      }
    } catch (err) {
      setError('Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-5 py-16">
      <div className="rounded-xl2 border border-cream-300/70 bg-cream-50 p-8 shadow-lift">
        <div className="mb-6 flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy text-cream-50">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect x="4" y="10" width="16" height="10" rx="2" stroke="currentColor" strokeWidth="1.6" />
              <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.6" />
            </svg>
          </span>
          <div>
            <h1 className="font-serif text-xl font-semibold text-ink">Editor access</h1>
            <p className="text-xs text-ink-muted">Enter the password to publish.</p>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">
              Password
            </label>
            <input
              id="password"
              type="password"
              autoFocus
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-cream-300 bg-cream-100 px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-navy/50"
              placeholder="••••••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-clay-soft px-3 py-2 text-sm text-clay">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="w-full rounded-xl bg-navy px-4 py-3 text-sm font-semibold text-cream-50 transition-colors hover:bg-navy-light disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
      <p className="mt-4 text-center text-xs text-ink-muted">
        This area isn’t linked anywhere public.
      </p>
    </div>
  );
}
