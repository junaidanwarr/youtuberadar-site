import type { Niche, NicheSection, Source, Statement } from './types';
import { pushedNiches, pushedTemplates } from './load';

/**
 * NICHE RECORDS
 *
 * Every record below is a DEMONSTRATION record (`status: 'demo'`).
 * They show how a niche page is structured. They contain:
 *   - editorial framing (clearly tagged as opinion), and
 *   - "pending" slots where measured research will go.
 * They contain NO statistics, audience figures, revenue figures or scores.
 *
 * To publish a real niche: set `status: 'published'`, set `researchDate`,
 * replace pending statements with `verified` / `estimate` statements and
 * attach each one to an entry in `sources`.
 */

/** Primary policy pages every creator should read. Linked, not summarised. */
const platformReferences: Source[] = [
  {
    label: 'YouTube Help — YouTube Partner Program overview & eligibility',
    url: 'https://support.google.com/youtube/answer/72851',
  },
  {
    label: 'YouTube Help — Advertiser-friendly content guidelines',
    url: 'https://support.google.com/youtube/answer/6162278',
  },
  {
    label: 'YouTube — Community Guidelines',
    url: 'https://www.youtube.com/howyoutubeworks/policies/community-guidelines/',
  },
];

const ed = (text: string): Statement => ({ text, evidence: 'editorial' });
const pending = (text: string): Statement => ({ text, evidence: 'pending' });

interface DemoInput {
  slug: string;
  title: string;
  category: string;
  summary: string;
  intro: string;
  audience: string;
  subniches: string[];
  ideas: string[];
  formats: string[];
  competitionNote: string;
  monetizationNote: string;
  relatedTemplates: string[];
}

let counter = 0;

function demoNiche(d: DemoInput): Niche {
  const sections: NicheSection[] = [
    {
      id: 'market',
      title: 'Market overview',
      statements: [
        pending(
          'Size and direction of viewer demand for this topic. Published only with a dated source and the method used.',
        ),
        pending('Seasonality and the events that move interest in this niche.'),
      ],
    },
    {
      id: 'audience',
      title: 'Audience characteristics',
      statements: [
        ed(d.audience),
        pending('Age, region and device mix. Shown only where a public or first-party source supports it.'),
      ],
    },
    {
      id: 'subniches',
      title: 'Sub-niche opportunities',
      statements: d.subniches.map(ed),
    },
    {
      id: 'ideas',
      title: 'Content ideas',
      statements: d.ideas.map(ed),
    },
    {
      id: 'formats',
      title: 'Content format recommendations',
      statements: d.formats.map(ed),
    },
    {
      id: 'competition',
      title: 'Competition assessment',
      statements: [
        ed(d.competitionNote),
        pending(
          'Number and size of active channels, upload cadence and how recently new channels have broken through. Sampled on the research date.',
        ),
      ],
    },
    {
      id: 'monetization',
      title: 'Monetization considerations',
      statements: [
        ed(d.monetizationNote),
        pending(
          'Advertising rates for this topic. Rates vary by country, season and channel, so any figure will be published as a labelled estimate with its source, never as a promise.',
        ),
      ],
    },
  ];

  return {
    slug: d.slug,
    title: d.title,
    category: d.category,
    summary: d.summary,
    intro: d.intro,
    status: 'demo',
    researchDate: null,
    sections,
    sources: platformReferences,
    relatedTemplates: d.relatedTemplates,
    order: counter++,
  };
}

