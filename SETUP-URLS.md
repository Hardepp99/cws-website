# CWS Website — Working URLs (Local WAMP)

Setup completed on **19 May 2026**.

## Public website (Next.js)

| URL | Description |
|-----|-------------|
| **http://localhost:3000** | Main site (Next.js frontend) |
| http://localhost:3000/website-development-zirakpur | Example service landing |
| http://localhost:3000/contact | Contact page |
| http://localhost:3000/blog | Blog |

Start (if not running):

```bash
cd C:\wamp64\www\cws-website\frontend
npm run dev
```

## WordPress CMS (headless backend)

| URL | Description |
|-----|-------------|
| **http://localhost/cws-cms/wp-admin** | WordPress admin |
| http://localhost/cws-cms/ | WordPress front (not used for public site) |
| http://localhost/cws-cms/index.php?graphql | GraphQL API |

### Admin login

- **Username:** `admin`
- **Password:** `CwsAdmin@2026`
- **Email:** info@cwsindia.online

Change the password after first login.

## Original PHP site (reference)

| URL | Description |
|-----|-------------|
| http://localhost/cws-website/php/ | Legacy PHP site |

## What was installed

- WordPress 6.x at `C:\wamp64\www\cws-cms\`
- MySQL database: `cws_cms`
- Plugins: **WPGraphQL**, **Advanced Custom Fields**, **CWS Headless**
- **18 service landing** posts seeded from your PHP data

## Edit content in WordPress

1. Log in: http://localhost/cws-cms/wp-admin  
2. **Site Settings** — logo, phone, colors (ACF Options)  
3. **Service Landings** — Zirakpur SEO pages  
4. **Pages** — Home and other pages  
5. **Posts** — Blog articles  

After saving, Next.js refreshes within ~60 seconds (ISR), or trigger manually:

`POST http://localhost:3000/api/revalidate?secret=cws-revalidate-dev-secret`

## Notes

- GraphQL uses `index.php?graphql` because WAMP pretty permalinks need `.htaccess` (now added under `cws-cms`).
- **ACF Pro** is not installed (free ACF only). Flexible homepage sections use Next.js fallback data until ACF Pro is added.
- Keep WAMP **Apache** and **MySQL** running (green icon in WAMP tray).
