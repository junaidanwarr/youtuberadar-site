# Content integration

How a separate data repository publishes niches and templates to this website.

## How it works

1. The data repo holds one JSON file per record in `niches/` and `templates/`.
2. On push, its GitHub Action copies those files into this repo's `content/niches/` and
   `content/templates/`, builds the site to validate them, and commits.
3. The commit to this repo triggers the host (Vercel, Netlify, Cloudflare Pages) to rebuild and publish.

The Action to copy into the data repo is `docs/examples/push-to-site.yml`. It needs one secret,
`SITE_REPO_TOKEN`: a fine-grained personal access token scoped to this repository only, with
**Contents: Read and write**.

The sync is a mirror. A file deleted in the data repo is deleted here, and its page disappears.

## Everything pushed is public

This is a static site with no login. Every field in every pushed file is published and can be read
by anyone, including in the page source. **Push only what should be visible without paying.**

Paid material (the full research file, the template project files) must not go through this
channel. It belongs in private storage, delivered through the access provider described in
`src/lib/access.ts` once checkout is connected.

## Demo records

While `content/niches/` has no `.json` files the site shows its built-in demonstration niches.
The first pushed niche replaces the whole demo set. Templates work the same way, independently.

## Niche file: `content/niches/<slug>.json`

The file name is the URL: `sleep-science.json` becomes `/niches/sleep-science/`.
Lowercase letters, digits and hyphens only. Full example: `docs/examples/niche.example.json`.

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Up to 90 characters |
| `category` | yes | A category slug, see below |
| `status` | yes | `published` or `demo` |
| `researchDate` | if published | `YYYY-MM-DD`, not in the future |
| `summary` | yes | Up to 220 characters |
| `intro` | yes | One paragraph |
| `sources` | if published | Array of `{ label, url, checked? }`; `url` must be http(s) |
| `sections` | yes | Array of `{ id, statements, title? }` |
| `relatedTemplates` | no | Template slugs; unknown slugs are dropped |
| `order` | no | Lower comes first in "Editor's order" |

Section `id` values, each used at most once: `market`, `audience`, `subniches`, `ideas`, `formats`,
`competition`, `monetization`. They are displayed in that order whatever order you send.

Each statement is `{ "text": "...", "evidence": "...", "source": 0 }`.

| `evidence` | Meaning | `source` |
| --- | --- | --- |
| `verified` | Checked against a cited source on the research date | required |
| `estimate` | Derived from data; say the method in the text | required |
| `editorial` | Your qualitative assessment | optional |
| `pending` | Not researched; no claim made | optional |

`source` is the zero-based position in the record's `sources` array.

## Template file: `content/templates/<slug>.json`

Full example: `docs/examples/template.example.json`.

| Field | Required | Notes |
| --- | --- | --- |
| `name` | yes | Up to 80 characters |
| `status` | yes | `published` or `demo` |
| `description` | yes | Up to 600 characters |
| `categories` | yes | One or more category slugs |
| `format` | yes | `Long-form`, `Shorts` or `Both` |
| `style` | yes | e.g. `Archival`, `Data-forward` |
| `intendedUse` | yes | Short phrase |
| `software` | yes | Array of software names; these become the software filter |
| `includes` | yes | Array of included assets |
| `fileFormats` | yes | Array, e.g. `.prproj` |
| `image` | no | Preview image: an `https://` URL, or a site path such as `/previews/x.jpg` |
| `preview` | no | Drawn illustration used when there is no `image`: `timeline`, `lowerthird`, `map`, `docu`, `counter`, `split`, `caption`, `chart`, `title` |
| `hue` | no | 0-360 accent colour; defaults to the first category's colour |
| `order` | no | Lower comes first |

## Category slugs

`health`, `fitness`, `true-crime`, `history`, `celebrity`, `automotive`, `technology`, `finance`,
`business`, `science`, `luxury`, `documentary`, `education`, `lifestyle`, `entertainment`.

To add a category, add a row to `src/data/categories.ts` in this repo first.

## Rules the build enforces

A record that breaks a rule fails the build, and the error names the file and field. Nothing is
published from a failed build, so the live site keeps its previous content.

- Unknown category, bad slug, missing required field, wrong type, or over-length text.
- A `published` niche without a `researchDate` or without any `sources`.
- A `verified` or `estimate` statement without a valid `source`.
- A `demo` niche containing `verified` or `estimate` statements.
- A research or source date in the future.

The build cannot check that a figure is true. It only guarantees that every factual claim points at
a dated source a reader can follow.

## Search engines

Detail pages for `demo` records are `noindex`; `published` records are indexable. The sitemap still
excludes all detail pages: remove the `filter` in `astro.config.mjs` once real records are live.

## Testing locally

Drop a file into `content/niches/` or `content/templates/` and run:

```bash
npm run build
```
