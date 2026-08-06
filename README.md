# Мадина Джапуева — сайт дизайнера интерьеров

Одностраничный сайт-визитка на [Astro](https://astro.build). Статическая сборка,
без бэкенда — разворачивается на GitHub Pages.

## Откуда взят контент

Все тексты собраны из **8 голосовых сообщений** в папке Google Drive «Прайс»
(расшифрованы локально, faster-whisper). Портреты — оттуда же.

Два документа `Прайс общий` в той же папке **к сайту отношения не имеют**
(это чужой прайс-лист) и в проекте не используются. Аудиофайлы на сайт
не выкладываются — они послужили только источником текста.

## Запуск

```bash
npm install
npm run dev      # локальный сервер
npm run build    # сборка в dist/
npm run preview  # посмотреть собранный сайт
npm run check    # проверка типов
```

## Где править тексты

Почти весь текст сайта — в одном файле: **`src/content/site.ts`**.
Компоненты только отображают эти данные, вёрстку трогать не нужно.

| Что менять | Где |
|---|---|
| Заголовок, описание для поиска | `site.meta` |
| Имя, профессия, город | `site.person` |
| Первый экран | `site.hero` |
| Раздел «Обо мне» | `site.about` |
| Услуги (8 карточек) | `site.services` |
| Раздел «Подход» | `site.approach` |
| Цены | `site.pricing` |
| Телефон, WhatsApp | `site.contacts` |

Телефон задаётся один раз константой `PHONE_DIGITS` — из неё собираются
и ссылка `tel:`, и ссылка на WhatsApp. Цены тоже заданы один раз —
константами `PRICE_*` в начале файла.

Несколько строк живут не в `site.ts`, а прямо в компонентах:
заголовок и слова секции «Текстиль» — `src/components/LetterCloth.astro`
(константа `TEXT`), подпись «шторки» с крышами —
`src/components/CultureCurtain.astro`, заголовок секции «Услуги» —
`src/components/Services.astro`.

## Видео

Ролик лежит в `public/video/tour.mp4` (сжат до ~5 МБ из исходных 18,6 МБ),
постер — `tour-poster.jpg`. Управляется объектом `video` в `src/content/site.ts`:
там можно поменять заголовок, подпись или выключить секцию (`enabled: false`).

Чтобы заменить ролик, пережмите новый файл до ~6 МБ и положите на то же место:

```bash
ffmpeg -i исходник.mp4 -vcodec libx264 -crf 27 -preset slow \
       -movflags +faststart public/video/tour.mp4
ffmpeg -ss 00:00:02 -i public/video/tour.mp4 -frames:v 1 \
       public/video/tour-poster.jpg
```

## Как добавить портфолио

Фотографий проектов в исходной папке не было, поэтому раздела с портфолио
на сайте пока нет. Чтобы его добавить: положите фото в `src/assets/photos/`,
опишите проекты в `site.ts` и сделайте компонент по образцу
`src/components/Services.astro`, подключив его в `src/pages/index.astro`.

Изображения выводятся через `<Picture />` из `astro:assets` — Astro сам
сделает AVIF/WebP и нужные размеры. Исходники держите не шире ~1100 px:
из более крупных файлов Astro дополнительно генерирует тяжёлый фолбэк
в оригинальном размере.

## Публикация

Пуш в `main` запускает `.github/workflows/deploy.yml`, который собирает сайт
и публикует его на GitHub Pages. Один раз нужно включить Pages в настройках
репозитория: **Settings → Pages → Source → GitHub Actions**.

## Адрес сайта

### Шаг 1 — переименовать аккаунт (бесплатно)

GitHub → аватар справа вверху → **Settings → Account → Change username** →
ввести `djapueva`. Сайт станет открываться по адресу
`https://djapueva.github.io/Madina`. Старые ссылки на репозиторий GitHub
перенаправит автоматически.

### Шаг 2 — свой домен djapueva.ru (когда купите)

1. Купите домен у регистратора (reg.ru, nic.ru и т.п.) — на момент проверки
   `djapueva.ru` был свободен.
2. У регистратора добавьте DNS-записи:
   - четыре записи **A** для `djapueva.ru`:
     `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - запись **CNAME** для `www` → `djapueva.github.io`
3. В репозитории: **Settings → Pages → Custom domain** → `djapueva.ru`,
   дождитесь проверки и включите **Enforce HTTPS**.
4. В `astro.config.mjs` поменяйте `SITE` на `'https://djapueva.ru'`,
   а `BASE` на `'/'`; в `public/robots.txt` обновите адрес sitemap
   на `https://djapueva.ru/sitemap-index.xml`. Закоммитьте в `main`.

DNS обновляется от нескольких минут до суток — это нормально.

## Структура

```
src/
├─ content/site.ts     ← весь текст сайта
├─ layouts/Base.astro  ← <head>, meta, Open Graph, микроразметка
├─ components/         ← секции страницы
├─ pages/index.astro   ← порядок секций
├─ styles/             ← global.css (токены и типографика), fonts.css
├─ assets/photos/      ← портреты
├─ assets/fonts/       ← Unbounded (самохостинг)
└─ lib/url.ts          ← сборка путей с учётом base
```
