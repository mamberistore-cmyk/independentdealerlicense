// Minimal GitHub Contents API client used by the admin panel to commit new
// post files. No external dependency — just fetch().

const API = 'https://api.github.com';

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

// Commit a Markdown file at content/posts/<slug>.md.
export async function commitPost({ slug, markdown, title }) {
  const { owner, repo, branch } = config();
  const filePath = `content/posts/${slug}.md`;
  const url = `${API}/repos/${owner}/${repo}/contents/${filePath}`;

  const contentBase64 = Buffer.from(markdown, 'utf8').toString('base64');

  const res = await fetch(url, {
    method: 'PUT',
    headers: headers(),
    body: JSON.stringify({
      message: `post: ${title}`,
      content: contentBase64,
      branch,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`GitHub commit failed (${res.status}): ${detail}`);
  }
  return res.json();
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
