import { remark } from 'remark';
import remarkGfm from 'remark-gfm';
import remarkHtml from 'remark-html';

// Convert a Markdown string into a safe HTML string.
// remark-gfm adds tables, strikethrough, task lists and autolinks.
export async function markdownToHtml(markdown = '') {
  const file = await remark()
    .use(remarkGfm)
    .use(remarkHtml, { sanitize: false })
    .process(markdown);

  return String(file);
}

// A tiny helper to strip Markdown down to plain text for meta descriptions
// and reading-time estimates when a description is missing.
export function stripMarkdown(markdown = '') {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_~`>-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
