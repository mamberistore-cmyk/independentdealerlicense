'use client';

import { useState } from 'react';
import { PageHeader, Card, Button, EmptyState } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { useLocalConfig } from '@/components/admin/useLocalConfig';
import { useToast } from '@/components/admin/Toast';

export default function RedirectsPage() {
  const [redirects, save, loaded] = useLocalConfig('idl.redirects', []);
  const { notify } = useToast();
  const [form, setForm] = useState({ from: '', to: '', code: '301' });

  const add = (e) => {
    e.preventDefault();
    if (!form.from.trim() || !form.to.trim()) return notify('Fill in both paths.', 'error');
    save([...redirects, { ...form, id: Date.now() }]);
    setForm({ from: '', to: '', code: '301' });
    notify('Redirect added.', 'success');
  };
  const remove = (id) => { save(redirects.filter((r) => r.id !== id)); notify('Redirect removed.', 'info'); };

  const input = 'rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-navy/40 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200';

  return (
    <div>
      <PageHeader title="Redirects" subtitle="Map old URLs to new ones." />

      <div className="mb-4 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-900/50 dark:bg-amber-950/40 dark:text-amber-200">
        <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0" />
        <p>Rules are stored in your browser. To make them live, copy them into <code>next.config.js</code> <code>redirects()</code> or a <code>vercel.json</code> <code>redirects</code> array, then deploy.</p>
      </div>

      <Card className="mb-4 p-5">
        <form onSubmit={add} className="grid gap-3 sm:grid-cols-[1fr_1fr_auto_auto]">
          <input value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} placeholder="/old-path" className={input} />
          <input value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} placeholder="/new-path" className={input} />
          <select value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className={input}>
            <option value="301">301 Permanent</option>
            <option value="302">302 Temporary</option>
          </select>
          <Button type="submit" icon="add">Add</Button>
        </form>
      </Card>

      <Card className="overflow-hidden">
        {!loaded ? (
          <div className="p-5"><div className="h-12 rounded-lg shimmer" /></div>
        ) : redirects.length === 0 ? (
          <EmptyState icon="redirects" title="No redirects yet" message="Add your first rule above." />
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                <th className="px-5 py-3 font-medium">From</th>
                <th className="px-5 py-3 font-medium">To</th>
                <th className="px-5 py-3 font-medium">Type</th>
                <th className="px-5 py-3 font-medium text-right">Remove</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {redirects.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3 font-mono text-gray-700 dark:text-zinc-300">{r.from}</td>
                  <td className="px-5 py-3 font-mono text-gray-700 dark:text-zinc-300">{r.to}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{r.code}</td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => remove(r.id)} className="grid h-8 w-8 place-items-center rounded-md text-gray-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/40 ml-auto"><Icon name="trash" className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
}