const demoNiches: Niche[] = [
  demoNiche({
    slug: 'sleep-science-explainers',
    title: 'Sleep Science Explainers',
    category: 'health',
    summary: 'What happens in the sleeping brain and body, explained from published research.',
    intro:
      'Sleep is a subject nearly everyone has a personal stake in, and one where the gap between popular advice and published research is wide. This niche is about closing that gap carefully: one mechanism, one question, one video.',
    audience:
      'Likely to skew towards adults actively trying to fix a problem (falling asleep, waking early, shift work) rather than casual browsers. That is an assumption to test, not a finding.',
    subniches: [
      'Mechanism explainers: circadian rhythm, sleep stages, sleep pressure.',
      'Myth audits: taking one popular claim and checking it against the literature.',
      'Sleep across life stages: infants, teenagers, older adults.',
      'Environment and habit: light, temperature, caffeine timing.',
    ],
    ideas: [
      'One-question episodes built around a single review paper, cited on screen.',
      'A recurring “what the study actually measured” segment.',
      'Timeline episodes that follow a single night from lights-out to waking.',
    ],
    formats: [
      'Narrated explainer with diagrammatic animation; on-screen citations for every claim.',
      'Keep a visible “not medical advice” line and point viewers to a clinician for symptoms.',
    ],
    competitionNote:
      'Health is a crowded category with large established channels. Differentiation is more likely to come from sourcing discipline than from topic selection.',
    monetizationNote:
      'Health content is subject to specific YouTube policies and advertiser guidelines. Read them before planning sponsorships or product mentions.',
    relatedTemplates: ['citation-lower-thirds', 'diagram-explainer-kit'],
  }),
  demoNiche({
    slug: 'strength-standards-explained',
    title: 'Strength Standards Explained',
    category: 'fitness',
    summary: 'Levels, benchmarks and training logic for people who want to know where they stand.',
    intro:
      'Lifters ask the same question in a hundred forms: how strong is strong? This niche turns benchmarks and programming principles into clear, comparable tiers.',
    audience:
      'Probably recreational lifters past the beginner stage who want context for their numbers. Unverified until audience research is recorded.',
    subniches: [
      'Tiered “levels of” breakdowns for a single lift or quality.',
      'Programme teardowns: why a well-known routine is built the way it is.',
      'Physiology explainers: adaptation, recovery, fatigue.',
    ],
    ideas: [
      'A ladder format that climbs from first session to elite, one rung per chapter.',
      'Side-by-side comparisons of two training approaches against the same goal.',
    ],
    formats: [
      'Tier-list and ladder structures with a persistent progress graphic.',
      'Voice-over with motion graphics; no on-camera presenter required.',
    ],
    competitionNote:
      'Presenter-led fitness channels dominate. A graphics-led, data-framed approach occupies a different lane.',
    monetizationNote:
      'Supplement and equipment sponsorships are common in fitness and carry disclosure obligations. Earnings depend on execution and are not predictable from the niche alone.',
    relatedTemplates: ['tier-ladder-system', 'counter-and-stat-pack'],
  }),
  demoNiche({
    slug: 'financial-fraud-case-files',
    title: 'Financial Fraud Case Files',
    category: 'true-crime',
    summary: 'White-collar cases reconstructed from court filings and regulatory records.',
    intro:
      'Fraud cases come with something most true crime lacks: a deep public paper trail. Indictments, judgments and regulator releases let a careful creator tell the story without leaning on speculation.',
    audience:
      'Likely overlaps true-crime viewers with business and finance audiences. This overlap is a hypothesis; it has not been measured.',
    subniches: [
      'Single-case reconstructions that follow the money step by step.',
      'Scheme explainers: how a specific type of fraud works mechanically.',
      'Aftermath episodes: what happened to the victims, the firm, the rules.',
    ],
    ideas: [
      'Build each episode around primary documents shown on screen.',
      'A fixed closing segment listing outcomes: charges, verdicts, sentences, appeals.',
    ],
    formats: [
      'Documentary narration over document highlights, timelines and flow diagrams.',
      'State clearly where a matter is alleged, pending or decided.',
    ],
    competitionNote:
      'Violent-crime storytelling is saturated. Document-driven financial cases appear less densely covered, but that needs sampling before it is stated as fact.',
    monetizationNote:
      'True crime can attract limited advertising depending on how it is handled. The advertiser-friendly guidelines are the reference point.',
    relatedTemplates: ['case-file-timeline', 'citation-lower-thirds'],
  }),
  demoNiche({
    slug: 'everyday-life-in-past-eras',
    title: 'Everyday Life in Past Eras',
    category: 'history',
    summary: 'What people ate, earned, wore and feared, era by era.',
    intro:
      'Most history content follows rulers and wars. This niche follows ordinary people: a day’s food, a week’s wage, a winter without heating. It is concrete, visual and endlessly extensible.',
    audience:
      'Assumed to be broad general-interest viewers rather than history specialists. To be confirmed.',
    subniches: [
      'Food and drink by period and region.',
      'Work, wages and the cost of living.',
      'Medicine, hygiene and survival.',
      'Childhood, schooling and family life.',
    ],
    ideas: [
      '“A day in the life” episodes anchored to one place and year.',
      'Object-led episodes: one tool, garment or dish and what it reveals.',
    ],
    formats: [
      'Archival photographs, paintings and maps with restrained motion.',
      'Credit every archive image; prefer public-domain and openly licensed collections.',
    ],
    competitionNote:
      'There are established channels in this space. The topic supply is very large, which leaves room for narrowly defined angles.',
    monetizationNote:
      'History is generally compatible with advertising. Image licensing is the main cost and risk to plan for.',
    relatedTemplates: ['archive-documentary-kit', 'map-route-animator'],
  }),
  demoNiche({
    slug: 'career-arc-retrospectives',
    title: 'Career Arc Retrospectives',
    category: 'celebrity',
    summary: 'The documented rise, pivots and reinventions of public careers.',
    intro:
      'A career has a shape: a break, a peak, a misstep, a return. This niche studies that shape using interviews, releases and on-the-record reporting, and leaves private lives alone.',
    audience:
      'Likely driven by existing fans of each subject, which makes audience composition vary from video to video. Not yet measured.',
    subniches: [
      'Era-by-era retrospectives of a single career.',
      'Comparative studies: two careers that started alike and diverged.',
      'The business side: deals, ownership, catalogue and brand decisions.',
    ],
    ideas: [
      'A consistent chapter structure so viewers know the format across subjects.',
      'Episodes built around one decision and its documented consequences.',
    ],
    formats: [
      'Narrated timeline with dated milestones.',
      'Use short, transformative excerpts and understand copyright and fair-use limits before publishing.',
    ],
    competitionNote:
      'Gossip-led celebrity content is abundant. Sourced, career-focused analysis is a narrower and more defensible position.',
    monetizationNote:
      'Third-party footage and music raise copyright claims that can redirect or remove revenue. Plan the edit around that constraint.',
    relatedTemplates: ['tier-ladder-system', 'case-file-timeline'],
  }),
  demoNiche({
    slug: 'engineering-failures-and-recalls',
    title: 'Engineering Failures and Recalls',
    category: 'automotive',
    summary: 'Why specific cars and components failed, from the engineering up.',
    intro:
      'Every recall has a root cause, a decision trail and a fix. This niche explains them with diagrams rather than drama, drawing on regulator filings and manufacturer documents.',
    audience:
      'Expected to appeal to owners, enthusiasts and engineering-curious viewers. An assumption until researched.',
    subniches: [
      'Single-component stories: one engine, gearbox or system.',
      'Model histories told through what went wrong and what was learned.',
      'How testing, regulation and recalls actually work.',
    ],
    ideas: [
      'Cutaway-style explainers of the failing part.',
      'A recurring “what the filing says” segment using the public record.',
    ],
    formats: [
      'Technical animation and annotated stills.',
      'Attribute every claim about a manufacturer to a document.',
    ],
    competitionNote:
      'Review and vlog formats dominate automotive. Engineering explainers are a distinct and more evergreen lane.',
    monetizationNote:
      'Automotive attracts tool, parts and insurance advertisers in general terms; what any single channel earns is not something this page will estimate without data.',
    relatedTemplates: ['diagram-explainer-kit', 'citation-lower-thirds'],
  }),
  demoNiche({
    slug: 'how-infrastructure-works',
    title: 'How Infrastructure Works',
    category: 'technology',
    summary: 'The cables, grids, data centres and networks nobody sees.',
    intro:
      'The modern world runs on systems most people never look at. This niche makes the invisible legible: where the internet physically goes, how power stays balanced, what a data centre actually contains.',
    audience:
      'Likely curious generalists and people working in adjacent technical fields. To be verified.',
    subniches: [
      'Internet backbone: subsea cables, exchanges, satellites.',
      'Power: generation, transmission, storage, grid balancing.',
      'Compute: chips, cooling, data-centre siting.',
      'Logistics: ports, rail, air freight.',
    ],
    ideas: [
      'Follow one unit through the system: a packet, a kilowatt-hour, a container.',
      'Map-led episodes that reveal a network layer by layer.',
    ],
    formats: [
      'Map and diagram animation with a calm, authoritative narration.',
      'Long-form suits the subject; chapters help retention on dense topics.',
    ],
    competitionNote:
      'Several high-production channels cover infrastructure. Quality expectations are high, which raises the bar for entry.',
    monetizationNote:
      'Technology topics are generally advertiser-friendly. Production cost per video is the constraint to model.',
    relatedTemplates: ['map-route-animator', 'diagram-explainer-kit'],
  }),
  demoNiche({
    slug: 'economic-history-explained',
    title: 'Economic History Explained',
    category: 'finance',
    summary: 'Booms, crashes and policies, and what they changed.',
    intro:
      'Economic history rewards patient explanation. Each crisis has a cause, a mechanism and a legacy, and the source material, from central bank archives to academic histories, is rich and public.',
    audience:
      'Assumed to be older, education-seeking viewers. This is a hypothesis and is labelled as such.',
    subniches: [
      'Single-event explainers: one bubble, default or currency crisis.',
      'Country studies: how one economy got to where it is.',
      'Ideas and institutions: central banks, trade systems, money itself.',
    ],
    ideas: [
      'Cause, mechanism, legacy as a fixed three-act structure.',
      'Chart-led episodes where one graph is built up line by line.',
    ],
    formats: [
      'Animated charts and maps with primary-source quotations.',
      'Keep it educational; avoid anything resembling investment recommendations.',
    ],
    competitionNote:
      'Finance is competitive, but much of it targets investing and personal finance. History-led explanation is a calmer corner.',
    monetizationNote:
      'Finance content is often described as commanding strong advertising rates. That is a general industry observation, not a measured figure for this niche, and it guarantees nothing.',
    relatedTemplates: ['animated-chart-builder', 'map-route-animator'],
  }),
  demoNiche({
    slug: 'company-rise-and-fall-teardowns',
    title: 'Company Rise-and-Fall Teardowns',
    category: 'business',
    summary: 'How companies won, and the specific decisions that undid them.',
    intro:
      'Corporate collapse is rarely sudden. This niche traces the strategy, the numbers and the turning points using annual reports, filings and contemporary reporting.',
    audience:
      'Likely professionals, students and business-curious viewers. Not yet researched.',
    subniches: [
      'Single-company teardowns from founding to failure or recovery.',
      'Industry shifts: how a whole sector was displaced.',
      'Decision studies: one acquisition, pivot or pricing change.',
    ],
    ideas: [
      'Open on the peak, then rewind; a structure that sets up the question early.',
      'A closing “what the filings show” summary with dated sources.',
    ],
    formats: [
      'Narration over charts, product imagery and document highlights.',
      'Distinguish reported facts from analysis in the script itself.',
    ],
    competitionNote:
      'A popular format with capable incumbents. Lesser-covered regions and industries are the obvious places to look.',
    monetizationNote:
      'Business audiences are attractive to software and service advertisers in general. No earnings figure is implied.',
    relatedTemplates: ['animated-chart-builder', 'case-file-timeline'],
  }),
  demoNiche({
    slug: 'deep-ocean-exploration',
    title: 'Deep Ocean Exploration',
    category: 'science',
    summary: 'Life, geology and technology below the reach of sunlight.',
    intro:
      'The deep sea offers genuine unknowns and extraordinary imagery, much of it released by research institutions. This niche pairs that footage with careful explanation.',
    audience:
      'Probably broad and international, given the visual nature of the subject. Unverified.',
    subniches: [
      'Depth-zone journeys from surface to trench.',
      'Species profiles grounded in published descriptions.',
      'Expedition and vehicle stories: how exploration is done.',
    ],
    ideas: [
      'A descending-depth structure with a persistent depth gauge.',
      'Episodes built around one expedition’s published findings.',
    ],
    formats: [
      'Institutional footage where licensing allows, plus diagrammatic animation.',
      'Check each footage source’s reuse terms; “publicly viewable” is not “free to use”.',
    ],
    competitionNote:
      'Depth-journey videos are a well-known format. Rigor and fresh source material are the differentiators.',
    monetizationNote:
      'Science is broadly advertiser-friendly. Footage licensing determines both cost and what can be monetised.',
    relatedTemplates: ['counter-and-stat-pack', 'archive-documentary-kit'],
  }),
  demoNiche({
    slug: 'watchmaking-craft',
    title: 'Watchmaking Craft',
    category: 'luxury',
    summary: 'Movements, complications and the economics of fine watchmaking.',
    intro:
      'Mechanical watchmaking is a world of small, explainable marvels. This niche focuses on how things are made and why they cost what they do, rather than on showing off ownership.',
    audience:
      'Likely enthusiasts and aspirational viewers. Composition has not been measured.',
    subniches: [
      'Complication explainers: chronograph, tourbillon, perpetual calendar.',
      'Maison histories and the reference models that defined them.',
      'Materials and finishing techniques.',
    ],
    ideas: [
      'Exploded-view animation of a single movement.',
      'One reference, one story: the history behind a specific model.',
    ],
    formats: [
      'Macro imagery with clean technical overlays and unhurried pacing.',
      'Avoid price speculation; cite list prices or auction results with dates when used.',
    ],
    competitionNote:
      'Dealer and collector channels are numerous. Educational, mechanism-first content is less common.',
    monetizationNote:
      'Luxury audiences are small but commercially interesting to brands. That is a general observation and not an income projection.',
    relatedTemplates: ['diagram-explainer-kit', 'cinematic-title-sequences'],
  }),
  demoNiche({
    slug: 'abandoned-megaprojects',
    title: 'Abandoned Megaprojects',
    category: 'documentary',
    summary: 'The cities, railways and machines that were started and never finished.',
    intro:
      'Unfinished megaprojects are stories of ambition meeting reality. Each one has plans, budgets, politics and a ruin, which together make natural long-form documentary material.',
    audience:
      'Expected to overlap engineering, history and urban-exploration interests. To be confirmed.',
    subniches: [
      'Single-project documentaries.',
      'Regional series: one country’s unfinished ambitions.',
      'Thematic sets: airports, canals, towers, new capitals.',
    ],
    ideas: [
      'Plan versus reality: open with the original rendering, end with the site today.',
      'A cost and timeline tracker that runs through the episode.',
    ],
    formats: [
      'Long-form narration with maps, satellite imagery and archive plans.',
      'Confirm satellite and map imagery licences before use.',
    ],
    competitionNote:
      'High-production documentary channels set expectations here. Under-covered regions are the opening.',
    monetizationNote:
      'Long-form documentary can support mid-roll advertising. Research cost per episode is significant and should be planned for.',
    relatedTemplates: ['archive-documentary-kit', 'map-route-animator', 'cinematic-title-sequences'],
  }),
];

/**
 * Records pushed into /content/niches replace the demo set entirely.
 * Related-template links that point at a template that does not exist are dropped.
 */
const knownTemplates = new Set(pushedTemplates.map((t) => t.slug));
export const niches: Niche[] = pushedNiches.length
  ? pushedNiches.map((n) => ({
      ...n,
      relatedTemplates: pushedTemplates.length ? n.relatedTemplates.filter((s) => knownTemplates.has(s)) : n.relatedTemplates,
    }))
  : demoNiches;

export const nicheBySlug = (slug: string) => niches.find((n) => n.slug === slug);
