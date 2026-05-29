# CWS PHP CMS (replaces WordPress for content)

MySQL database + PHP JSON API + WP-style admin panel.

## Setup (WAMP)

1. Copy config if needed: `cms/config.php` (defaults use `cws_cms` DB, user `root`, empty password).

2. Create database and import content:

```powershell
php C:\wamp64\www\cws-website\cms\scripts\migrate-seed.php
```

Default admin login: **admin** / **CwsAdmin@2026** (override with env `CWS_ADMIN_PASSWORD`).

**Roles:** `admin` (full access, user management, activity log) and `user` (content only — cannot create users or view activity). Passwords are stored hashed with PHP `password_hash()`.

3. URLs:

| Service | URL |
|---------|-----|
| Public API | http://localhost/cws-website/cms/public/api/v1/homepage |
| **React Admin (use this)** | **http://localhost:3000/admin** |
| Legacy PHP admin (optional) | http://localhost/cws-website/cms/admin/ |

4. Connect Next.js — in `frontend/.env.local`:

```env
CMS_API_URL=http://localhost/cws-website/cms/public
# Optional: remove or comment WordPress when fully switched:
# WORDPRESS_GRAPHQL_URL=
# NEXT_PUBLIC_WORDPRESS_URL=
```

Restart `npm run dev`. The site reads from PHP CMS when `CMS_API_URL` is set.

## Admin features

- **Homepage** — JSON editor for all section blocks (slider, FAQ, etc.)
- **Pages** — WYSIWYG + SEO (About, Contact, Services, …)
- **Service landings** — full landing editor + SEO HTML
- **Menus** — JSON per menu location
- **Site settings** — logo URLs, phone, colors, social
- **Ask price options** — pricing form bundles
- **Form submissions** — contact, ask price, enrollment

## API endpoints

- `GET /api/v1/settings`
- `GET /api/v1/menus`
- `GET /api/v1/homepage`
- `GET /api/v1/pages/{slug}`
- `GET /api/v1/landings` and `/landings/{slug}`
- `GET /api/v1/services/{slug}`
- `GET /api/v1/blog`
- `GET /api/v1/slugs`
- `GET /api/v1/pricing-options`
- `POST /api/v1/contact`, `/lead`, `/enrollment`
