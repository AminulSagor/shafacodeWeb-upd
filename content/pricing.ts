/**
 * Scope estimator price table (BDT, thousands). Placeholder figures from the
 * design: confirm with the owner before launch (spec section 14).
 */
export const projectTypes = [
  { id: 'website', label: 'Website', bdt: [80, 120], weeks: [3, 5] },
  { id: 'web-app', label: 'Web app', bdt: [90, 160], weeks: [6, 10] },
  { id: 'mobile-app', label: 'Mobile app', bdt: [120, 220], weeks: [8, 12] },
  { id: 'saas', label: 'SaaS', bdt: [200, 400], weeks: [10, 16] },
] as const;

export const estimatorFeatures = [
  { id: 'accounts', label: 'User accounts & roles', bdt: [15, 35] },
  { id: 'admin', label: 'Admin panel', bdt: [20, 40] },
  { id: 'payments', label: 'Payments', bdt: [15, 35] },
  { id: 'integrations', label: 'Integrations (API)', bdt: [10, 30] },
  { id: 'mobile', label: 'Mobile app', bdt: [60, 120] },
] as const;

export type ProjectTypeId = (typeof projectTypes)[number]['id'];
export type FeatureId = (typeof estimatorFeatures)[number]['id'];

/** BDT per USD used for the secondary estimate. */
export const BDT_PER_USD = 120;

export function estimate(type: ProjectTypeId, features: readonly FeatureId[]) {
  const t = projectTypes.find((p) => p.id === type) ?? projectTypes[1];
  // A mobile app project already is the app: do not price it twice.
  const fs = estimatorFeatures.filter(
    (f) => features.includes(f.id) && !(type === 'mobile-app' && f.id === 'mobile')
  );
  const low = (t.bdt[0] + fs.reduce((s, f) => s + f.bdt[0], 0)) * 1000;
  const high = (t.bdt[1] + fs.reduce((s, f) => s + f.bdt[1], 0)) * 1000;
  const n = fs.length;
  const weeks = [Math.round(t.weeks[0] + n * 0.5), Math.round(t.weeks[1] + n * 1.5)] as const;
  const engineers = n >= 3 || type === 'saas' ? 2 : 1;
  const team = ['PM', 'designer', `${engineers} engineer${engineers > 1 ? 's' : ''}`];
  if (fs.some((f) => f.id === 'mobile') || type === 'mobile-app') team.push('mobile developer');
  return { low, high, weeks, team };
}

export const formatBdtK = (n: number) => `${Math.round(n / 1000)}k`;

const usd = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
/** BDT amount as USD, rounded to the nearest $50. */
export const formatUsd = (bdt: number) => usd.format(Math.round(bdt / BDT_PER_USD / 50) * 50);

export type PackageTier = {
  id: 'basic' | 'app-web' | 'premium';
  name: string;
  audience: string;
  price: string;
  usd: string;
  features: string[];
  cta: string;
  href: string;
  popular?: boolean;
};

/** Starting packages (Figma Packages 51:7901). Prices to confirm with the owner (spec 14). */
export const packageTiers: PackageTier[] = [
  {
    id: 'basic',
    name: 'Basic App or Website',
    audience: 'For small businesses, personal brands, startups and simple launches.',
    price: '৳80,000',
    usd: '≈ $670',
    features: [
      'Basic UI/UX design',
      'Website or app development',
      'Responsive layout',
      'Essential pages or screens',
      'Contact or inquiry form',
      'Basic deployment support',
    ],
    cta: 'Start a basic project',
    href: '/contact?type=website',
  },
  {
    id: 'app-web',
    name: 'App + Website',
    audience: 'For businesses that need a customer-facing website and a mobile app.',
    price: '৳150,000',
    usd: '≈ $1,250',
    features: [
      'Website design and development',
      'Mobile app design and development',
      'API integration',
      'Basic admin panel',
      'Testing and launch support',
    ],
    cta: 'Discuss App + Web',
    href: '/contact?type=mobile-app',
    popular: true,
  },
  {
    id: 'premium',
    name: 'Premium Digital Product',
    audience: 'For SaaS platforms, marketplaces, dashboards and automation.',
    price: '৳300k +',
    usd: '≈ $2,500 +',
    features: [
      'Complete product planning',
      'Advanced UI/UX design system',
      'Frontend and backend development',
      'Admin dashboard & role management',
      'API integrations',
      'Deployment and post-launch support',
    ],
    cta: 'Request premium quote',
    href: '/contact?type=saas',
  },
];

/** true = included, false = not included, string = detail. Columns: basic, app-web, premium. */
export const packageComparison: { feature: string; values: [string | boolean, string | boolean, string | boolean] }[] = [
  { feature: 'UI/UX design', values: ['Basic', 'Full', 'Design system'] },
  { feature: 'Website', values: [true, true, true] },
  { feature: 'Mobile app', values: ['Simple app', true, true] },
  { feature: 'Admin panel', values: [false, 'Basic', 'Roles & permissions'] },
  { feature: 'API integrations', values: [false, true, true] },
  { feature: 'Payments', values: [false, 'Optional', true] },
  { feature: 'Testing & QA', values: ['Basic', true, 'Automated + manual'] },
  { feature: 'Post-launch support', values: ['14 days', '30 days', '60 days'] },
  { feature: 'Timeline', values: ['3 to 6 weeks', '8 to 14 weeks', '12 to 24 weeks'] },
];
