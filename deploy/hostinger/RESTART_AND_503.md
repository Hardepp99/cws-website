# Hostinger — Node restart + 503 fix

**Deploy “Completed”** = build OK. **503 on `/api/ping`** = browser is **not** reaching your running Node app.

---

## Node restart (hPanel)

1. Login **hPanel** → **Websites**
2. Open **cws-website** (Node.js app — not an old PHP-only site)
3. On the dashboard, find status **Running** (green)
4. Click **Restart** (next to Running / in the top actions)

**After changing env variables:** use **Settings and redeploy** → **Save and Redeploy** (restart alone may not reload env).

### SSH (optional)

```bash
cd domains/cwsindia.online/public_html
# or the path Hostinger shows as “Application root” (often .../nodejs/frontend)
touch tmp/restart.txt
```

---

## 503 but deploy success — check these first

### 1. Domain linked to the Node app

In the Node.js website dashboard, copy the **temporary URL** (e.g. `https://something.hostingersite.com`).

| URL | Meaning |
|-----|---------|
| Temp URL → `/api/ping` works | Node app is fine; **cwsindia.online** is pointed at the **wrong** site (PHP / old hosting). |
| Temp URL → also 503 | Runtime crash — open **Runtime logs** (below). |
| `cwsindia.online` → 503, temp URL OK | Fix domain: assign **cwsindia.online** to this Node.js website in hPanel. |

### 2. Application root

Must be **`frontend`** (folder that contains `package.json` with `"next"`).

| Field | Value |
|-------|--------|
| Root | `frontend` |
| Install | `npm ci` |
| Build | `npm run build` |
| Start | `npm run start` |

### 3. Runtime logs (most important)

**Website dashboard → Deployments → current deploy → Runtime logs**  
(or **Logs** / `stderr.log` in File Manager under the app folder)

Look for:

- `failed to launch next` / `ENOENT`
- `Cannot find module`
- `EADDRINUSE`
- `JavaScript heap out of memory`
- MySQL errors at **startup** (rare for `/api/ping`)

Paste the **last 20 lines** when asking for help.

### 4. Env at build + runtime

Required before **build**:

- `NODE_ENV=production`
- `NEXT_PUBLIC_SITE_URL=https://cwsindia.online`
- `MYSQL_DATABASE=...` (or `DB_NAME`)

Runtime also needs MySQL vars (for homepage; **not** for `/api/ping`).

Use `MYSQL_HOST=127.0.0.1` (not `localhost`).

---

## Quick tests after restart

1. `https://YOUR-TEMP-URL/api/ping` → `{"ok":true,...}`
2. `https://cwsindia.online/api/ping` → same JSON
3. `https://cwsindia.online/api/health` → `ok: true` if DB is correct

---

## hPanel settings screenshot checklist

- [ ] Website type = **Node.js Web App** (Git: `Hardepp99/cws-website`, branch `main`)
- [ ] Latest deploy = **Current** (`48eb4f3` or newer)
- [ ] Status = **Running** (then **Restart** once)
- [ ] Domain **cwsindia.online** attached to **this** app
- [ ] No second “Website” for the same domain on PHP-only hosting
