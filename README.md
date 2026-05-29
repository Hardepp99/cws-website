# CWS Website — Next.js + Headless WordPress

Creative Web Solutions (cwsindia.online) rebuilt as a **Next.js 14** frontend with **WordPress** as headless CMS on the same WAMP server.

## Project structure

```
cws-website/
├── frontend/              # Next.js App Router (public site)
├── wordpress/
│   ├── cws-headless/      # Custom WP plugin (CPTs, ACF, CORS, forms, revalidate)
│   └── scripts/           # Seed scripts for service landings
├── php/                   # Original PHP site (reference until cutover)
└── scripts/               # Data export utilities
```

## Quick start (local WAMP)

### 1. Next.js frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The site works **without WordPress** using built-in fallback content from the PHP migration.

### 2. WordPress CMS

1. Install WordPress at `c:\wamp64\www\cws-cms\` (or update paths in seed script).
2. Install plugins:
   - **Advanced Custom Fields PRO**
   - **WPGraphQL**
   - **WPGraphQL for ACF**
   - **Rank Math SEO** (optional)
3. Copy `wordpress/cws-headless` to `wp-content/plugins/cws-headless` and activate.
4. In **Settings → CWS Headless**, set:
   - Revalidate URL: `http://localhost:3000/api/revalidate`
   - Secret: same as `REVALIDATE_SECRET` in `frontend/.env.local`
5. Seed 18 service landing pages:

```bash
php wordpress/scripts/seed-service-landings.php
```

6. Set `WORDPRESS_GRAPHQL_URL=http://localhost/cws-cms/graphql` in `frontend/.env.local`.

### 3. Production (any domain)

The app is **domain-independent**: set `NEXT_PUBLIC_SITE_URL` and `CMS_API_URL` for your hostname. No code changes required when moving servers.

**Full guide:** [docs/PRODUCTION_DEPLOY.md](docs/PRODUCTION_DEPLOY.md)

```bash
cd frontend
cp .env.production.example .env.local
# Edit URLs for your domain, then:
npm run build && npm start
```

Example Apache reverse proxy:

```apache
ProxyPreserveHost On
RequestHeader set X-Forwarded-Proto "https"
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

## Content editing (ACF)

| Location | What you edit |
|----------|----------------|
| **Site Settings** (Options) | Logo, colors, phone, email, address, social links, footer text |
| **Homepage** (front page) | Flexible sections: hero, about, process, services, etc. |
| **Service Landings** | 18 Zirakpur SEO pages — benefits, FAQ, theme colors |
| **Services** | Full service detail pages |
| **Posts** | Blog articles |
| **Portfolio** | Portfolio items |
| **Courses** | Training course pages |

## URLs preserved

Extensionless PHP URLs map to Next.js routes, e.g.:

- `/website-development-zirakpur`
- `/contact`
- `/blog`

## Cutover checklist

- [ ] Import all content into WordPress
- [ ] Run seed script for service landings
- [ ] Configure revalidation webhook
- [ ] `npm run build` passes
- [ ] 301 redirects for any changed URLs
- [ ] Submit sitemap: `/sitemap.xml`
- [ ] Google Search Console verification
- [ ] Keep `php/` until QA sign-off

## Scripts

```bash
# Export service landing JSON from PHP
node scripts/export-service-landings.mjs

# Seed WordPress (requires WP installed)
php wordpress/scripts/seed-service-landings.php
```
