import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import LoginForm from '@/components/admin/LoginForm';

export const metadata = {
  title: 'Editor',
  robots: { index: false, follow: false, nocache: true },
};

// The whole /admin area is deliberately unlinked and never indexed.
export const dynamic = 'force-dynamic';

export default function AdminPage() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (verifySessionToken(token)) {
    redirect('/admin/dashboard');
  }
  return <LoginForm />;
}
