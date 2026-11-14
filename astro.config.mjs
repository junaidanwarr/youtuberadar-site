import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://youtuberadar.com',
  trailingSlash: 'always',
  integrations: [
    sitemap({
      // Demo niche/template detail pages are noindex, so keep them out of the
      // sitemap. Remove this filter once real records are published.
      filter: (page) => !/\/(niches|templates)\/[^/]+\/$/.test(new URL(page).pathname),
    }),
  ],
  build: { inlineStylesheets: 'auto' },
});
