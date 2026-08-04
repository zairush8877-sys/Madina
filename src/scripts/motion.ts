/**
 * Вся клиентская анимация сайта: появление секций при скролле,
 * 3D-наклон карточек и «магнитный» блик, следующий за курсором.
 * При prefers-reduced-motion ничего из этого не запускается.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Появление при скролле. Элементам внутри одной группы даётся
   каскадная задержка через CSS-переменную --reveal-delay. */
function initReveal(): void {
  const items = document.querySelectorAll<HTMLElement>('.reveal');
  if (reduced || !('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
  );
  items.forEach((el) => io.observe(el));
}

/* Лёгкий 3D-наклон карточки за курсором + позиция блика. */
function initTilt(): void {
  if (reduced || matchMedia('(hover: none)').matches) return;
  document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((card) => {
    let raf = 0;
    card.addEventListener('pointermove', (e) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--px', `${px * 100}%`);
        card.style.setProperty('--py', `${py * 100}%`);
        card.style.transform =
          `perspective(900px) rotateY(${(px - 0.5) * 6}deg) rotateX(${(0.5 - py) * 6}deg)`;
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}

initReveal();
initTilt();
