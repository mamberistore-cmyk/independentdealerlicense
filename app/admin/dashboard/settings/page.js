import SettingsView from '@/components/admin/SettingsView';
import { githubReady } from '@/lib/github';
import { unsplashReady } from '@/lib/unsplash';
import { siteConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export default function SettingsPage({ searchParams }) {
  // Real integration status, computed server-side from the environment.
  const status = {
    github: githubReady(),
    githubOwner: process.env.GITHUB_OWNER || '',
    githubRepo: process.env.GITHUB_REPO || '',
    githubBranch: process.env.GITHUB_BRANCH || 'main',
    adsense: Boolean(siteConfig.adsenseClient && !siteConfig.adsenseClient.includes('XXXX')),
    adsenseClient: siteConfig.adsenseClient,
    deployHook: Boolean(process.env.VERCEL_DEPLOY_HOOK),
    sessionSecret: Boolean(process.env.SESSION_SECRET),
    passwordHash: Boolean(process.env.ADMIN_PASSWORD_HASH),
    analytics: Boolean(siteConfig.gaId && !siteConfig.gaId.includes('XXXX')),
    gaId: siteConfig.gaId,
    searchConsole: siteConfig.searchConsoleVerified === true,
    unsplash: unsplashReady(),
  };

  return <SettingsView tab={searchParams?.tab || 'general'} status={status} />;
}
