// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://<аккаунт>.github.io/madina.
// После переименования аккаунта в `djapueva` адрес станет
// https://djapueva.github.io/madina; когда подключите домен djapueva.ru —
// поменяйте SITE на 'https://djapueva.ru', а BASE на '/'.
const SITE = process.env.SITE_URL ?? 'https://djapueva.github.io';
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
