import Link from 'next/link';
import { PageHeader, Card, EmptyState, IntegrationNotice } from '@/components/admin/ui';
import { BASE } from '@/lib/adminNav';

export const dynamic = 'force-dynamic';

const TABS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'spam', label: 'Spam' },
  { key: 'trash', label: 'Trash' },
];

export default function CommentsPage({ searchParams }) {
  const active = searchParams?.status || 'all';

  return (
    <div>
      <PageHeader title="Comments" subtitle="Moderate discussion across your posts." />

      <div className="mb-5">
        <IntegrationNotice service="A comments provider" what="isn’t connected, so there are no comments to moderate yet." />
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap gap-1 border-b border-gray-200 px-3 py-2 dark:border-zinc-800">
          {TABS.map((t) => (
            <Link
              key={t.key}
              href={`${BASE}/comments${t.key === 'all' ? '' : `?status=${t.key}`}`}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium ${
                active === t.key
                  ? 'bg-navy text-white'
                  : 'text-gray-500 hover:bg-gray-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
              }`}
            >
              {t.label} <span className="opacity-60">0</span>
            </Link>
          ))}
        </div>
        <EmptyState
          icon="comments"
          title={`No ${active === 'all' ? '' : active} comments`}
          message="This starter ships without a comments backend. Add a provider like a self-hosted comments service, Disqus, or a database-backed API, then wire it here to approve, reply, edit, and flag spam."
          tone="connect"
        />
      </Card>

      <Card className="mt-4 p-6">
        <h2 className="text-base font-semibold text-gray-900 dark:text-zinc-50">Moderation tools (ready to wire)</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {['Approve', 'Reply', 'Mark as spam', 'Trash'].map((a) => (
            <div key={a} className="rounded-lg border border-gray-200 px-4 py-3 text-sm text-gray-600 dark:border-zinc-800 dark:text-zinc-300">{a}</div>
          ))}
        </div>
      </Card>
    </div>
  );
}
