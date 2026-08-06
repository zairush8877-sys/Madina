// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// GitHub Pages project site: https://<аккаунт>.github.io/Madina.
// Подпапка должна в точности совпадать с именем репозитория, включая
// заглавную M — пути на github.io чувствительны к регистру.
// После переименования аккаунта в `djapueva` адрес станет
// https://djapueva.github.io/Madina; когда подключите домен djapueva.ru —
// поменяйте SITE на 'https://djapueva.ru', а BASE на '/'.
const SITE = process.env.SITE_URL ?? 'https://zairush8877-sys.github.io';
const BASE = process.env.BASE_PATH ?? '/Madina';

export default defineConfig({
  site: SITE,
  base: BASE,
  // 'always' — как отдаёт GitHub Pages; иначе sitemap перечисляет
  // и «…/Madina», и «…/Madina/», а canonical ведёт через 301.
  trailingSlash: 'always',
  integrations: [sitemap()],
  image: {
    // Local sharp service; formats are chosen per <Image /> call.
    service: { entrypoint: 'astro/assets/services/sharp' },
  },
  build: { inlineStylesheets: 'auto' },
});
