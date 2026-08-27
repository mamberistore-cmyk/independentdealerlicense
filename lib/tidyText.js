// Tidy the LAYOUT of pasted/written text without ever changing the words.
// Fixes the classic "pasted from PDF/Word" mess: hard line breaks in the
// middle of sentences, hyphen-split words, trailing spaces, and runs of
// blank lines — while preserving Markdown structure (headings, lists,
// quotes, tables, code, dividers) and every actual word/character.

function isStructural(line) {
  const t = line.trimStart();
  return (
    /^#{1,6}\s/.test(t) || // heading
    /^[-*+]\s/.test(t) || // bullet list
    /^\d+[.)]\s/.test(t) || // numbered list
    /^>/.test(t) || // blockquote
    /^\|/.test(t) || // table row
    /^```/.test(t) || // code fence
    /^(-{3,}|\*{3,}|_{3,})\s*$/.test(t) // horizontal rule
  );
}

// A conservative "is this a heading?" test, used only on a line that stands
// completely alone as its own block (blank line before and after). That
// isolation is the strong signal — it avoids turning the first wrapped line
// of a paragraph into a heading.
function looksLikeHeading(line) {
  const t = line.trim();
  if (!t) return false;
  if (isStructural(t)) return false;
  if (/^https?:\/\//i.test(t)) return false; // a bare URL
  const words = t.split(/\s+/).length;
  if (words > 12 || t.length > 70) return false; // headings are short
  if (/[.,;:]$/.test(t)) return false; // ends like a sentence -> not a heading
  return true;
}

export function tidyText(input, { headings = true } = {}) {
  if (!input) return '';

  let s = String(input).replace(/\r\n?/g, '\n'); // normalize newlines
  s = s.replace(/[ \t]+\n/g, '\n'); // strip trailing spaces
  s = s.replace(/ /g, ' '); // non-breaking spaces -> normal
  // Rejoin words split by a hyphen at a line break (Latin or Georgian).
  s = s.replace(/([A-Za-zႠ-ჿ])-\n([A-Za-zႠ-ჿ])/g, '$1$2');

  const blocks = s.split(/\n{2,}/); // paragraphs separated by blank lines
  const out = blocks.map((block) => {
    const lines = block.split('\n');
    // Leave lists / tables / headings / code / quotes exactly as written.
    if (lines.some(isStructural)) return block.replace(/[ \t]+$/gm, '');
    // A short line standing entirely alone → mark it as an H2 heading.
    if (headings && lines.length === 1 && looksLikeHeading(lines[0])) {
      return `## ${lines[0].trim()}`;
    }
    // Plain paragraph: reflow the wrapped lines into one clean paragraph.
    return lines
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ')
      .replace(/ {2,}/g, ' ');
  });

  return out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}
