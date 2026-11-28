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
