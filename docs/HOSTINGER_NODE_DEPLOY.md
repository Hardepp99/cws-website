# Hostinger deploy — Node.js app + MySQL (live data)

One **Node.js** application serves the site. Every page loads **fresh content from MySQL** on each visit (not frozen at build time).

---

## Architecture

```
Visitor → cwsindia.online (Hostinger Node.js)
              ├── Next.js pages (SSR, force-dynamic)
              ├── /api/v1/*  → MySQL
              └── /admin     → MySQL
```

No PHP. No `cms/` folder on the server.

---

## Part 1 — Hostinger MySQL

1. hPanel → **Databases** → create database + user (note name, user, password).
2. **phpMyAdmin** → Import your `cws_cms` SQL dump from local WAMP.
3. Confirm tables exist: `menus`, `pages`, `site_settings`, `blog_posts`, etc.

---

## Part 2 — Upload media

On your PC you have `data/uploads/` (images). Upload to the server path you will set as `CWS_UPLOAD_DIR`, e.g.:

```
/home/USERNAME/domains/cwsindia.online/nodejs/data/uploads/
```

Create folder if missing; permissions **755** or **775**.

---

## Part 3 — Node.js application

1. hPanel → **Websites** → your domain → **Node.js** → **Create application**.
2. **Connect GitHub:** `Hardepp99/cws-website`, branch `main`.
3. **Application root:** `frontend` (important).
4. **Node.js version:** 20.x or 22.x.
5. Commands:

| Step | Command |
|------|---------|
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm start` |

6. Assign domain **cwsindia.online** and enable **SSL**.

---

## Part 4 — Environment variables (hPanel → Node.js → Environment)

Copy from [`deploy/hostinger/node.env.example`](../deploy/hostinger/node.env.example):

```env
NODE_ENV=production
NEXT_PUBLIC_SITE_URL=https://cwsindia.online
CWS_NODE_CMS=1

MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=u123456789_cws_cms
MYSQL_USER=u123456789_cwsuser
MYSQL_PASSWORD=your-strong-password

CWS_UPLOAD_DIR=/home/u123456789/domains/cwsindia.online/nodejs/data/uploads

REVALIDATE_SECRET=long-random-string-here
CWS_SESSION_SECRET=another-long-random-string

GOOGLE_OAUTH_CLIENT_ID=
GOOGLE_PLACES_API_KEY=
```

Set these **before** clicking Deploy / Build.

Do **not** set `CMS_API_URL` (removed with PHP).

---

## Part 5 — Deploy & verify

1. Trigger **Deploy** in Hostinger Node panel.
2. Wait for build to finish.
3. Open in browser:

| URL | Expected |
|-----|----------|
| https://cwsindia.online/api/health | `{"ok":true,"mode":"live",...}` |
| https://cwsindia.online/api/v1/menus | JSON with menu items |
| https://cwsindia.online/api/v1/settings | Site settings JSON |
| https://cwsindia.online | Homepage with DB sections |
| https://cwsindia.online/admin | Admin login |

4. Change default admin password after first login.

---

## Live data (not static)

- Root layout uses `dynamic = "force-dynamic"` and `revalidate = 0`.
- CMS fetches use `cache: "no-store"`.
- Editing in **Admin** updates MySQL; refresh the public page to see changes.
- Optional: call `/api/revalidate` after saves (uses `REVALIDATE_SECRET`) if you add hooks later.

Build on Hostinger only compiles code; it does **not** bake page HTML from your database.

---

## Admin email (SMTP)

In production: **Admin → Settings → Email** — use Hostinger SMTP:

- Host: `smtp.hostinger.com`
- Port: `465` (SSL) or `587` (TLS)
- User: `info@cwsindia.online`

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `/api/health` → `ok: false` | Wrong MySQL credentials or database not imported |
| Menus empty | Check `menus` table in phpMyAdmin; redeploy after JSON fix |
| Images 404 | `CWS_UPLOAD_DIR` wrong or uploads not copied |
| Old content after edit | Hard refresh; confirm you edit on live admin, not local |
| Build fails | All env vars set before build; check build logs |

---

## Checklist

See [`deploy/hostinger/DEPLOY_CHECKLIST.md`](../deploy/hostinger/DEPLOY_CHECKLIST.md).
