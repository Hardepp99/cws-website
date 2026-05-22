# Leads (Ask price & callback popup)

## WordPress

- Endpoint: `POST /wp-json/cws/v1/lead`
- Body (JSON): `source` (`ask_price` | `callback_popup`), `name`, `email`, `phone`, `message`, `service_interest`, `page_url`
- Submissions are stored as **`form_submission`** posts (same as contact form). View in **WP Admin → Form Submissions**.
- Emails go to **harpreet@cwsindia.online** and the address in **Settings → cws_contact_email** (default `info@cwsindia.online`) when they differ.

Configure SMTP on the server so `wp_mail()` delivers reliably (same as contact form).

## Next.js

- Proxy: `POST /api/lead` → forwards to WordPress when `NEXT_PUBLIC_WORDPRESS_URL` is set.

## SEO & content ethics

- **Do not** copy or lightly rewrite competitor sites. Add **original** service copy in WordPress (ACF/blocks) and use structured headings, internal links, and metadata (`buildMetadata`, JSON-LD where applicable).
- All page copy, SEO meta, service landings, and homepage sections are edited in **WordPress** (ACF + post content). The Next.js app loads them via GraphQL fields (`cwsHomepage`, `cwsPage`, etc.) — not from hardcoded JSON in the repo.
