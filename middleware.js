import { NextResponse } from 'next/server';

// Fast edge-level guard: if the session cookie is entirely absent, bounce to
// the login page before the dashboard even renders. The real signature +
// expiry check happens server-side in the dashboard route (Node runtime),
// so this only handles the obvious "not logged in at all" case.
export function middleware(request) {
  const hasCookie = request.cookies.has('admin_session');
  if (!hasCookie) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin';
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/dashboard/:path*'],
};
