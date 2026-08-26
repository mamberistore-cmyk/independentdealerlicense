// A lightweight, deterministic SEO score (0–100) with human-readable checks.
// Mirrors the kind of on-page analysis Yoast/RankMath surface, kept simple
// and dependency-free so it runs anywhere.
export function scoreSeo({
  title = '',
  seoTitle = '',
  description = '',
  slug = '',
  focusKeyword = '',
  body = '',
  cover = '',
} = {}) {
  const checks = [];
  const effectiveTitle = seoTitle || title;
  const kw = focusKeyword.trim().toLowerCase();
  const bodyText = body.toLowerCase();
  const wordCount = body.trim() ? body.trim().split(/\s+/).length : 0;

  const add = (ok, weight, label, hint) =>
    checks.push({ ok, weight, label, hint });

  add(
    effectiveTitle.length >= 30 && effectiveTitle.length <= 65,
    16,
    'SEO title length (30–65 chars)',
    `Currently ${effectiveTitle.length} characters.`
  );
  add(
    description.length >= 120 && description.length <= 160,
    16,
    'Meta description length (120–160)',
    `Currently ${description.length} characters.`
  );
  add(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) && slug.length > 0 && slug.length <= 60,
    12,
    'Clean, readable URL slug',
    'Lowercase words separated by hyphens, under 60 chars.'
  );
  add(Boolean(kw), 10, 'Focus keyword set', 'Add a focus keyword to target.');
  add(
    kw ? effectiveTitle.toLowerCase().includes(kw) : false,
    12,
    'Focus keyword in title',
    'Include your focus keyword in the SEO title.'
  );
  add(
    kw ? description.toLowerCase().includes(kw) : false,
    10,
    'Focus keyword in meta description',
    'Mention the focus keyword in the description.'
  );
  add(
    kw ? bodyText.includes(kw) : false,
    12,
    'Focus keyword in content',
    'Use the focus keyword naturally in the body.'
  );
  add(wordCount >= 300, 8, 'Content length (300+ words)', `Currently ${wordCount} words.`);
  add(Boolean(cover), 4, 'Featured image set', 'Add a cover / featured image.');

  const earned = checks.reduce((s, c) => s + (c.ok ? c.weight : 0), 0);
  const total = checks.reduce((s, c) => s + c.weight, 0);
  const score = Math.round((earned / total) * 100);

  let label = 'Needs work';
  if (score >= 80) label = 'Excellent';
  else if (score >= 60) label = 'Good';
  else if (score >= 40) label = 'Okay';

  return { score, label, checks };
}
