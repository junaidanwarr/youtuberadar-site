/**
 * Loads niche and template records pushed into /content by the data repo.
 *
 *   content/niches/<slug>.json
 *   content/templates/<slug>.json
 *
 * Every file is validated at build time. An invalid record FAILS THE BUILD
 * with a message naming the file and the field, so bad data can never reach
 * the live site. The rules here are the site's data-integrity promise in code:
 * a published niche needs a research date, and a statement marked verified or
 * estimate needs a source.
 *
 * The contract is documented in CONTENT-INTEGRATION.md.
 */
import { categories } from './categories';
import type { Evidence, Niche, NicheSection, Source, Statement, Template } from './types';

const EVIDENCE: Evidence[] = ['verified', 'estimate', 'editorial', 'pending'];
const SECTION_IDS: NicheSection['id'][] = [
  'market',
  'audience',
  'subniches',
  'ideas',
  'formats',
  'competition',
  'monetization',
];
const SECTION_TITLES: Record<NicheSection['id'], string> = {
  market: 'Market overview',
  audience: 'Audience characteristics',
  subniches: 'Sub-niche opportunities',
  ideas: 'Content ideas',
  formats: 'Content format recommendations',
  competition: 'Competition assessment',
  monetization: 'Monetization considerations',
};
const FORMATS = ['Long-form', 'Shorts', 'Both'];
const PREVIEWS = ['timeline', 'lowerthird', 'map', 'docu', 'counter', 'split', 'caption', 'chart', 'title'];
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;
const categorySlugs = new Set(categories.map((c) => c.slug));

type Raw = Record<string, unknown>;

class Checker {
  constructor(private file: string) {}
  fail(msg: string): never {
    throw new Error(`[content] ${this.file}: ${msg}`);
  }
  str(o: Raw, key: string, { optional = false, max = 2000 } = {}): string {
    const v = o[key];
    if (v === undefined || v === null) {
      if (optional) return '';
      this.fail(`"${key}" is required`);
    }
    if (typeof v !== 'string' || !v.trim()) this.fail(`"${key}" must be a non-empty string`);
    if (v.length > max) this.fail(`"${key}" is longer than ${max} characters`);
    return v.trim();
  }
  list(o: Raw, key: string, { optional = false } = {}): string[] {
    const v = o[key];
    if (v === undefined && optional) return [];
    if (!Array.isArray(v) || v.some((x) => typeof x !== 'string' || !x.trim()))
      this.fail(`"${key}" must be an array of non-empty strings`);
    return (v as string[]).map((x) => x.trim());
  }
  oneOf<T extends string>(o: Raw, key: string, allowed: readonly T[]): T {
    const v = o[key];
    if (typeof v !== 'string' || !allowed.includes(v as T))
      this.fail(`"${key}" must be one of: ${allowed.join(', ')}`);
    return v as T;
  }
  date(o: Raw, key: string): string {
    const v = this.str(o, key);
    if (!ISO_DATE.test(v) || Number.isNaN(Date.parse(v))) this.fail(`"${key}" must be a date as YYYY-MM-DD`);
    if (Date.parse(v) > Date.now() + 86_400_000) this.fail(`"${key}" is in the future`);
    return v;
  }
  categories(values: string[], key: string) {
    for (const c of values)
      if (!categorySlugs.has(c)) this.fail(`"${key}" has unknown category "${c}". Known: ${[...categorySlugs].join(', ')}`);
  }
}

const slugFromPath = (path: string) => path.split('/').pop()!.replace(/\.json$/, '');

