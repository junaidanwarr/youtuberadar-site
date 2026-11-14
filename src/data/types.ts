/**
 * Content model for YouTube Radar.
 *
 * Data-integrity rule: every statement shown on a niche page carries an
 * evidence level. Nothing is rendered as fact unless it is `verified`
 * and has a source attached.
 */

/** How much weight a reader should put on a statement. */
export type Evidence =
  | 'verified' // checked against a cited source on the research date
  | 'estimate' // derived from data, method stated, not an exact figure
  | 'editorial' // our qualitative assessment; an opinion, not a measurement
  | 'pending'; // not researched yet; no claim is being made

export interface Source {
  label: string;
  url: string;
  /** ISO date the source was last checked. */
  checked?: string;
}

export interface Statement {
  text: string;
  evidence: Evidence;
  /** Index into the record's `sources` array, when evidence is verified/estimate. */
  source?: number;
}

export interface NicheSection {
  id:
    | 'market'
    | 'audience'
    | 'subniches'
    | 'ideas'
    | 'competition'
    | 'monetization'
    | 'formats';
  title: string;
  statements: Statement[];
}

export type RecordStatus = 'demo' | 'published';

export interface Niche {
  slug: string;
  title: string;
  category: string; // Category.slug
  summary: string;
  intro: string;
  /** `demo` records illustrate the format only and contain no research data. */
  status: RecordStatus;
  /** ISO date; null until real research is recorded. */
  researchDate: string | null;
  sections: NicheSection[];
  sources: Source[];
  /** Template slugs. */
  relatedTemplates: string[];
  /** Position on the radar sort ("editor's order"); lower comes first. */
  order: number;
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  /** Hue in degrees, used to tint the card's light. */
  hue: number;
  /** Glyph id rendered by CategoryGlyph. */
  glyph: string;
  /** Editorial caution shown on every niche in the category, if any. */
  sourcingNote?: string;
}

export interface Template {
  slug: string;
  name: string;
  description: string;
  categories: string[]; // Category.slug
  format: 'Long-form' | 'Shorts' | 'Both';
  style: string;
  intendedUse: string;
  /** Software the template is planned for. Final list confirmed at publication. */
  software: string[];
  includes: string[];
  fileFormats: string[];
  status: RecordStatus;
  /** Visual preset for the generated preview. */
  /** Real preview image: an https:// URL or a site path. Replaces the drawn illustration. */
  image?: string;
  preview: 'timeline' | 'lowerthird' | 'map' | 'docu' | 'counter' | 'split' | 'caption' | 'chart' | 'title';
  hue: number;
  order: number;
}
