# Production deploy (any domain)

This stack has **no fixed domain** in application code. Point it at any hostname by setting environment variables and CMS config.

## What you configure

| Setting | Where | Purpose |
|---------|--------|---------|
| `NEXT_PUBLIC_SITE_URL` | Next.js env | Canonical URLs, sitemap, SEO, JSON-LD |
| `CMS_API_URL` | Next.js env (server) | Content API + admin proxy target |
| `NEXT_PUBLIC_CMS_PUBLIC_URL` | Next.js env (optional) | `next/image` allowlist for CMS media host |
| `REVALIDATE_SECRET` | Next.js env | On-demand cache revalidation |
| `site_url` / `cms_public_url` / `cors_origins` | `cms/config.php` or `CWS_*` env | Media URLs, CORS, admin links |

## 1. Database

```bash
php cms/scripts/migrate-seed.php
# or run individual migrate-*.php scripts on existing DB
```

## 2. CMS (`cms/`)

```bash
cp cms/config.example.php cms/config.php
```

Edit `cms/config.php` for your paths:

```php
'site_url'       => 'https://www.your-domain.com',
'cms_public_url' => 'https://www.your-domain.com/cms/public',
'cors_origins'   => ['https://www.your-domain.com'],
```

**Subdirectory install** (e.g. `https://host.com/myapp/cms/public`): use that full path in `cms_public_url`. Apache/nginx must map `cms/public` to `cms/public/index.php`.

**Env-only (Docker / PM2)** — no file edit:

```bash
export CWS_SITE_URL=https://www.your-domain.com
export CWS_CMS_PUBLIC_URL=https://www.your-domain.com/cms/public
export CWS_CORS_ORIGINS=https://www.your-domain.com
```

Ensure `cms/uploads/` is writable.

## 3. Next.js (`frontend/`)

```bash
cd frontend
cp .env.production.example .env.local
# Edit NEXT_PUBLIC_SITE_URL and CMS_API_URL for your domain
npm ci
npm run build
npm start
# Or: pm2 start ../scripts/ecosystem.config.example.cjs
```

Production build **requires** `NEXT_PUBLIC_SITE_URL` and `CMS_API_URL` (see `scripts/check-production-env.mjs`). Bypass only for emergencies: `SKIP_ENV_CHECK=1`.

## 4. Reverse proxy (Apache example)

Public site → Next.js on port 3000:

```apache
ProxyPreserveHost On
RequestHeader set X-Forwarded-Proto "https"
RequestHeader set X-Forwarded-Host "www.your-domain.com"
ProxyPass / http://127.0.0.1:3000/
ProxyPassReverse / http://127.0.0.1:3000/
```

CMS API (if on same server):

```apache
Alias /cms/public "C:/path/to/cws-website/cms/public"
<Directory "C:/path/to/cws-website/cms/public">
    AllowOverride All
    Require all granted
</Directory>
```

`ProxyPreserveHost` + forwarded headers let admin server components resolve the site URL when needed.

## 5. WAMP subdirectory (`/cws-website/`)

- Root `index.php` redirects to Next — set `CWS_NEXT_URL=https://your-domain.com` if needed.
- Local defaults in `config.example.php` use `/cws-website/cms/public`.
- Production on root domain: use `/cms/public` paths instead.

## 6. Checklist

- [ ] `NEXT_PUBLIC_SITE_URL` = live HTTPS URL
- [ ] `CMS_API_URL` reachable from Node (`curl` from server)
- [ ] `cms_public_url` matches public CMS URL (images work)
- [ ] `cors_origins` includes your Next.js origin
- [ ] `REVALIDATE_SECRET` set and strong
- [ ] SMTP configured in Admin → Settings → Email
- [ ] `npm run build` succeeds without `SKIP_ENV_CHECK`

## 7. PM2 example

See `scripts/ecosystem.config.example.cjs` — set `cwd` and env vars for your server path and domain.
