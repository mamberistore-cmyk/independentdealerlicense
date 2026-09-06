// Suggests post metadata (tags, SEO title, meta description, focus keyword,
// excerpt) from the title + body — deterministic, no AI, no word changes.

const DOMAIN_TAGS = [
  'surety bond', 'insurance', 'cost', 'requirements', 'zoning', 'dealer plates',
  'inspection', 'compliance', 'fees', 'startup', 'background check', 'sales tax',
  'wholesale', 'used car', 'how to', 'application', 'dealer education', 'signage',
  'bond', 'licensing', 'business', 'financing', 'auction',
];

function esc(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
function uniq(a) {
  return [...new Set(a)];
}
function stripMd(md = '') {
  return md
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/[#>*_`|-]/g, ' ')
    .replace(/https?:\/\/\S+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}
function clip(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const at = cut.lastIndexOf(' ');
  return (at > 40 ? cut.slice(0, at) : cut).trim() + '…';
}
function firstSentences(text, max) {
  const m = text.match(/^(.*?[.!?])\s/);
  const s = m ? m[1] : text;
  return clip(s.length < 60 ? text : s, max);
}

export function suggestFields({ title = '', body = '', knownTags = [] } = {}) {
  const plain = stripMd(body);
  const hay = `${title}\n${plain}`.toLowerCase();
  const titleLower = title.toLowerCase();

  const pool = uniq([
    ...knownTags.map((t) => String(t).toLowerCase().trim()).filter(Boolean),
    ...DOMAIN_TAGS,
  ]);

  const found = [];
  for (const tag of pool) {
    if (tag.length < 3) continue;
    const re = new RegExp(`\\b${esc(tag)}\\b`, 'i');
    if (re.test(hay)) {
      const score = (re.test(titleLower) ? 2 : 0) + (tag.includes(' ') ? 1 : 0);
      found.push({ tag, score });
    }
  }
  found.sort((a, b) => b.score - a.score || b.tag.length - a.tag.length);
  const tags = uniq(found.map((f) => f.tag)).slice(0, 6);

  const description = clip(firstSentences(plain, 160), 158);
  const excerpt = clip(firstSentences(plain, 160), 160);

  let focusKeyword = '';
  if (/independent dealer license/i.test(hay)) focusKeyword = 'independent dealer license';
  else focusKeyword = found.find((f) => f.tag.includes(' '))?.tag || tags[0] ||
    title.trim().split(/\s+/).slice(0, 3).join(' ').toLowerCase();

  return {
    tags,
    seoTitle: title.trim(),
    description,
    excerpt,
    focusKeyword,
  };
}
