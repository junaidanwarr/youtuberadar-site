/**
 * ACCESS / COMMERCE INTEGRATION SEAM
 *
 * Nothing in this file talks to a real service yet. It defines the contract
 * the UI codes against, so that authentication, entitlements and checkout
 * can be connected later without touching page components.
 *
 * Until a provider is configured the UI shows an honest "not yet available"
 * state. It never simulates a successful payment, login or download.
 *
 * To go live:
 *   1. Implement `AccessProvider` (e.g. Stripe Checkout + your auth backend).
 *   2. Return it from `getAccessProvider()`.
 *   3. Fill `offers` with real products and prices.
 */

export type OfferKind = 'membership' | 'bundle' | 'single-niche' | 'single-template';

export interface Offer {
  id: string;
  kind: OfferKind;
  name: string;
  blurb: string;
  /** What the customer receives. Shown verbatim on the access page. */
  includes: string[];
  /** null = price not decided. The UI renders a labelled placeholder. */
  price: { amount: number; currency: string; interval?: 'month' | 'year' | 'once' } | null;
  /** Placeholder offers are illustrative structures, not products on sale. */
  placeholder: boolean;
}

export interface Session {
  userId: string;
  email: string;
}

export interface AccessProvider {
  getSession(): Promise<Session | null>;
  /** True if the signed-in user may open the given niche or template. */
  hasEntitlement(resource: { type: 'niche' | 'template'; slug: string }): Promise<boolean>;
  /** Starts a checkout and resolves with a redirect URL from the payment provider. */
  startCheckout(offerId: string): Promise<{ redirectUrl: string }>;
  /** Resolves with a short-lived, signed download URL for an entitled resource. */
  getDownloadUrl(resource: { type: 'niche' | 'template'; slug: string }): Promise<string>;
}

/** Returns null until a real provider is wired in. */
export function getAccessProvider(): AccessProvider | null {
  return null;
}

export const commerceLive = getAccessProvider() !== null;

/**
 * Illustrative offer STRUCTURES. Names, contents and prices are placeholders
 * pending business decisions. `price: null` everywhere on purpose.
 */
export const offers: Offer[] = [
  {
    id: 'placeholder-single',
    kind: 'single-niche',
    name: 'Single resource',
    blurb: 'One niche file or one editing template, bought on its own.',
    includes: ['The niche research file or template you choose', 'The sources and research date recorded with it'],
    price: null,
    placeholder: true,
  },
  {
    id: 'placeholder-bundle',
    kind: 'bundle',
    name: 'Bundle',
    blurb: 'A niche together with the editing templates matched to it.',
    includes: ['One niche research file', 'Its related editing templates', 'Sources and research date'],
    price: null,
    placeholder: true,
  },
  {
    id: 'placeholder-membership',
    kind: 'membership',
    name: 'Membership',
    blurb: 'Ongoing access to the niche library and the template library.',
    includes: ['The published niche library', 'The published template library', 'New records as they are published'],
    price: null,
    placeholder: true,
  },
];
