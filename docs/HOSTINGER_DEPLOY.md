# Deploy on Hostinger (Node.js only) — cwsindia.online

**Step-by-step (live MySQL on every request):** [HOSTINGER_NODE_DEPLOY.md](./HOSTINGER_NODE_DEPLOY.md)

Single **Node.js** app + **MySQL**. No PHP, no `cms/` folder on the server.

## Stack

| Component | Details |
|-----------|---------|
| App | Next.js (`frontend/`) via Hostinger Node.js |
| API | Built-in `/api/v1/*` |
| Database | MySQL `cws_cms` |
| Media | `CWS_UPLOAD_DIR` on disk |

Env template: [`deploy/hostinger/node.env.example`](../deploy/hostinger/node.env.example)

## 1. Database

1. hPanel → **Databases** → create MySQL DB + user.
2. **phpMyAdmin** → import your `cws_cms` SQL dump.
3. Schema reference: [`database/schema.sql`](../database/schema.sql) and [`database/migrations/`](../database/migrations/).

## 2. Media uploads

Copy local `data/uploads/` (or your old `cms/uploads`) to the server path set in `CWS_UPLOAD_DIR`.

## 3. Node.js app

1. hPanel → **Node.js** → connect GitHub `Hardepp99/cws-website`, branch `main`.
2. **Application root:** `frontend`
3. **Install:** `npm ci`
4. **Build:** `npm run build`
5. **Start:** `npm start`
6. Paste environment variables from `deploy/hostinger/node.env.example`.
7. Assign domain **cwsindia.online** + enable SSL.

## 4. Verify

| Check | URL |
|-------|-----|
| API | https://cwsindia.online/api/v1/settings |
| Site | https://cwsindia.online |
| Admin | https://cwsindia.online/admin |

## Checklist

See [`deploy/hostinger/DEPLOY_CHECKLIST.md`](../deploy/hostinger/DEPLOY_CHECKLIST.md).

## More detail

- [NODE_CMS.md](./NODE_CMS.md) — local dev + env vars
- [PRODUCTION_DEPLOY.md](./PRODUCTION_DEPLOY.md) — generic production notes
