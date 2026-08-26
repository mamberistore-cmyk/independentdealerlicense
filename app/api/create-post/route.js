import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken, verifyPassword } from '@/lib/auth';
import { slugify } from '@/lib/slug';
import { buildPostMarkdown } from '@/lib/postDoc';
import { githubReady, listExistingSlugs, commitPost, triggerDeploy } from '@/lib/github';

export const runtime = 'nodejs';

export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  let authed = verifySessionToken(token);

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  // Backward-compatible: also accept a password in the body.
  if (!authed && payload?.password) authed = verifyPassword(payload.password);
  if (!authed) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const { title, body, slug: desiredSlug } = payload || {};
  if (!title || !title.trim()) {
    return NextResponse.json({ error: 'A title is required.' }, { status: 400 });
  }
  if (!body || !body.trim()) {
    return NextResponse.json({ error: 'The post body is empty.' }, { status: 400 });
  }
  if (!githubReady()) {
    return NextResponse.json(
      { error: 'GitHub is not configured. Set GITHUB_TOKEN, GITHUB_OWNER, GITHUB_REPO.' },
      { status: 500 }
    );
  }

  let base = slugify(desiredSlug || title) || `post-${Date.now()}`;
  let slug = base;
  try {
    const existing = await listExistingSlugs();
    let n = 1;
    while (existing.has(slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }
  } catch (e) {
    return NextResponse.json({ error: `Could not reach GitHub: ${e.message}` }, { status: 502 });
  }

  const markdown = buildPostMarkdown({ ...payload, title, body });

  try {
    await commitPost({ slug, markdown, title });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }

  const deploy = await triggerDeploy();
  return NextResponse.json({ success: true, slug, deploy });
}
