/**
 * Клиентское движение: появление секций при скролле, параллакс фигур
 * за курсором и при прокрутке, 3D-наклон карточек.
 * При prefers-reduced-motion ничего из этого не запускается.
 */

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Появление при скролле. */
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

/* Фигуры с [data-depth] плывут за курсором и слегка разъезжаются
   при прокрутке — каждая на свою глубину. Смещение пишется в CSS-переменные,
   чтобы не конфликтовать с keyframe-анимациями (те двигают `translate`,
   параллакс — `transform`). */
function initParallax(): void {
  if (reduced) return;
  const shapes = Array.from(document.querySelectorAll<HTMLElement>('[data-depth]'));
  if (!shapes.length) return;

  let mx = 0;
  let my = 0;
  let raf = 0;

  const apply = () => {
    raf = 0;
    const sy = window.scrollY;
    for (const el of shapes) {
      const depth = parseFloat(el.dataset.depth || '0.2');
      const dx = mx * depth * 46;
      const dy = my * depth * 46 + sy * depth * -0.12;
      el.style.transform = `translate3d(${dx}px, ${dy}px, 0)`;
    }
  };

  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(apply);
  };

  if (!matchMedia('(hover: none)').matches) {
    window.addEventListener('pointermove', (e) => {
      mx = (e.clientX / window.innerWidth) * 2 - 1;
      my = (e.clientY / window.innerHeight) * 2 - 1;
      schedule();
    });
  }
  window.addEventListener('scroll', schedule, { passive: true });
  schedule();
}

/* Лёгкий 3D-наклон карточки за курсором. */
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
        card.style.transform =
          `perspective(900px) rotateY(${(px - 0.5) * 5}deg) rotateX(${(0.5 - py) * 5}deg)`;
      });
    });
    card.addEventListener('pointerleave', () => {
      cancelAnimationFrame(raf);
      card.style.transform = '';
    });
  });
}

initReveal();
initParallax();
initTilt();
