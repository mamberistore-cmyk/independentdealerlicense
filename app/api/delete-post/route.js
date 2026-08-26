import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { githubReady, getPostFile, deletePostFile, triggerDeploy } from '@/lib/github';

export const runtime = 'nodejs';

// Move a post to trash (deletes the file from the repo).
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

  const { slug, title } = payload || {};
  if (!slug) return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  if (!githubReady()) {
    return NextResponse.json({ error: 'GitHub not configured.' }, { status: 500 });
  }

  try {
    let sha = payload.sha;
    if (!sha) {
      const existing = await getPostFile(slug);
      if (!existing) return NextResponse.json({ error: 'Post not found.' }, { status: 404 });
      sha = existing.sha;
    }
    await deletePostFile({ slug, sha, title });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }

  const deploy = await triggerDeploy();
  return NextResponse.json({ success: true, deploy });
}
