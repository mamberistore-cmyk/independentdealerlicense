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

export function tidyText(input) {
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
    // Plain paragraph: reflow the wrapped lines into one clean paragraph.
    return lines
      .map((l) => l.trim())
      .filter(Boolean)
      .join(' ')
      .replace(/ {2,}/g, ' ');
  });

  return out.join('\n\n').replace(/\n{3,}/g, '\n\n').trim();
}
