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

Весь текст сайта — в одном файле: **`src/content/site.ts`**.
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
и ссылка `tel:`, и ссылка на WhatsApp.

## Как добавить видео

Секция с видео уже написана, но выключена — файла пока нет.

1. Положите ролик и кадр-постер в `public/video/`.
2. В `src/content/site.ts` в объекте `video` укажите:
   ```ts
   enabled: true,
   src: 'video/tour.mp4',
   poster: 'video/tour-poster.jpg',
   caption: 'Короткая подпись под роликом',
   ```

Перед публикацией ролик стоит пережать, чтобы он весил меньше ~6 МБ:

```bash
ffmpeg -i исходник.mp4 -vcodec libx264 -crf 26 -preset slow \
       -movflags +faststart public/video/tour.mp4
ffmpeg -ss 00:00:01 -i public/video/tour.mp4 -frames:v 1 \
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

Адрес сайта и подпапка заданы в `astro.config.mjs` (`site` и `base`).
Для своего домена поменяйте `site` на него, а `base` — на `'/'`
(или задайте переменные `SITE_URL` и `BASE_PATH` при сборке).

## Структура

```
src/
├─ content/site.ts     ← весь текст сайта
├─ layouts/Base.astro  ← <head>, meta, Open Graph, микроразметка
├─ components/         ← секции страницы
├─ pages/index.astro   ← порядок секций
├─ styles/             ← global.css (токены и типографика), fonts.css
├─ assets/photos/      ← портреты
├─ assets/fonts/       ← Cormorant Garamond (самохостинг)
└─ lib/url.ts          ← сборка путей с учётом base
```
