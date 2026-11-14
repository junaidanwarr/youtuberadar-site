/** Site-wide progressive enhancement: reveals, card tilt, nav. */

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;

/* ---- Scroll reveal ---- */
const reveals = document.querySelectorAll<HTMLElement>('.reveal');
if (reduce || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      }
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
  );
  reveals.forEach((el) => io.observe(el));

  // Belt and braces: observers can be throttled in background tabs and embedded
  // views, so also reveal on scroll with a direct measurement. Content must
  // never stay hidden because a callback arrived late.
  let pending = Array.from(reveals);
  const sweep = () => {
    const limit = innerHeight * 0.95;
    pending = pending.filter((el) => {
      if (el.classList.contains('is-in')) return false;
      if (el.getBoundingClientRect().top < limit) {
        el.classList.add('is-in');
        io.unobserve(el);
        return false;
      }
      return true;
    });
    if (!pending.length) removeEventListener('scroll', sweep);
  };
  addEventListener('scroll', sweep, { passive: true });
  sweep();
}

/* ---- 3D tilt + cursor light on cards ---- */
if (finePointer && !reduce) {
  document.addEventListener(
    'pointermove',
    (ev) => {
      const card = (ev.target as Element | null)?.closest<HTMLElement>('.tilt');
      if (!card) return;
      const r = card.getBoundingClientRect();
      const px = (ev.clientX - r.left) / r.width;
      const py = (ev.clientY - r.top) / r.height;
      const max = Number(card.dataset.tilt ?? 7);
      card.classList.add('is-tilting');
      card.style.setProperty('--ry', `${(px - 0.5) * max}deg`);
      card.style.setProperty('--rx', `${(0.5 - py) * max}deg`);
      card.style.setProperty('--mx', `${px * 100}%`);
      card.style.setProperty('--my', `${py * 100}%`);
    },
    { passive: true },
  );
  document.addEventListener(
    'pointerout',
    (ev) => {
      const card = (ev.target as Element | null)?.closest<HTMLElement>('.tilt');
      if (!card || card.contains(ev.relatedTarget as Node | null)) return;
      card.classList.remove('is-tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
    },
    { passive: true },
  );
}

/* ---- Nav: scrolled state + mobile menu ---- */
const nav = document.querySelector<HTMLElement>('[data-nav]');
const toggle = document.querySelector<HTMLButtonElement>('[data-nav-toggle]');
const menu = document.querySelector<HTMLElement>('[data-nav-menu]');

if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', scrollY > 12);
  onScroll();
  addEventListener('scroll', onScroll, { passive: true });
}

if (toggle && menu) {
  const setOpen = (open: boolean) => {
    toggle.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('is-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  };
  toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) setOpen(false);
  });
  addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setOpen(false);
      toggle.focus();
    }
  });
  matchMedia('(min-width: 900px)').addEventListener('change', (e) => e.matches && setOpen(false));
}
