import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { githubReady } from '@/lib/github';
import DashboardClient from '@/components/admin/DashboardClient';

export const metadata = {
  title: 'Dashboard',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function DashboardPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    redirect('/admin');
  }

  return (
    <DashboardClient
      githubReady={githubReady()}
      deployHook={Boolean(process.env.VERCEL_DEPLOY_HOOK)}
    />
  );
}
