'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { adminNav, BASE } from '@/lib/adminNav';
import { siteConfig } from '@/lib/config';
import Icon from './Icon';

// Pick the single most-specific nav item that matches the current URL.
function activeHref(pathname, sp) {
  const all = adminNav.flatMap((g) => g.items);
  let best = null;
  let bestScore = -1;
  for (const item of all) {
    const [path, query] = item.href.split('?');
    if (pathname !== path) continue;
    let ok = true;
    let score = 1;
    if (query) {
      const params = new URLSearchParams(query);
      for (const [k, v] of params) {
        if (sp.get(k) !== v) ok = false;
        else score += 1;
      }
    }
    if (ok && score > bestScore) {
      bestScore = score;
      best = item.href;
    }
  }
  if (best) return best;
  // Fallback: longest path that is a prefix of the current one (nested routes).
  let prefix = null;
  let plen = -1;
  for (const item of all) {
    const path = item.href.split('?')[0];
    if (path !== BASE && pathname.startsWith(path + '/') && path.length > plen) {
      plen = path.length;
      prefix = item.href;
    }
  }
  return prefix;
}

export default function Sidebar({ collapsed, onNavigate }) {
  const pathname = usePathname();
  const sp = useSearchParams();
  const active = activeHref(pathname, sp);

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className={`flex h-16 items-center gap-3 border-b border-gray-200 px-4 dark:border-zinc-800 ${collapsed ? 'justify-center px-0' : ''}`}>
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-navy text-cream-50">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M3 13l2-5a3 3 0 0 1 2.8-2h8.4A3 3 0 0 1 19 8l2 5M5 17h14M6 13h12M7.5 17v2M16.5 17v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
        {!collapsed && (
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-gray-900 dark:text-zinc-50">{siteConfig.shortName} Studio</p>
            <p className="truncate text-[11px] text-gray-400 dark:text-zinc-500">Content workspace</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-5 overflow-y-auto px-3 py-5">
        {adminNav.map((group) => (
          <div key={group.label}>
            {!collapsed && (
              <p className="px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-gray-400 dark:text-zinc-600">
                {group.label}
              </p>
            )}
            <ul className="space-y-0.5">
              {group.items.map((item) => {
                const isActive = active === item.href;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={onNavigate}
                      title={collapsed ? item.label : undefined}
                      className={`group flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition-colors ${
                        collapsed ? 'justify-center' : ''
                      } ${
                        isActive
                          ? 'bg-navy text-white shadow-sm'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Icon name={item.icon} className="h-[18px] w-[18px] shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer link */}
      <div className="border-t border-gray-200 p-3 dark:border-zinc-800">
        <Link
          href="/"
          target="_blank"
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-gray-600 hover:bg-gray-100 dark:text-zinc-300 dark:hover:bg-zinc-800 ${collapsed ? 'justify-center' : ''}`}
          title="View website"
        >
          <Icon name="external" className="h-[18px] w-[18px] shrink-0" />
          {!collapsed && <span>View website</span>}
        </Link>
      </div>
    </div>
  );
}
