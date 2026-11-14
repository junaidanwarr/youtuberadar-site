import type { Template } from './types';
import { pushedTemplates } from './load';

/**
 * TEMPLATE RECORDS
 *
 * All records are DEMONSTRATION records. They describe the planned shape of
 * the library. Software compatibility, included assets and file formats are
 * indicative and are confirmed when a real template file is published.
 * Previews are generated illustrations, not screenshots of a shipped product.
 */
const t = (x: Omit<Template, 'status' | 'order'>, i: number): Template => ({
  ...x,
  status: 'demo',
  order: i,
});

const demoTemplates: Template[] = [
  {
    slug: 'case-file-timeline',
    name: 'Case File Timeline',
    description:
      'A dated, document-led timeline system for investigations and company stories. Events slide in along a spine with room for a source line under each.',
    categories: ['true-crime', 'business', 'celebrity'],
    format: 'Long-form' as const,
    style: 'Investigative',
    intendedUse: 'Chronological reconstructions',
    software: ['Adobe Premiere Pro', 'Adobe After Effects'],
    includes: ['Timeline spine', 'Event cards', 'Document highlight frame', 'Source line'],
    fileFormats: ['.prproj', '.aep', '.mogrt'],
    preview: 'timeline' as const,
    hue: 350,
  },
  {
    slug: 'citation-lower-thirds',
    name: 'Citation Lower Thirds',
    description:
      'Lower thirds built for sourcing: study, author, year and a short link, so every claim on screen can carry its reference.',
    categories: ['health', 'science', 'education', 'true-crime'],
    format: 'Both' as const,
    style: 'Clean editorial',
    intendedUse: 'On-screen sourcing',
    software: ['Adobe Premiere Pro', 'DaVinci Resolve'],
    includes: ['Source lower third', 'Quote card', 'Disclaimer strip'],
    fileFormats: ['.mogrt', '.drfx'],
    preview: 'lowerthird' as const,
    hue: 158,
  },
  {
    slug: 'map-route-animator',
    name: 'Map Route Animator',
    description:
      'Animated routes, regions and markers for stories that move across geography: trade, cables, campaigns, journeys.',
    categories: ['history', 'technology', 'finance', 'documentary'],
    format: 'Long-form' as const,
    style: 'Cartographic',
    intendedUse: 'Geographic storytelling',
    software: ['Adobe After Effects'],
    includes: ['Route draw-on', 'Region highlight', 'Marker set', 'Scale and legend'],
    fileFormats: ['.aep'],
    preview: 'map' as const,
    hue: 210,
  },
  {
    slug: 'archive-documentary-kit',
    name: 'Archive Documentary Kit',
    description:
      'Frames, slow moves and credit lines for archival photographs and footage, with a built-in place for the image credit.',
    categories: ['history', 'documentary', 'science'],
    format: 'Long-form' as const,
    style: 'Archival',
    intendedUse: 'Photo and footage treatment',
    software: ['Adobe Premiere Pro', 'DaVinci Resolve', 'Final Cut Pro'],
    includes: ['Photo frames', 'Parallax move presets', 'Credit line', 'Chapter card'],
    fileFormats: ['.prproj', '.drp', '.fcpbundle'],
    preview: 'docu' as const,
    hue: 40,
  },
  {
    slug: 'counter-and-stat-pack',
    name: 'Counter and Stat Pack',
    description:
      'Counting numbers, gauges and progress meters for depth, distance, weight and time. You supply the figures and the source.',
    categories: ['fitness', 'science', 'automotive'],
    format: 'Both' as const,
    style: 'Data-forward',
    intendedUse: 'Numeric emphasis',
    software: ['Adobe After Effects', 'CapCut'],
    includes: ['Number counter', 'Gauge', 'Progress bar', 'Unit labels'],
    fileFormats: ['.aep', '.mogrt'],
    preview: 'counter' as const,
    hue: 190,
  },
  {
    slug: 'tier-ladder-system',
    name: 'Tier Ladder System',
    description:
      'A climbing-levels structure with a persistent progress rail, for “every level of” and ranked formats.',
    categories: ['fitness', 'celebrity', 'education', 'entertainment'],
    format: 'Long-form' as const,
    style: 'Structured',
    intendedUse: 'Levels and rankings',
    software: ['Adobe Premiere Pro', 'Adobe After Effects'],
    includes: ['Level cards', 'Progress rail', 'Transition set', 'End summary'],
    fileFormats: ['.prproj', '.aep'],
    preview: 'split' as const,
    hue: 20,
  },
  {
    slug: 'diagram-explainer-kit',
    name: 'Diagram Explainer Kit',
    description:
      'Callouts, leader lines, cutaway frames and labelled parts for explaining how a mechanism works.',
    categories: ['technology', 'automotive', 'health', 'luxury', 'science'],
    format: 'Long-form' as const,
    style: 'Technical',
    intendedUse: 'Mechanism explainers',
    software: ['Adobe After Effects', 'DaVinci Resolve'],
    includes: ['Callout set', 'Leader lines', 'Cutaway frame', 'Step indicator'],
    fileFormats: ['.aep', '.drfx'],
    preview: 'chart' as const,
    hue: 222,
  },
  {
    slug: 'animated-chart-builder',
    name: 'Animated Chart Builder',
    description:
      'Line, bar and area charts that build on cue, with axis labels and a mandatory source footer.',
    categories: ['finance', 'business', 'education'],
    format: 'Both' as const,
    style: 'Data-forward',
    intendedUse: 'Charts and trends',
    software: ['Adobe After Effects'],
    includes: ['Line chart', 'Bar chart', 'Area chart', 'Source footer'],
    fileFormats: ['.aep', '.mogrt'],
    preview: 'chart' as const,
    hue: 145,
  },
  {
    slug: 'cinematic-title-sequences',
    name: 'Cinematic Title Sequences',
    description:
      'Restrained openers and chapter titles with light sweeps and fine typography, for long-form documentaries.',
    categories: ['documentary', 'luxury', 'entertainment', 'lifestyle'],
    format: 'Long-form' as const,
    style: 'Cinematic',
    intendedUse: 'Openers and chapters',
    software: ['Adobe Premiere Pro', 'Final Cut Pro', 'DaVinci Resolve'],
    includes: ['Main title', 'Chapter title', 'End card'],
    fileFormats: ['.mogrt', '.fcpbundle', '.drfx'],
    preview: 'title' as const,
    hue: 262,
  },
  {
    slug: 'vertical-caption-system',
    name: 'Vertical Caption System',
    description:
      'Readable, word-timed captions and hook cards sized for vertical video, with safe areas marked.',
    categories: ['lifestyle', 'entertainment', 'fitness', 'education'],
    format: 'Shorts' as const,
    style: 'Bold',
    intendedUse: 'Short-form captions',
    software: ['CapCut', 'Adobe Premiere Pro'],
    includes: ['Caption styles', 'Hook card', 'Safe-area guide'],
    fileFormats: ['CapCut template', '.mogrt'],
    preview: 'caption' as const,
    hue: 330,
  },
].map(t);

/** Records pushed into /content/templates replace the demo set entirely. */
export const templates: Template[] = pushedTemplates.length ? pushedTemplates : demoTemplates;

export const templateBySlug = (slug: string) => templates.find((x) => x.slug === slug);

export const allSoftware = [...new Set(templates.flatMap((x) => x.software))].sort();
export const allStyles = [...new Set(templates.map((x) => x.style))].sort();
