# CWS Website — Next.js + Node CMS

Creative Web Solutions ([cwsindia.online](https://cwsindia.online)) — **Next.js** frontend with a **Node.js content API** and **MySQL**.

## Structure

```
cws-website/
├── frontend/           # Next.js (public site, /admin, /api/v1)
├── database/           # MySQL schema + migrations
├── data/uploads/       # Media files (local / production)
├── docs/               # Deploy guides
└── deploy/hostinger/   # Env templates for Hostinger
```

## Quick start

1. Import database `cws_cms` into MySQL.
2. Copy `frontend/.env.example` → `frontend/.env.local` and set MySQL credentials.
3. Put media in `data/uploads/` (or set `CWS_UPLOAD_DIR`).
4. Run:

```bash
cd frontend
npm install
npm run dev
```

- Site: http://localhost:3000  
- API: http://localhost:3000/api/v1/settings  
- Admin: http://localhost:3000/admin  

## Deploy (Hostinger Node)

See [docs/HOSTINGER_DEPLOY.md](docs/HOSTINGER_DEPLOY.md).

## Docs

- [docs/NODE_CMS.md](docs/NODE_CMS.md) — API and local config
- [docs/PRODUCTION_DEPLOY.md](docs/PRODUCTION_DEPLOY.md) — production env vars
