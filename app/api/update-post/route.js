import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { buildPostMarkdown } from '@/lib/postDoc';
import { githubReady, getPostFile, commitPost, triggerDeploy } from '@/lib/github';

export const runtime = 'nodejs';

// Update an existing post file in place (requires its current sha).
export async function POST(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { slug, title, body } = payload || {};
  if (!slug) return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  if (!title?.trim()) return NextResponse.json({ error: 'A title is required.' }, { status: 400 });
  if (!body?.trim()) return NextResponse.json({ error: 'The post body is empty.' }, { status: 400 });
  if (!githubReady()) {
    return NextResponse.json({ error: 'GitHub not configured.' }, { status: 500 });
  }

  let sha = payload.sha;
  try {
    if (!sha) {
      const existing = await getPostFile(slug);
      if (!existing) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
      sha = existing.sha;
    }
    const markdown = buildPostMarkdown({ ...payload, title, body });
    await commitPost({ slug, markdown, title, sha, message: `update: ${title}` });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }

  const deploy = await triggerDeploy();
  return NextResponse.json({ success: true, slug, deploy });
}
