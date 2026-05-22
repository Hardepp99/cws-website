# WordPress Headless CMS Setup

## Install location

Recommended WAMP path: `c:\wamp64\www\cws-cms\`

## Required plugins

1. Advanced Custom Fields PRO
2. WPGraphQL
3. WPGraphQL for ACF
4. Rank Math SEO (optional, for meta)

## Activate CWS Headless plugin

Copy this folder's `cws-headless` directory to:

```
wp-content/plugins/cws-headless/
```

Activate in **Plugins → Installed Plugins**.

## After activation

1. **Site Settings** appears in admin sidebar — configure logo, colors, contact info.
2. Create a page titled **Home** and set as **Settings → Reading → Homepage**.
3. Add flexible sections on the homepage (ACF).
4. After changing plugin PHP files, sync into WordPress:

```powershell
powershell -File wordpress/scripts/sync-plugin.ps1
```

5. Run seed scripts from project root (populates the **database** — the frontend reads only from WP):

```bash
php wordpress/scripts/seed-service-landings.php
php wordpress/scripts/seed-pages-and-services.php
```

The seed script sets the static front page to **Home** and creates menus automatically.

6. Configure **Settings → CWS Headless** (optional):
   - Next.js Revalidate URL: `http://localhost:3000/api/revalidate`
   - Revalidate Secret: match `REVALIDATE_SECRET` in frontend `.env.local`

## GraphQL endpoint

```
http://localhost/cws-cms/graphql
```

Custom JSON fields (no hardcoded frontend copy): `cwsHomepage`, `cwsPage`, `cwsServiceLanding`, `cwsService`, `cwsServiceLandings`, `cwsMenus`, `cwsBlogPosts`, `cwsAllSlugs`, `cwsSiteSettings`.

## REST form endpoints

- `POST /wp-json/cws/v1/contact`
- `POST /wp-json/cws/v1/enrollment`

## Custom post types

- `service_landing` — Zirakpur SEO landing pages (18 seeded)
- `service` — Full service detail pages
- `course` — Training courses
- `portfolio_item` — Portfolio
- `form_submission` — Contact/enrollment inbox
