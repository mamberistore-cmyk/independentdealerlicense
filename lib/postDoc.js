import { siteConfig } from './config';

// Build a YAML frontmatter + body Markdown document from the editor payload.
// JSON.stringify gives correctly escaped, YAML-valid scalars and flow arrays.
// Only writes optional SEO/social keys when they have a value, keeping files
// tidy and backward-compatible with the original simpler frontmatter.
export function buildPostMarkdown(fields = {}) {
  const {
    title = '',
    description = '',
    date,
    tags = '',
    category = '',
    status = 'published',
    body = '',
    cover = '',
    excerpt = '',
    seoTitle = '',
    focusKeyword = '',
    canonical = '',
    ogTitle = '',
    ogDescription = '',
    ogImage = '',
    author,
  } = fields;

  const tagList = Array.isArray(tags)
    ? tags
    : String(tags)
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

  const safeDate = /^\d{4}-\d{2}-\d{2}/.test(String(date || ''))
    ? String(date)
    : new Date().toISOString().slice(0, 10);

  const lines = ['---'];
  const put = (key, value) => lines.push(`${key}: ${JSON.stringify(value)}`);

  put('title', title);
  put('description', description);
  put('date', safeDate);
  put('tags', tagList);
  if (category) put('category', category);
  put('status', status);
  put('author', author || siteConfig.author.name);
  if (cover) put('cover', cover);
  if (excerpt) put('excerpt', excerpt);
  if (seoTitle) put('seoTitle', seoTitle);
  if (focusKeyword) put('focusKeyword', focusKeyword);
  if (canonical) put('canonical', canonical);
  if (ogTitle) put('ogTitle', ogTitle);
  if (ogDescription) put('ogDescription', ogDescription);
  if (ogImage) put('ogImage', ogImage);
  lines.push('---', '');

  return `${lines.join('\n')}${String(body).trim()}\n`;
}
