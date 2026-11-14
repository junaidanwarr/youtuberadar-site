/**
 * Client-side search, filter and sort for a catalogue grid.
 *
 * Markup contract (all inside one [data-catalog] element):
 *   [data-q]                  text input
 *   [data-filter="<key>"]     <select>, or a group of buttons with [data-value]
 *   [data-sort]               <select> with values: order | az | za
 *   [data-grid]               container of [data-item] elements
 *   [data-count]              live result count
 *   [data-empty]              shown when nothing matches
 *   [data-reset]              clears all filters
 *
 * Items expose data-search, data-title, data-order and one data-<key> per filter.
 * State is mirrored to the query string so filtered views can be linked.
 */
export function mountCatalog(root: HTMLElement) {
  const q = root.querySelector<HTMLInputElement>('[data-q]');
  const sort = root.querySelector<HTMLSelectElement>('[data-sort]');
  const grid = root.querySelector<HTMLElement>('[data-grid]');
  const count = root.querySelector<HTMLElement>('[data-count]');
  const empty = root.querySelector<HTMLElement>('[data-empty]');
  const filters = Array.from(root.querySelectorAll<HTMLElement>('[data-filter]'));
  if (!grid) return;

  const items = Array.from(grid.querySelectorAll<HTMLElement>('[data-item]'));
  const noun = root.dataset.noun ?? 'result';
  const state: Record<string, string> = {};

  const getFilter = (el: HTMLElement) =>
    el instanceof HTMLSelectElement
      ? el.value
      : (el.querySelector<HTMLElement>('[aria-pressed="true"]')?.dataset.value ?? '');

  const setFilter = (el: HTMLElement, value: string) => {
    if (el instanceof HTMLSelectElement) {
      el.value = Array.from(el.options).some((o) => o.value === value) ? value : '';
    } else {
      const buttons = Array.from(el.querySelectorAll<HTMLElement>('[data-value]'));
      const match = buttons.some((b) => b.dataset.value === value) ? value : '';
      buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.value === match)));
    }
  };

  function apply(pushUrl = true) {
    const term = (q?.value ?? '').trim().toLowerCase();
    const terms = term.split(/\s+/).filter(Boolean);
    for (const f of filters) state[f.dataset.filter!] = getFilter(f);

    let shown = 0;
    for (const it of items) {
      const hay = it.dataset.search ?? '';
      let ok = terms.every((t) => hay.includes(t));
      if (ok) {
        for (const [key, val] of Object.entries(state)) {
          if (!val) continue;
          const have = (it.dataset[key] ?? '').split(/[ |]/);
          // software values contain spaces; compare against the raw pipe list too
          const raw = (it.dataset[key] ?? '').split('|');
          if (!have.includes(val) && !raw.includes(val)) {
            ok = false;
            break;
          }
        }
      }
      it.hidden = !ok;
      if (ok) {
        shown++;
        it.classList.add('is-in');
      }
    }

    const mode = sort?.value ?? 'order';
    const sorted = [...items].sort((a, b) => {
      if (mode === 'az') return a.dataset.title!.localeCompare(b.dataset.title!);
      if (mode === 'za') return b.dataset.title!.localeCompare(a.dataset.title!);
      return Number(a.dataset.order) - Number(b.dataset.order);
    });
    sorted.forEach((el) => grid!.appendChild(el));

    if (count) count.textContent = `${shown} ${noun}${shown === 1 ? '' : 's'}`;
    if (empty) empty.hidden = shown !== 0;
    grid!.hidden = shown === 0;

    if (pushUrl) {
      const p = new URLSearchParams();
      if (term) p.set('q', term);
      for (const [k, v] of Object.entries(state)) if (v) p.set(k, v);
      if (mode !== 'order') p.set('sort', mode);
      const qs = p.toString();
      history.replaceState(null, '', qs ? `?${qs}` : location.pathname);
    }
  }

  // Restore from URL
  const params = new URLSearchParams(location.search);
  if (q && params.has('q')) q.value = params.get('q')!;
  for (const f of filters) setFilter(f, params.get(f.dataset.filter!) ?? '');
  if (sort && params.has('sort')) sort.value = params.get('sort')!;

  let timer = 0;
  q?.addEventListener('input', () => {
    clearTimeout(timer);
    timer = window.setTimeout(apply, 90);
  });
  sort?.addEventListener('change', () => apply());
  for (const f of filters) {
    if (f instanceof HTMLSelectElement) f.addEventListener('change', () => apply());
    else
      f.addEventListener('click', (e) => {
        const b = (e.target as Element).closest<HTMLElement>('[data-value]');
        if (!b) return;
        setFilter(f, b.dataset.value ?? '');
        apply();
      });
  }
  root.querySelectorAll<HTMLElement>('[data-reset]').forEach((b) =>
    b.addEventListener('click', () => {
      if (q) q.value = '';
      if (sort) sort.value = 'order';
      filters.forEach((f) => setFilter(f, ''));
      apply();
      q?.focus();
    }),
  );

  apply(false);
  root.classList.add('is-ready');
}

document.querySelectorAll<HTMLElement>('[data-catalog]').forEach(mountCatalog);
