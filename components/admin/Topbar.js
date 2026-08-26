'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Icon from './Icon';
import { useToast } from './Toast';
import { siteConfig } from '@/lib/config';

export default function Topbar({ onOpenMobile, onToggleCollapse, theme, cycleTheme }) {
  const router = useRouter();
  const { notify } = useToast();
  const [menuOpen, setMenuOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [q, setQ] = useState('');
  const menuRef = useRef(null);
  const bellRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target)) setBellOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    router.push(`/admin/dashboard/posts?q=${encodeURIComponent(q.trim())}`);
  };

  const logout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    notify('Signed out', 'info');
    router.replace('/admin');
    router.refresh();
  };

  const themeIcon = theme === 'dark' ? 'moon' : theme === 'light' ? 'sun' : 'globe';

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white/90 px-4 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
      {/* mobile menu */}
      <button
        onClick={onOpenMobile}
        className="grid h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:hidden"
        aria-label="Open menu"
      >
        <Icon name="menu" />
      </button>
      {/* desktop collapse */}
      <button
        onClick={onToggleCollapse}
        className="hidden h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800 lg:grid"
        aria-label="Collapse sidebar"
      >
        <Icon name="menu" />
      </button>

      <form onSubmit={submitSearch} className="relative hidden max-w-md flex-1 sm:block">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search posts…"
          aria-label="Search"
          className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2 pl-9 pr-3 text-sm text-gray-700 outline-none transition-colors placeholder:text-gray-400 focus:border-navy/40 focus:bg-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:focus:bg-zinc-800"
        />
      </form>

      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/"
          target="_blank"
          className="hidden items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-50 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 sm:inline-flex"
        >
          <Icon name="external" className="h-4 w-4" /> View site
        </Link>

        <button
          onClick={cycleTheme}
          className="grid h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
          aria-label="Toggle theme"
          title={`Theme: ${theme}`}
        >
          <Icon name={themeIcon} className="h-[18px] w-[18px]" />
        </button>

        {/* notifications */}
        <div className="relative" ref={bellRef}>
          <button
            onClick={() => setBellOpen((v) => !v)}
            className="relative grid h-9 w-9 place-items-center rounded-lg text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800"
            aria-label="Notifications"
          >
            <Icon name="bell" className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-clay" />
          </button>
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-72 rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <p className="px-2 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-400">Notifications</p>
              <div className="rounded-lg px-2 py-2 text-sm text-gray-600 dark:text-zinc-300">
                <p className="font-medium text-gray-900 dark:text-zinc-100">Welcome to the Studio</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Your posts and settings live here. Connect analytics in Settings to light up the dashboards.</p>
              </div>
            </div>
          )}
        </div>

        {/* user menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-2 rounded-lg px-1.5 py-1 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <span className="grid h-8 w-8 place-items-center rounded-full bg-navy text-xs font-semibold text-white">
              {siteConfig.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </span>
            <Icon name="chevron" className="hidden h-4 w-4 rotate-90 text-gray-400 sm:block" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-gray-200 bg-white p-1.5 shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="border-b border-gray-100 px-3 py-2 dark:border-zinc-800">
                <p className="text-sm font-medium text-gray-900 dark:text-zinc-100">{siteConfig.author.name}</p>
                <p className="text-xs text-gray-500 dark:text-zinc-400">Administrator</p>
              </div>
              <Link href="/admin/dashboard/settings" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
                <Icon name="settings" className="h-4 w-4" /> Settings
              </Link>
              <button onClick={logout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40">
                <Icon name="logout" className="h-4 w-4" /> Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
