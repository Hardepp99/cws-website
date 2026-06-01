# Node CMS (MySQL + Next.js)

All content, admin, and member APIs run inside the Next.js app at `/api/v1`.

## Project layout

```
cws-website/
├── frontend/              # Next.js site + API
│   └── src/server/        # MySQL repositories, dispatch router
├── database/              # schema.sql + migrations/
└── data/uploads/          # media files (gitignored)
```

Removed from the repo: `cms/` (PHP), `php/` (legacy site), `wordpress/`, root `index.php`.

## Local setup

1. MySQL database `cws_cms` with your data imported.
2. Copy [`frontend/.env.example`](../frontend/.env.example) → `frontend/.env.local`
3. Ensure `data/uploads/` exists (media files).
4. Run:

```bash
cd frontend
npm install
npm run dev
```

5. Test: http://localhost:3000/api/v1/settings

## API surface

Same paths as before, under your site origin:

- Public: `/api/v1/settings`, `/api/v1/homepage`, `/api/v1/blog`, …
- Admin: `/api/v1/admin/*` (also proxied at `/api/admin/cms/*` with cookie auth)
- Media files: `/api/v1/media/{id}/file?variant=medium`

## Features still being ported

Some admin routes may return `501` until ported from the old PHP CMS (Desimentor editor, CRM inbox, homepage section CRUD, multipart media upload, etc.). Track progress in git issues or extend `frontend/src/server/dispatch-cms.ts`.
