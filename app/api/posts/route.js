import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { githubReady, listPostsWithMeta } from '@/lib/github';

export const runtime = 'nodejs';

// List all posts with metadata for the admin (source of truth = GitHub).
export async function GET() {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!githubReady()) {
    return NextResponse.json({ posts: [], githubReady: false });
  }
  try {
    const posts = await listPostsWithMeta();
    return NextResponse.json({ posts, githubReady: true });
  } catch (e) {
    return NextResponse.json({ error: e.message, posts: [] }, { status: 502 });
  }
}
