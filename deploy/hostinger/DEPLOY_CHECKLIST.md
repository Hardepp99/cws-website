# Hostinger Node + MySQL — deploy checklist

## Before deploy (local)

- [ ] MySQL dump `cws_cms` ready
- [ ] `data/uploads/` zipped for upload
- [ ] Code pushed to GitHub `main`

## Hostinger MySQL

- [ ] Database + user created
- [ ] SQL imported (phpMyAdmin)
- [ ] Tables `menus`, `pages`, `site_settings` have rows

## Hostinger Node.js app

- [ ] Repo connected, root folder **`frontend`**
- [ ] Node 20+ selected
- [ ] Install: `npm ci` | Build: `npm run build` | Start: `npm start`
- [ ] All env vars from `node.env.example` saved **before** build
- [ ] `NEXT_PUBLIC_SITE_URL=https://cwsindia.online` (exact, no trailing slash)
- [ ] `CWS_UPLOAD_DIR` points to uploaded media folder
- [ ] Domain + SSL enabled

## After deploy (live data)

- [ ] https://cwsindia.online/api/health → `"ok":true,"mode":"live"`
- [ ] https://cwsindia.online/api/v1/menus → menu JSON
- [ ] Homepage shows real sections from DB
- [ ] Change something in Admin → refresh site → change visible
- [ ] Admin password changed
- [ ] SMTP configured in Admin → Settings → Email

## Not used on Hostinger

- [ ] No PHP / no `cms/` in `public_html`
- [ ] No `CMS_API_URL` env var
