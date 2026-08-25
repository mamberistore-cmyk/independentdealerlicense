import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken, verifyPassword } from '@/lib/auth';
import { slugify } from '@/lib/slug';
import {
  githubReady,
  listExistingSlugs,
  commitPost,
  triggerDeploy,
} from '@/lib/github';
import { siteConfig } from '@/lib/config';

export const runtime = 'nodejs';

// Build a YAML frontmatter + body Markdown document. JSON.stringify gives us
// correctly escaped, YAML-valid double-quoted scalars and flow arrays.
function buildMarkdown({ title, description, date, tags, body }) {
  const tagList = (tags || '')
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const frontmatter = [
    '---',
    `title: ${JSON.stringify(title)}`,
    `description: ${JSON.stringify(description || '')}`,
    `date: ${JSON.stringify(date)}`,
    `tags: ${JSON.stringify(tagList)}`,
    `author: ${JSON.stringify(siteConfig.author.name)}`,
    '---',
    '',
  ].join('\n');

  return `${frontmatter}${(body || '').trim()}\n`;
}

export async function POST(request) {
  // ── Auth: valid session cookie OR a correct password in the body ──
  const token = cookies().get(SESSION_COOKIE)?.value;
  let authed = verifySessionToken(token);

  let payload;
  try {
    payload = await request.json();
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 });
  }

  if (!authed && payload?.password) {
    authed = verifyPassword(payload.password);
  }
  if (!authed) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const { title, description, date, tags, body } = payload || {};

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

  const safeDate = /^\d{4}-\d{2}-\d{2}$/.test(date || '')
    ? date
    : new Date().toISOString().slice(0, 10);

  // ── Unique slug ──
  let base = slugify(title);
  if (!base) base = `post-${Date.now()}`;

  let slug = base;
  try {
    const existing = await listExistingSlugs();
    let n = 1;
    while (existing.has(slug)) {
      slug = `${base}-${n}`;
      n += 1;
    }
  } catch (e) {
    return NextResponse.json(
      { error: `Could not reach GitHub: ${e.message}` },
      { status: 502 }
    );
  }

  const markdown = buildMarkdown({ title, description, date: safeDate, tags, body });

  // ── Commit + deploy ──
  try {
    await commitPost({ slug, markdown, title });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 502 });
  }

  const deploy = await triggerDeploy();

  return NextResponse.json({ success: true, slug, deploy });
}
