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

## 5. The Studio (admin dashboard)

Go to `/admin` (this link is intentionally not shown anywhere on the site),
enter your password, and you land in the **Studio** — a full CMS dashboard with
a collapsible sidebar, top bar, global search, dark/light/system themes, and
toast notifications. It’s responsive down to mobile (drawer navigation).

**Modules that are fully wired to your real backend (GitHub):**

- **Overview** — live post counts, publishing-activity chart, recent posts.
- **Posts** — searchable, filterable (status/category/author), sortable table
  with bulk selection, pagination, and per-row Edit / Duplicate / Preview / Trash.
- **Add / Edit Post** — a rich editor: Markdown toolbar + live preview, slug,
  excerpt, featured image, category, tags, a full **SEO panel** (live score,
  Google preview, focus keyword, canonical), Open Graph fields, a pre-publish
  checklist, autosave-to-browser with recovery, unsaved-changes warning, and
  Save Draft / Preview / Schedule / Publish.
- **Categories & Tags** — derived live from your posts.
- **Media Library** — catalogues the images your posts reference.
- **Pages** — lists your code-managed static pages.
- **SEO** — per-post on-page score, and the **Sitemap** view.
- **Settings → Integrations** — shows real connection status for GitHub,
  AdSense, the deploy hook, and the session secret.
- **Ad Placements & Redirects** — editable configs (saved in your browser).

**Modules that show honest “connect your data” states** (no fake numbers),
because this starter has no analytics/comments/users/revenue backend:
Analytics, Comments, Users (single admin + role model), Search Console,
Revenue. Each explains exactly what to connect to light it up.

### Publishing a post

1. **Posts → Add New Post**, or the **New Post** button anywhere.
2. Fill in the title (the slug auto-generates), body, and any SEO/social fields.
3. **Preview** to render, then **Publish** (or **Save Draft** / **Schedule**).
4. The API writes `content/posts/<slug>.md`, commits it to GitHub, and triggers a
   rebuild. Slugs are de-duplicated automatically (`-1`, `-2`, …). Drafts and
   future-dated scheduled posts stay hidden from the public site until live.

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
  layout.js                 Root layout (html/body/fonts/metadata only)
  globals.css               Design system + article typography
  not-found.js  icon.svg    Custom 404, file-based favicon
  (site)/                   PUBLIC site (route group — URLs unchanged)
    layout.js               Public chrome: header, footer, AdSense, schema
    page.js                 Home
    blog/                   Blog index + [slug] single post (+ skeletons)
    tags/[tag]/page.js      Tag archive
    about/ contact/ privacy-policy/ terms/ disclaimer/
  admin/
    page.js                 Hidden login (own chrome)
    dashboard/
      layout.js             Auth gate + AdminShell (sidebar/topbar/theme)
      page.js               Overview
      posts/  posts/new/  posts/[slug]/edit/
      categories/ tags/ media/ pages/ analytics/
      comments/ users/ appearance/
      seo/ seo/sitemap/ seo/search-console/ seo/redirects/
      monetization/adsense|placements|revenue/
      settings/
  api/
    admin-verify · logout · preview                 (auth/session)
    posts · post · create-post · update-post · delete-post   (content)
components/                 Public components + components/admin/* (Studio UI)
lib/
  posts.js  markdown.js     Read/render posts
  github.js                 GitHub Contents API (list/read/write/delete)
  postDoc.js  seoScore.js   Frontmatter builder + SEO scoring
  auth.js  adminNav.js      Session cookie + sidebar nav
  slug.js  config.js
content/posts/*.md          The articles
middleware.js               Fast edge guard for /admin/dashboard
next-sitemap.config.js      Sitemap + robots (runs on postbuild)
```

---

## 8. Notes

- This is general information, not legal advice. Verify dealer-licensing specifics with your state DMV.
- The admin session cookie is `httpOnly`, signed with `SESSION_SECRET`, and expires after 12 hours.
- `/admin` and `/api` are excluded from the sitemap and marked `noindex`.
