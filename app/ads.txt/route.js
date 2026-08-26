import { siteConfig } from '@/lib/config';

// Serves /ads.txt, which AdSense uses to confirm you own the ad inventory.
// Generated from your publisher ID: ca-pub-1234 -> pub-1234.
export const dynamic = 'force-static';

export function GET() {
  const client = siteConfig.adsenseClient || '';
  const pub = client.replace(/^ca-/, ''); // pub-XXXXXXXXXXXXXXXX

  const body =
    pub && !pub.includes('XXXX')
      ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
      : '# Set NEXT_PUBLIC_ADSENSE_CLIENT to your ca-pub-… ID to activate ads.txt\n';

  return new Response(body, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
