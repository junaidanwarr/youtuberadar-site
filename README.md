# YouTube Radar — website

Static, SEO-friendly site for **youtuberadar.com**. Astro + three.js, no UI framework.

```bash
npm install
npm run dev      # http://localhost:4330
npm run build    # outputs ./dist
npm run preview
```

## Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage with the 3D radar hero |
| `/niches/` | Niche catalogue: search, category filter, sort (state kept in the URL) |
| `/niches/[slug]/` | Niche detail, every statement evidence-tagged |
| `/templates/` | Template library: search, category / software / format filters |
| `/templates/[slug]/` | Template detail |
| `/about/` | Philosophy, self-service model, research standards |
| `/access/` | Membership / access structure (placeholders) |
| `/faq/` | FAQ with FAQPage structured data |

## Where things live

- `src/data/categories.ts` — category taxonomy. Add a row to add a category everywhere.
- `src/data/niches.ts` — niche records.
- `src/data/templates.ts` — template records.
- `src/data/types.ts` — the content model, including the evidence levels.
- `src/lib/access.ts` — the auth / entitlement / checkout seam and the offers list.
- `src/scripts/radar.ts` — the WebGL radar. `src/scripts/catalog.ts` — search and filters.
- `src/styles/global.css` — design tokens and shared components.

## Content status: everything is demonstration content

All 12 niches and 10 templates have `status: 'demo'`. They show the structure and
contain **no statistics**. Demo detail pages are `noindex` and excluded from the sitemap.

### Publishing a real niche

1. In `src/data/niches.ts`, write the record with `status: 'published'` and a `researchDate`.
2. Replace `pending` statements with `verified` or `estimate` statements, each with a
   `source` index pointing into the record's `sources` array.
3. Keep opinion as `editorial`. Never present an estimate as verified.
4. Once real records exist, remove the sitemap `filter` in `astro.config.mjs`.

Evidence levels: `verified` (checked against a cited source on the research date),
`estimate` (derived, method stated), `editorial` (qualitative opinion), `pending` (no claim made).

## Not connected yet (by design)

`getAccessProvider()` in `src/lib/access.ts` returns `null`, so the site shows
"not yet available" states and never simulates a payment, login or download.
To go live, implement the `AccessProvider` interface (for example Stripe Checkout plus
an auth backend), return it from `getAccessProvider()`, and fill `offers` with real
products and prices. Entitlement checks and downloads need a server or serverless
functions; switch Astro to an adapter (`@astrojs/vercel`, `@astrojs/cloudflare`, …) for those routes.

## Deploying to youtuberadar.com

The build is plain static files in `dist/`. It works on Vercel (`vercel.json` included),
Netlify or Cloudflare Pages (`public/_headers` included), or any static host.
Build command `npm run build`, output directory `dist`. Then point the domain's DNS at the host.

Before launch: decide prices and offers, connect checkout, publish real niche records,
add Terms / Privacy / Refund pages, and replace `public/og.svg` with a PNG (some social
platforms do not render SVG previews).
