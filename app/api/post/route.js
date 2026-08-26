import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { githubReady, getPostFile } from '@/lib/github';

export const runtime = 'nodejs';

// Fetch a single post (frontmatter + body + sha) for the editor.
export async function GET(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  const slug = new URL(request.url).searchParams.get('slug');
  if (!slug) return NextResponse.json({ error: 'Missing slug.' }, { status: 400 });
  if (!githubReady()) {
    return NextResponse.json({ error: 'GitHub not configured.' }, { status: 500 });
  }
  try {
    const file = await getPostFile(slug);
    if (!file) return NextResponse.json({ error: 'Not found.' }, { status: 404 });
    return NextResponse.json({
      slug,
      sha: file.sha,
      frontmatter: file.data || {},
      content: file.content || '',
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
