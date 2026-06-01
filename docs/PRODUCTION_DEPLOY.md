# Production deploy

Next.js + **Node CMS** (`/api/v1`) + **MySQL**. No PHP required.

## Environment variables

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_SITE_URL` | Canonical HTTPS URL (no trailing slash) |
| `MYSQL_HOST`, `MYSQL_DATABASE`, `MYSQL_USER`, `MYSQL_PASSWORD` | Database |
| `CWS_UPLOAD_DIR` | Writable directory for uploaded media |
| `REVALIDATE_SECRET` | On-demand cache revalidation |
| `CWS_SESSION_SECRET` | Session signing |
| `GOOGLE_OAUTH_CLIENT_ID` | Optional member Google login |
| `GOOGLE_PLACES_API_KEY` | Optional GMB sync |

Copy [`frontend/.env.production.example`](../frontend/.env.production.example).

## Build

```bash
cd frontend
npm ci
npm run build
npm start
```

Production build requires `NEXT_PUBLIC_SITE_URL` and MySQL env vars (see `scripts/check-production-env.mjs`).

## Database

- Fresh install: import [`database/schema.sql`](../database/schema.sql), then run SQL files in [`database/migrations/`](../database/migrations/) in order.
- Existing site: import your mysqldump.

## Hostinger

See [HOSTINGER_DEPLOY.md](./HOSTINGER_DEPLOY.md).

## Local development

See [NODE_CMS.md](./NODE_CMS.md).
