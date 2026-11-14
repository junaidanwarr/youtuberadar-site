import type { Category } from './types';

/**
 * Category taxonomy. Add a row here and the category appears across the site:
 * homepage grid, niche filters, template filters.
 */
export const categories: Category[] = [
  {
    slug: 'health',
    name: 'Health',
    description: 'Evidence-led explainers on the body, sleep, nutrition and longevity.',
    hue: 158,
    glyph: 'pulse',
    sourcingNote:
      'Health niches are researched against medical and scientific sources. Nothing here is medical advice, and creators are responsible for meeting YouTube’s health content policies.',
  },
  {
    slug: 'fitness',
    name: 'Fitness',
    description: 'Training science, strength standards and programme breakdowns.',
    hue: 20,
    glyph: 'bars',
  },
  {
    slug: 'true-crime',
    name: 'True Crime',
    description: 'Case files and investigations, told from the public record.',
    hue: 350,
    glyph: 'target',
    sourcingNote:
      'True crime involves real people. Research relies on court records and established reporting, and avoids speculation about anyone not convicted.',
  },
  {
    slug: 'history',
    name: 'History',
    description: 'Archival storytelling, forgotten events and everyday life in the past.',
    hue: 40,
    glyph: 'column',
  },
  {
    slug: 'celebrity',
    name: 'Celebrity',
    description: 'Careers, eras and the business behind public figures.',
    hue: 305,
    glyph: 'star',
    sourcingNote:
      'Celebrity niches are limited to documented, on-the-record material. Rumour and private-life speculation are out of scope.',
  },
  {
    slug: 'automotive',
    name: 'Automotive',
    description: 'Engineering stories, model histories and how the industry works.',
    hue: 210,
    glyph: 'wheel',
  },
  {
    slug: 'technology',
    name: 'Technology',
    description: 'How products, chips, networks and software actually work.',
    hue: 222,
    glyph: 'chip',
  },
  {
    slug: 'finance',
    name: 'Finance',
    description: 'Money mechanics, markets and economic history, explained plainly.',
    hue: 145,
    glyph: 'chart',
    sourcingNote:
      'Finance niches are educational. They are not investment advice, and no return of any kind is implied.',
  },
  {
    slug: 'business',
    name: 'Business',
    description: 'Company stories, strategy teardowns and how industries make money.',
    hue: 235,
    glyph: 'grid',
  },
  {
    slug: 'science',
    name: 'Science',
    description: 'Physics, space, biology and the questions people keep asking.',
    hue: 190,
    glyph: 'atom',
  },
  {
    slug: 'luxury',
    name: 'Luxury',
    description: 'Craft, heritage and the economics of the world’s most expensive things.',
    hue: 48,
    glyph: 'gem',
  },
  {
    slug: 'documentary',
    name: 'Documentary',
    description: 'Long-form, narrated deep dives built on research and archive.',
    hue: 262,
    glyph: 'reel',
  },
  {
    slug: 'education',
    name: 'Education',
    description: 'Structured explainers that teach one idea properly.',
    hue: 200,
    glyph: 'book',
  },
  {
    slug: 'lifestyle',
    name: 'Lifestyle',
    description: 'Homes, habits, travel and the way people choose to live.',
    hue: 330,
    glyph: 'sun',
  },
  {
    slug: 'entertainment',
    name: 'Entertainment',
    description: 'Film, television, games and the stories behind how they were made.',
    hue: 280,
    glyph: 'play',
  },
];

export const categoryBySlug = (slug: string) => categories.find((c) => c.slug === slug);
