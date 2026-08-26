'use client';

import { Suspense, useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import { ToastProvider } from './Toast';

// Applies the chosen theme to the shell root. 'system' follows the OS.
function resolveDark(theme) {
  if (theme === 'dark') return true;
  if (theme === 'light') return false;
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

export default function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [theme, setTheme] = useState('system');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const savedTheme = localStorage.getItem('idl.admin.theme');
      if (savedTheme) setTheme(savedTheme);
      const savedCollapsed = localStorage.getItem('idl.admin.collapsed');
      if (savedCollapsed) setCollapsed(savedCollapsed === '1');
    } catch (e) {
      /* storage unavailable */
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('idl.admin.theme', theme);
    } catch (e) {}
  }, [theme, mounted]);

  useEffect(() => {
    if (!mounted) return;
    try {
      localStorage.setItem('idl.admin.collapsed', collapsed ? '1' : '0');
    } catch (e) {}
  }, [collapsed, mounted]);

  const isDark = mounted && resolveDark(theme);

  const cycleTheme = () =>
    setTheme((t) => (t === 'light' ? 'dark' : t === 'dark' ? 'system' : 'light'));

  return (
    <div className={isDark ? 'dark' : ''}>
      <ToastProvider>
        <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-zinc-950 dark:text-zinc-100">
          {/* Desktop sidebar */}
          <aside
            className={`fixed inset-y-0 left-0 z-30 hidden border-r border-gray-200 bg-white transition-all duration-200 dark:border-zinc-800 dark:bg-zinc-900 lg:block ${
              collapsed ? 'w-[76px]' : 'w-64'
            }`}
          >
            <Suspense fallback={null}>
              <Sidebar collapsed={collapsed} />
            </Suspense>
          </aside>

          {/* Mobile drawer */}
          {mobileOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
              <aside className="absolute inset-y-0 left-0 w-72 border-r border-gray-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
                <Suspense fallback={null}>
                  <Sidebar collapsed={false} onNavigate={() => setMobileOpen(false)} />
                </Suspense>
              </aside>
            </div>
          )}

          {/* Main column */}
          <div className={`flex min-h-screen flex-col transition-all duration-200 ${collapsed ? 'lg:pl-[76px]' : 'lg:pl-64'}`}>
            <Suspense fallback={<div className="h-16 border-b border-gray-200 dark:border-zinc-800" />}>
              <Topbar
                onOpenMobile={() => setMobileOpen(true)}
                onToggleCollapse={() => setCollapsed((v) => !v)}
                theme={theme}
                cycleTheme={cycleTheme}
              />
            </Suspense>
            <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 lg:px-8">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </div>
  );
}
