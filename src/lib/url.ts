/**
 * Собирает путь к файлу из `public/` с учётом `base` из astro.config.mjs.
 *
 * `import.meta.env.BASE_URL` может быть как `/madina`, так и `/madina/`
 * или `/` — склеивать его со строкой напрямую нельзя: получается
 * `/madinafavicon.svg`. Эта функция нормализует слэши на стыке.
 */
export function withBase(path: string): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  const rest = path.replace(/^\/+/, '');
  return `${base}/${rest}`;
}
