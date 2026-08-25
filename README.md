# Independent Dealer License

A fast, AdSense-ready blog built with **Next.js 14 (App Router)** and **Tailwind CSS**, with a **hidden, password-protected admin panel** that publishes new posts straight to this GitHub repository through the GitHub API — no external CMS, no database.

- **Content** lives as Markdown files in `content/posts/`.
- **Publishing** happens at the hidden `/admin` route, which commits a new `.md` file via the GitHub Contents API and (optionally) pings a Vercel Deploy Hook to rebuild.
- **SEO**: per-post metadata, Open Graph, Twitter Cards, JSON-LD (`BlogPosting`, `BreadcrumbList`, `SiteNavigationElement`, `Person`), sitemap, and robots.txt.
- **Ads**: Google AdSense Auto Ads in `<head>` plus manual in-article units.

---

## 1. Local setup

```bash
npm install
cp .env.local.example .env.local   # then fill in the values
npm run dev
```

Open <http://localhost:3000>. The hidden admin panel is at <http://localhost:3000/admin>.

---

## 2. Environment variables

Copy `.env.local.example` to `.env.local` (locally) and add the same keys in
**Vercel → Project Settings → Environment Variables** (for production).

| Variable | Required | What it is |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | yes | Public site URL, e.g. `https://independentdealerlicense.com` |
| `NEXT_PUBLIC_ADSENSE_CLIENT` | for ads | Your AdSense publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) |
| `ADMIN_PASSWORD` | yes* | Plain admin password (used if no hash is set) |
| `ADMIN_PASSWORD_HASH` | optional | bcrypt hash of the password (takes priority over the plain one) |
| `SESSION_SECRET` | yes | Long random string used to sign the session cookie |
| `GITHUB_TOKEN` | yes | Classic Personal Access Token with the **`repo`** scope |
| `GITHUB_OWNER` | yes | GitHub username/org that owns the repo |
| `GITHUB_REPO` | yes | Repository name |
| `GITHUB_BRANCH` | optional | Branch to commit posts to (default `main`) |
| `VERCEL_DEPLOY_HOOK` | optional | Deploy Hook URL to force a rebuild after publishing |

\* Set either `ADMIN_PASSWORD` or `ADMIN_PASSWORD_HASH`.

### Generating a bcrypt password hash

```bash
node -e "console.log(require('bcryptjs').hashSync('your-password', 10))"
```

Paste the result into `ADMIN_PASSWORD_HASH`.

---

## 3. Create the GitHub token

1. GitHub → **Settings → Developer settings → Personal access tokens → Tokens (classic)**.
2. **Generate new token (classic)** with the **`repo`** scope.
3. Copy it into `GITHUB_TOKEN`. Set `GITHUB_OWNER` and `GITHUB_REPO` to match this repo.

---

## 4. Deploy to Vercel

1. Push this repo to GitHub.
2. On [vercel.com](https://vercel.com), **Add New → Project** and import the repo.
3. Add every environment variable from the table above.
4. Deploy. Vercel auto-detects Next.js — no extra config needed.

### Optional: Deploy Hook (instant rebuild after publishing)

1. In Vercel → **Project Settings → Git → Deploy Hooks**, create a hook (e.g. name `publish`, branch `main`).
2. Copy the URL into `VERCEL_DEPLOY_HOOK`.

> Even without the hook, Vercel redeploys automatically whenever the admin panel commits a new post to GitHub — the hook just makes it instant/explicit.

---

## 5. Publishing a post

1. Go to `/admin` (this link is intentionally not shown anywhere on the site).
2. Enter your admin password.
3. Fill in **Title, Description, Date, Tags, and Body (Markdown)**. Hit **Preview** to see the rendered output, then **Publish**.
4. The API creates `content/posts/<slug>.md`, commits it to GitHub, and triggers a rebuild. Your post is live after the deploy finishes.

Slugs are generated from the title (ASCII, lowercase, hyphenated) and de-duplicated automatically (`-1`, `-2`, …).

---

## 6. AdSense checklist

- Replace `ca-pub-XXXXXXXXXXXXXXXX` with your real ID via `NEXT_PUBLIC_ADSENSE_CLIENT`.
- The Auto Ads script loads in `app/layout.js`; the `google-adsense-account` meta tag is set there too.
- In-article ad slots live in `components/AdUnit.js` — replace the placeholder `slot` IDs with real ad-unit IDs from your AdSense dashboard.
- Add and verify your site in Google Search Console, then submit `https://your-domain.com/sitemap.xml`.

---

## 7. Project structure

```
app/
  layout.js                 Root layout, fonts, AdSense, SEO, header/footer
  page.js                   Home page
  globals.css               Custom design system + article typography
  not-found.js              Custom 404
  icon.svg                  Favicon (file-based metadata)
  blog/
    page.js                 Blog index (search + tag filter)
    loading.js              Skeleton
    [slug]/
      page.js               Single post (SEO + schema + related)
      loading.js            Skeleton
  tags/[tag]/page.js        Tag archive
  about/ contact/ privacy-policy/ terms/ disclaimer/   Static pages
  admin/
    page.js                 Hidden login
    dashboard/page.js       Post editor (auth-gated)
  api/
    admin-verify/route.js   Password check -> session cookie
    logout/route.js         Clears the cookie
    preview/route.js        Renders Markdown preview (auth-gated)
    create-post/route.js    Commits a new post to GitHub
components/                 Header, Footer, PostCard, AdUnit, admin UI, ...
lib/
  posts.js                  getPosts / getPostBySlug / getRelatedPosts
  markdown.js               Markdown -> HTML (remark + gfm)
  auth.js                   Password + signed session cookie
  github.js                 GitHub Contents API client
  slug.js  config.js        Slugify + site metadata
content/posts/*.md          The articles
middleware.js               Fast edge guard for /admin/dashboard
next-sitemap.config.js      Sitemap + robots (runs on postbuild)
```

---

## 8. Notes

- This is general information, not legal advice. Verify dealer-licensing specifics with your state DMV.
- The admin session cookie is `httpOnly`, signed with `SESSION_SECRET`, and expires after 12 hours.
- `/admin` and `/api` are excluded from the sitemap and marked `noindex`.
