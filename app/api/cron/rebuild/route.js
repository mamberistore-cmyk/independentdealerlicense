import { NextResponse } from 'next/server';
import { triggerDeploy } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Daily rebuild endpoint hit by Vercel Cron (see vercel.json `crons`).
//
// Why this exists: posts with `status: "scheduled"` and a future date stay
// hidden until their date arrives (see lib/posts.js). But the site is
// statically generated, so a scheduled post only actually appears once the
// site is rebuilt. This endpoint pings the Vercel deploy hook once a day so
// that day's scheduled posts go live on their own — no manual redeploy.
//
// Security: if CRON_SECRET is set, the request must present it as a Bearer
// token. Vercel Cron automatically sends `Authorization: Bearer <CRON_SECRET>`
// when that env var exists, so no extra wiring is needed. If CRON_SECRET is
// not set, the endpoint is open (it only triggers a rebuild — no data leaks).
async function handle(request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization') || '';
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
    }
  }

  const result = await triggerDeploy();
  if (!result.triggered) {
    // No deploy hook configured (or the ping failed) — report it so the
    // Vercel cron log makes the misconfiguration obvious instead of silently
    // "succeeding" while nothing rebuilds.
    return NextResponse.json(
      {
        ok: false,
        rebuilt: false,
        reason: result.error || 'VERCEL_DEPLOY_HOOK is not set.',
        at: new Date().toISOString(),
      },
      { status: 200 }
    );
  }

  return NextResponse.json({ ok: true, rebuilt: true, at: new Date().toISOString() });
}

export async function GET(request) {
  return handle(request);
}

// Allow POST too, so the deploy hook can also be pinged manually for testing.
export async function POST(request) {
  return handle(request);
}
