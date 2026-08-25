import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { stripMarkdown } from './markdown';

const postsDirectory = path.join(process.cwd(), 'content', 'posts');

function ensureDir() {
  try {
    return fs.existsSync(postsDirectory);
  } catch (e) {
    return false;
  }
}

// Read every .md file, parse frontmatter, and return lightweight metadata.
// The raw body is kept out of the list payload to keep pages fast.
export function getPosts() {
  if (!ensureDir()) return [];

  const files = fs
    .readdirSync(postsDirectory)
    .filter((file) => file.endsWith('.md'));

  const posts = files.map((file) => {
    const slug = file.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, file);
    const raw = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(raw);

    const stats = readingTime(content || '');
    const excerpt =
      data.description || stripMarkdown(content).slice(0, 180).trim() + '…';

    return {
      slug,
      title: data.title || slug,
      description: excerpt,
      date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
      dateLabel: formatDate(data.date),
      tags: normalizeTags(data.tags),
      cover: data.cover || fallbackCover(slug),
      author: data.author || null,
      readingTime: Math.max(1, Math.round(stats.minutes)),
      words: stats.words,
    };
  });

  // Newest first.
  return posts.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Full single post, including rendered-ready body Markdown.
export function getPostBySlug(slug) {
  if (!ensureDir()) return null;
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;

  const raw = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(raw);
  const stats = readingTime(content || '');

  return {
    slug,
    title: data.title || slug,
    description:
      data.description || stripMarkdown(content).slice(0, 180).trim() + '…',
    date: data.date ? new Date(data.date).toISOString() : new Date().toISOString(),
    dateLabel: formatDate(data.date),
    tags: normalizeTags(data.tags),
    cover: data.cover || fallbackCover(slug),
    author: data.author || null,
    readingTime: Math.max(1, Math.round(stats.minutes)),
    words: stats.words,
    content,
  };
}

export function getAllSlugs() {
  if (!ensureDir()) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((f) => f.replace(/\.md$/, ''));
}

// 2–3 posts that share the most tags with the current one.
export function getRelatedPosts(slug, tags = [], limit = 3) {
  const all = getPosts().filter((p) => p.slug !== slug);
  const current = new Set((tags || []).map((t) => t.toLowerCase()));

  const scored = all
    .map((post) => {
      const overlap = post.tags.filter((t) => current.has(t.toLowerCase())).length;
      return { post, overlap };
    })
    .sort((a, b) => {
      if (b.overlap !== a.overlap) return b.overlap - a.overlap;
      return new Date(b.post.date) - new Date(a.post.date);
    });

  const related = scored.filter((s) => s.overlap > 0).map((s) => s.post);
  // If nothing overlaps, fall back to the most recent posts.
  const fallback = scored.map((s) => s.post);
  return (related.length ? related : fallback).slice(0, limit);
}

export function getAllTags() {
  const counts = {};
  getPosts().forEach((post) => {
    post.tags.forEach((tag) => {
      counts[tag] = (counts[tag] || 0) + 1;
    });
  });
  return Object.entries(counts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);
}

export function getPostsByTag(tag) {
  const needle = tag.toLowerCase();
  return getPosts().filter((p) =>
    p.tags.some((t) => t.toLowerCase() === needle)
  );
}

// ── helpers ────────────────────────────────────────────────
function normalizeTags(tags) {
  if (!tags) return [];
  if (Array.isArray(tags)) return tags.map((t) => String(t).trim()).filter(Boolean);
  return String(tags)
    .split(',')
    .map((t) => t.trim())
    .filter(Boolean);
}

export function formatDate(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// A stable, tasteful Unsplash cover chosen from the slug so posts without an
// explicit cover still look intentional rather than random.
const covers = [
  'photo-1503376780353-7e6692767b70', // classic car
  'photo-1552519507-da3b142c6e3d',    // car detail
  'photo-1493238792000-8113da705763', // paperwork desk
  'photo-1450101499163-c8848c66ca85', // notebook + coffee
  'photo-1554224155-6726b3ff858f',    // calculator / finance
  'photo-1436491865332-7a61a109cc05', // road / travel
  'photo-1521791136064-7986c2920216', // handshake
  'photo-1560518883-ce09059eeffa',    // keys / real estate
  'photo-1449965408869-eaa3f722e40d', // vintage car
  'photo-1486312338219-ce68d2c6f44d', // laptop work
];

function fallbackCover(slug) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    hash = (hash * 31 + slug.charCodeAt(i)) & 0xffffffff;
  }
  const id = covers[Math.abs(hash) % covers.length];
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`;
}