function parseNiche(path: string, raw: Raw, index: number): Niche {
  const c = new Checker(path);
  const slug = slugFromPath(path);
  if (!SLUG.test(slug)) c.fail('file name must be a lowercase-hyphen slug, e.g. sleep-science.json');
  if (raw.slug !== undefined && raw.slug !== slug) c.fail(`"slug" (${String(raw.slug)}) must match the file name (${slug})`);

  const status = c.oneOf(raw, 'status', ['demo', 'published'] as const);
  const category = c.str(raw, 'category');
  c.categories([category], 'category');

  const sources: Source[] = (Array.isArray(raw.sources) ? raw.sources : []).map((s: Raw, i: number) => {
    const sc = new Checker(`${path} sources[${i}]`);
    const url = sc.str(s, 'url');
    if (!/^https?:\/\//.test(url)) sc.fail('"url" must start with http:// or https://');
    return { label: sc.str(s, 'label', { max: 300 }), url, checked: s.checked ? sc.date(s, 'checked') : undefined };
  });

  if (!Array.isArray(raw.sections) || !raw.sections.length) c.fail('"sections" must be a non-empty array');
  const seen = new Set<string>();
  const sections: NicheSection[] = (raw.sections as Raw[]).map((sec, si) => {
    const sc = new Checker(`${path} sections[${si}]`);
    const id = sc.oneOf(sec, 'id', SECTION_IDS);
    if (seen.has(id)) sc.fail(`section "${id}" appears twice`);
    seen.add(id);
    if (!Array.isArray(sec.statements) || !sec.statements.length) sc.fail('"statements" must be a non-empty array');
    const statements: Statement[] = (sec.statements as Raw[]).map((st, i) => {
      const tc = new Checker(`${path} sections[${si}] (${id}) statements[${i}]`);
      const evidence = tc.oneOf(st, 'evidence', EVIDENCE);
      const text = tc.str(st, 'text', { max: 1200 });
      const needsSource = evidence === 'verified' || evidence === 'estimate';
      if (needsSource && st.source === undefined) tc.fail(`a "${evidence}" statement must cite a "source" (index into sources)`);
      if (st.source !== undefined) {
        if (!Number.isInteger(st.source) || (st.source as number) < 0 || (st.source as number) >= sources.length)
          tc.fail(`"source" ${String(st.source)} is not a valid index into sources (0-${sources.length - 1})`);
      }
      if (status === 'demo' && needsSource) tc.fail('demo records may only contain editorial or pending statements');
      return { text, evidence, source: st.source as number | undefined };
    });
    return { id, title: typeof sec.title === 'string' && sec.title.trim() ? sec.title.trim() : SECTION_TITLES[id], statements };
  });
  // Keep sections in the site's fixed reading order.
  sections.sort((a, b) => SECTION_IDS.indexOf(a.id) - SECTION_IDS.indexOf(b.id));

  let researchDate: string | null = null;
  if (status === 'published') {
    researchDate = c.date(raw, 'researchDate');
    if (!sources.length) c.fail('a published niche needs at least one entry in "sources"');
  } else if (raw.researchDate) {
    researchDate = c.date(raw, 'researchDate');
  }

  return {
    slug,
    title: c.str(raw, 'title', { max: 90 }),
    category,
    summary: c.str(raw, 'summary', { max: 220 }),
    intro: c.str(raw, 'intro'),
    status,
    researchDate,
    sections,
    sources,
    relatedTemplates: c.list(raw, 'relatedTemplates', { optional: true }),
    order: typeof raw.order === 'number' ? raw.order : index,
  };
}

function parseTemplate(path: string, raw: Raw, index: number): Template {
  const c = new Checker(path);
  const slug = slugFromPath(path);
  if (!SLUG.test(slug)) c.fail('file name must be a lowercase-hyphen slug, e.g. case-file-timeline.json');
  if (raw.slug !== undefined && raw.slug !== slug) c.fail(`"slug" (${String(raw.slug)}) must match the file name (${slug})`);

  const cats = c.list(raw, 'categories');
  if (!cats.length) c.fail('"categories" needs at least one category');
  c.categories(cats, 'categories');

  const image = c.str(raw, 'image', { optional: true, max: 500 });
  if (image && !/^(https:\/\/|\/)/.test(image)) c.fail('"image" must be an https:// URL or a site path starting with /');
  const hue = typeof raw.hue === 'number' ? raw.hue : (categories.find((x) => x.slug === cats[0])?.hue ?? 262);
  if (hue < 0 || hue > 360) c.fail('"hue" must be between 0 and 360');

  return {
    slug,
    name: c.str(raw, 'name', { max: 80 }),
    description: c.str(raw, 'description', { max: 600 }),
    categories: cats,
    format: c.oneOf(raw, 'format', FORMATS) as Template['format'],
    style: c.str(raw, 'style', { max: 40 }),
    intendedUse: c.str(raw, 'intendedUse', { max: 80 }),
    software: c.list(raw, 'software'),
    includes: c.list(raw, 'includes'),
    fileFormats: c.list(raw, 'fileFormats'),
    status: c.oneOf(raw, 'status', ['demo', 'published'] as const),
    preview: raw.preview === undefined ? 'title' : (c.oneOf(raw, 'preview', PREVIEWS) as Template['preview']),
    image: image || undefined,
    hue,
    order: typeof raw.order === 'number' ? raw.order : index,
  };
}

function load<T>(files: Record<string, unknown>, parse: (path: string, raw: Raw, i: number) => T): T[] {
  return Object.keys(files)
    .sort()
    .map((path, i) => {
      const mod = files[path] as { default?: unknown };
      const raw = (mod && typeof mod === 'object' && 'default' in mod ? mod.default : mod) as Raw;
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error(`[content] ${path}: must contain one JSON object`);
      return parse(path, raw, i);
    });
}

export const pushedTemplates = load(import.meta.glob('/content/templates/*.json', { eager: true }), parseTemplate);
export const pushedNiches = load(import.meta.glob('/content/niches/*.json', { eager: true }), parseNiche);
