// Minimal GitHub Contents API client used by the admin panel to read and
// write post files. No external dependency — just fetch().

import matter from 'gray-matter';
import readingTime from 'reading-time';

const API = 'https://api.github.com';
const POSTS_DIR = 'content/posts';

function config() {
  const token = process.env.GITHUB_TOKEN;
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';
  return { token, owner, repo, branch };
}

export function githubReady() {
  const { token, owner, repo } = config();
  return Boolean(token && owner && repo);
}

function headers() {
  const { token } = config();
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'Content-Type': 'application/json',
  };
}

// Return the set of existing slugs already committed under content/posts.
export async function listExistingSlugs() {
  const { owner, repo, branch } = config();
  const url = `${API}/repos/${owner}/${repo}/contents/content/posts?ref=${encodeURIComponent(
    branch
  )}`;

  const res = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (res.status === 404) return new Set(); // directory not created yet
  if (!res.ok) {
    throw new Error(`GitHub list failed (${res.status})`);
  }
  const data = await res.json();
  const slugs = (Array.isArray(data) ? data : [])
    .filter((f) => f.type === 'file' && f.name.endsWith('.md'))
    .map((f) => f.name.replace(/\.md$/, ''));
  return new Set(slugs);
}

// List every post with parsed frontmatter metadata (source of truth for the
// admin panel — reliable on Vercel where reading the local FS at request time
// isn't). Fetches the directory listing, then each file's content in parallel.
export async function listPostsWithMeta() {
  const { owner, repo, branch } = config();
  const listUrl = `${API}/repos/${owner}/${repo}/contents/${POSTS_DIR}?ref=${encodeURIComponent(
    branch
  )}`;

  const res = await fetch(listUrl, { headers: headers(), cache: 'no-store' });
  if (res.status === 404) return [];
  if (!res.ok) throw new Error(`GitHub list failed (${res.status})`);

  const files = (await res.json()).filter(
    (f) => f.type === 'file' && f.name.endsWith('.md')
  );

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await fetchFileRaw(file.path).catch(() => '');
      const { data, content } = matter(raw || '');
      const stats = readingTime(content || '');
      const slug = file.name.replace(/\.md$/, '');
      return {
        slug,
        sha: file.sha,
        title: data.title || slug,
        description: data.description || '',
        date: data.date ? new Date(data.date).toISOString() : null,
        tags: normalizeTags(data.tags),
        category: data.category || 'Uncategorized',
        status: (data.status || 'published').toLowerCase(),
        author: data.author || '',
        cover: data.cover || '',
        readingTime: Math.max(1, Math.round(stats.minutes)),
        words: stats.words,
      };
    })
  );

  return posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
}

// Fetch a single file's decoded content + sha (needed to update it).
export async function getPostFile(slug) {
  const { owner, repo, branch } = config();
  const filePath = `${POSTS_DIR}/${slug}.md`;
  const url = `${API}/repos/${owner}/${repo}/contents/${filePath}?ref=${encodeURIComponent(
    branch
  )}`;
  const res = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const json = await res.json();
  const content = Buffer.from(json.content || '', 'base64').toString('utf8');
  return { sha: json.sha, raw: content, ...matter(content) };
}

async function fetchFileRaw(path) {
  const { owner, repo, branch } = config();
  const url = `${API}/repos/${owner}/${repo}/contents/${path}?ref=${encodeURIComponent(
    branch
  )}`;
  const res = await fetch(url, { headers: headers(), cache: 'no-store' });
  if (!res.ok) throw new Error(`GitHub read failed (${res.status})`);
  const json = await res.json();
  return Buffer.from(json.content || '', 'base64').toString('utf8');
}

// Commit (create or update) a Markdown file at content/posts/<slug>.md.
// Pass `sha` to update an existing file.
export async function commitPost({ slug, markdown, title, sha, message }) {
  const { owner, repo, branch } = config();
  const filePath = `${POSTS_DIR}/${slug}.md`;
  const url = `${API}/repos/${owner}/${repo}/contents/${filePath}`;

  const contentBase64 = Buffer.from(markdown, 'utf8').toString('base64');
  const body = {
    message: message || `post: ${title}`,
    content: contentBase64,
    branch,
  };
  if (sha) body.sha = sha;

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`GitHub commit failed (${res.status}): ${detail}`);
  }
  return res.json();
}

// Delete a post file (used by "Move to trash").
export async function deletePostFile({ slug, sha, title }) {
  const { owner, repo, branch } = config();
  const filePath = `${POSTS_DIR}/${slug}.md`;
  const url = `${API}/repos/${owner}/${repo}/contents/${filePath}`;
  const res = await fetch(url, {
    method: 'DELETE',
    headers: headers(),
    body: JSON.stringify({
      message: `trash: ${title || slug}`,
      sha,
      branch,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`GitHub delete failed (${res.status}): ${detail}`);
  }
  return res.json();
}

function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  return String(tags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

// Optionally ping the Vercel deploy hook so the site rebuilds immediately.
export async function triggerDeploy() {
  const hook = process.env.VERCEL_DEPLOY_HOOK;
  if (!hook) return { triggered: false };
  try {
    await fetch(hook, { method: 'POST' });
    return { triggered: true };
  } catch (e) {
    return { triggered: false, error: e.message };
  }
}
