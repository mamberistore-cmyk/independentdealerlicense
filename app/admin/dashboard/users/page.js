import Link from 'next/link';
import { PageHeader, Card, Badge, EmptyState } from '@/components/admin/ui';
import Icon from '@/components/admin/Icon';
import { siteConfig } from '@/lib/config';
import { BASE } from '@/lib/adminNav';

export const dynamic = 'force-dynamic';

const ROLES = [
  { role: 'Administrator', caps: 'Full access — manage everything, including settings and users.' },
  { role: 'Editor', caps: 'Publish and manage all posts, including those of other users.' },
  { role: 'Author', caps: 'Publish and manage only their own posts.' },
  { role: 'Contributor', caps: 'Write and manage their own posts, but cannot publish.' },
  { role: 'Subscriber', caps: 'Read-only; can manage their own profile.' },
];

function TabLink({ tab, active, children }) {
  return (
    <Link
      href={`${BASE}/users${tab === 'all' ? '' : `?tab=${tab}`}`}
      className={`rounded-lg px-3 py-1.5 text-sm font-medium ${active === tab ? 'bg-navy text-white' : 'text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800'}`}
    >
      {children}
    </Link>
  );
}

export default function UsersPage({ searchParams }) {
  const tab = searchParams?.tab || 'all';
  const initials = siteConfig.author.name.split(' ').map((n) => n[0]).join('').slice(0, 2);
  const input = 'w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200';

  return (
    <div>
      <PageHeader title="Users" subtitle="Manage who can access the studio." />

      <div className="mb-4 flex gap-1">
        <TabLink tab="all" active={tab}>All Users</TabLink>
        <TabLink tab="new" active={tab}>Add User</TabLink>
        <TabLink tab="roles" active={tab}>Roles</TabLink>
      </div>

      {tab === 'all' && (
        <>
          <div className="mb-4 flex items-start gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-600 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300">
            <Icon name="info" className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />
            <p>This starter authenticates a single administrator with a password. Multiple accounts need a user database — the role model below is ready for that.</p>
          </div>
          <Card className="overflow-hidden">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                  <th className="px-5 py-3 font-medium">User</th>
                  <th className="px-5 py-3 font-medium">Role</th>
                  <th className="px-5 py-3 font-medium">Posts</th>
                  <th className="px-5 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
                <tr>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full bg-navy text-xs font-semibold text-white">{initials}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-zinc-100">{siteConfig.author.name}</p>
                        <p className="text-xs text-gray-400">{siteConfig.author.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3"><Badge status="private">Administrator</Badge></td>
                  <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">All</td>
                  <td className="px-5 py-3"><Badge status="published">Active</Badge></td>
                </tr>
              </tbody>
            </table>
          </Card>
        </>
      )}

      {tab === 'new' && (
        <Card className="max-w-lg p-6">
          <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Add user</h2>
          <p className="mt-1 text-sm text-gray-500 dark:text-zinc-400">Wire this form to a user backend to enable multiple accounts.</p>
          <div className="mt-4 space-y-3 opacity-90">
            <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400">Name</label><input className={input} placeholder="Jordan Reeves" /></div>
            <div><label className="mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400">Email</label><input className={input} placeholder="jordan@example.com" /></div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600 dark:text-zinc-400">Role</label>
              <select className={input}>{ROLES.map((r) => <option key={r.role}>{r.role}</option>)}</select>
            </div>
            <button disabled className="w-full cursor-not-allowed rounded-lg bg-navy/60 px-4 py-2 text-sm font-medium text-white">Add user (needs backend)</button>
          </div>
        </Card>
      )}

      {tab === 'roles' && (
        <Card className="overflow-hidden">
          <table className="w-full min-w-[520px] text-sm">
            <thead>
              <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-zinc-800">
                <th className="px-5 py-3 font-medium">Role</th>
                <th className="px-5 py-3 font-medium">Capabilities</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-zinc-800">
              {ROLES.map((r) => (
                <tr key={r.role}>
                  <td className="px-5 py-3 font-medium text-gray-900 dark:text-zinc-100">{r.role}</td>
                  <td className="px-5 py-3 text-gray-500 dark:text-zinc-400">{r.caps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}
