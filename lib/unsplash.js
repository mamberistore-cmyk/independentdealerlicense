// Minimal Unsplash API client for the admin's auto-image feature.
// Needs a free access key in UNSPLASH_ACCESS_KEY.

const API = 'https://api.unsplash.com';
const UTM = '?utm_source=independent_dealer_license&utm_medium=referral';

export function unsplashReady() {
  return Boolean(process.env.UNSPLASH_ACCESS_KEY);
}

export async function searchPhotos(query, count = 3) {
  const key = process.env.UNSPLASH_ACCESS_KEY;
  if (!key) throw new Error('UNSPLASH_ACCESS_KEY is not set.');

  const n = Math.min(Math.max(Number(count) || 1, 1), 8);
  const url =
    `${API}/search/photos?query=${encodeURIComponent(query || 'business')}` +
    `&per_page=${n}&orientation=landscape&content_filter=high`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${key}` },
    cache: 'no-store',
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`Unsplash request failed (${res.status}): ${detail.slice(0, 200)}`);
  }

  const data = await res.json();
  const results = Array.isArray(data.results) ? data.results.slice(0, n) : [];

  // Unsplash guidelines: trigger the download endpoint when a photo is used.
  await Promise.allSettled(
    results.map((p) =>
      p?.links?.download_location
        ? fetch(p.links.download_location, { headers: { Authorization: `Client-ID ${key}` } })
        : Promise.resolve()
    )
  );

  return results.map((p) => ({
    url: `${p.urls.raw}&w=1200&q=80&auto=format&fit=crop`,
    alt: p.alt_description || query || 'Photo',
    credit: {
      name: p.user?.name || 'Unsplash',
      link: `${p.user?.links?.html || 'https://unsplash.com'}${UTM}`,
    },
  }));
}
