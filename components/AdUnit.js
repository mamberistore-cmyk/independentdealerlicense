'use client';

import { useEffect, useRef } from 'react';
import { siteConfig } from '@/lib/config';

// A single responsive display ad. Drop <AdUnit slot="1234567890" /> anywhere
// inside an article. Replace the slot IDs with real ones from your AdSense
// dashboard. While a real slot is absent the unit renders a labelled
// placeholder so the layout still looks intentional in development.
export default function AdUnit({ slot, className = '', label = 'Advertisement' }) {
  const ref = useRef(null);
  const client = siteConfig.adsenseClient;
  const configured = client && !client.includes('XXXX') && slot;

  useEffect(() => {
    if (!configured) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e) {
      /* AdSense not loaded yet — Auto Ads script handles retries. */
    }
  }, [configured]);

  return (
    <div className={`my-10 ${className}`}>
      <p className="mb-1 text-center text-[10px] uppercase tracking-[0.2em] text-ink-muted/70">
        {label}
      </p>
      {configured ? (
        <ins
          ref={ref}
          className="adsbygoogle block"
          style={{ display: 'block' }}
          data-ad-client={client}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : (
        <div className="grid h-[120px] place-items-center rounded-xl border border-dashed border-cream-300 bg-cream-100/60 text-xs text-ink-muted">
          Ad space
        </div>
      )}
    </div>
  );
}
