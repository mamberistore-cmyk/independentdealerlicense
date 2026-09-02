// Distributes image blocks through a Markdown body: evenly spaced, and
// snapped to just-after an H2 heading when one is nearby, so each image
// tends to open a section. Pure function — safe on the client.

function imageBlock(img) {
  const alt = String(img.alt || 'Photo').replace(/[\[\]]/g, '');
  const credit = img.credit
    ? `\n*Photo by [${img.credit.name}](${img.credit.link}) on Unsplash*`
    : '';
  return `![${alt}](${img.url})${credit}`;
}

export function distributeImages(body, images) {
  const imgs = images || [];
  if (!imgs.length) return body;

  const blocks = String(body || '').split(/\n{2,}/);
  if (blocks.length <= 1) {
    // Very short post: just append the images.
    return [body.trim(), ...imgs.map(imageBlock)].filter(Boolean).join('\n\n');
  }

  const isHeading = (b) => /^#{2,3}\s/.test(b.trimStart());
  const n = imgs.length;

  // Target block index for each image, evenly spaced (never before the intro).
  const targets = [];
  for (let i = 1; i <= n; i++) {
    let pos = Math.round((i / (n + 1)) * blocks.length);
    pos = Math.min(Math.max(pos, 1), blocks.length);
    // Snap to just after a nearby heading, if any (look back up to 2 blocks).
    for (let k = 0; k <= 2; k++) {
      if (isHeading(blocks[pos - 1 - k])) {
        pos = pos - k;
        break;
      }
    }
    targets.push(pos);
  }

  const result = [];
  let imgIdx = 0;
  for (let i = 0; i < blocks.length; i++) {
    result.push(blocks[i]);
    while (imgIdx < targets.length && targets[imgIdx] === i + 1) {
      result.push(imageBlock(imgs[imgIdx]));
      imgIdx += 1;
    }
  }
  while (imgIdx < imgs.length) {
    result.push(imageBlock(imgs[imgIdx]));
    imgIdx += 1;
  }
  return result.join('\n\n');
}
