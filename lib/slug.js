// Turn any title into a clean, ASCII-only, lowercase, hyphenated slug.
// Handles accented Latin characters by transliterating them to ASCII.
export function slugify(input = '') {
  return input
    .toString()
    .normalize('NFKD') // split accented letters into base + diacritic
    .replace(/[̀-ͯ]/g, '') // drop the diacritics
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-') // anything not a-z0-9 becomes a hyphen
    .replace(/^-+|-+$/g, '') // trim leading/trailing hyphens
    .replace(/-{2,}/g, '-') // collapse repeats
    .slice(0, 80); // keep URLs sane
}
