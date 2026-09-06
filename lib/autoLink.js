// Auto internal-linking: finds keywords in the body that match your other
// posts and links the first clean occurrence to that post. Conservative and
// reviewable — skips headings, code, quotes, lists, images, tables, and any
// line that already contains a link. Each target post and each phrase is
// linked at most once, and the total is capped.

const GENERIC_TAGS = new Set([
  'beginners', 'how-to', 'guide', 'tips', 'advice', 'basics', 'faq', '2026',
  'step-by-step', 'comparison', 'trends',
]);

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function autoLinkPosts(body, posts, currentSlug, maxLinks = 6) {
  // Build candidate anchor phrases from each other post's tags.
  const targets = [];
  const seen = new Set();
  (posts || [])
    .filter((p) => p.slug !== currentSlug)
    .forEach((p) => {
      (p.tags || []).forEach((tag) => {
        const phrase = String(tag).trim().toLowerCase();
        if (phrase.length < 4 || GENERIC_TAGS.has(phrase)) return;
        const key = phrase;
        if (seen.has(key)) return; // first post to claim a phrase wins
        seen.add(key);
        targets.push({ phrase, slug: p.slug, len: phrase.length });
      });
    });
  targets.sort((a, b) => b.len - a.len); // specific (longer) phrases first

  const usedSlugs = new Set();
  let added = 0;

  const lines = body.split('\n');
  let inCode = false;
  const out = lines.map((line) => {
    const t = line.trimStart();
    if (/^```/.test(t)) { inCode = !inCode; return line; }
    if (inCode) return line;
    if (added >= maxLinks) return line;
    // Skip structural lines and lines that already contain a link.
    if (/^(#|>|\||!\[)/.test(t) || /^([-*+]\s|\d+[.)]\s)/.test(t)) return line;
    if (line.includes('](')) return line;

    for (const tgt of targets) {
      if (added >= maxLinks) break;
      if (usedSlugs.has(tgt.slug)) continue;
      const re = new RegExp(`\\b(${escapeRegExp(tgt.phrase)})\\b`, 'i');
      if (re.test(line)) {
        line = line.replace(re, `[$1](/blog/${tgt.slug})`);
        usedSlugs.add(tgt.slug);
        added += 1;
        break; // one link per line keeps it natural
      }
    }
    return line;
  });

  return { body: out.join('\n'), added };
}
