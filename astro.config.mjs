// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://<user>.github.io/madina
const SITE = process.env.SITE_URL ?? 'https://zairush8877-sys.github.io';
const BASE = process.env.BASE_PATH ?? '/madina';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'ignore',
  integrations: [sitemap()],
  image: {
    // Local sharp service; formats are chosen per <Image /> call.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: { inlineStylesheets: 'auto' },
});
