import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import AdminShell from '@/components/admin/AdminShell';

export const metadata = {
  title: 'Studio',
  robots: { index: false, follow: false, nocache: true },
};

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    redirect('/admin');
  }
  return <AdminShell>{children}</AdminShell>;
}
