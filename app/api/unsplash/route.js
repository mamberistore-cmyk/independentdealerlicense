import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';
import { unsplashReady, searchPhotos } from '@/lib/unsplash';

export const runtime = 'nodejs';

// Returns N relevant, license-clear photos for the editor to insert.
export async function GET(request) {
  const token = cookies().get(SESSION_COOKIE)?.value;
  if (!verifySessionToken(token)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }
  if (!unsplashReady()) {
    return NextResponse.json(
      { error: 'Unsplash is not configured. Add UNSPLASH_ACCESS_KEY.', configured: false },
      { status: 400 }
    );
  }

  const params = new URL(request.url).searchParams;
  const query = params.get('query') || 'business';
  const count = params.get('count') || 3;

  try {
    const photos = await searchPhotos(query, count);
    return NextResponse.json({ photos, configured: true });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
