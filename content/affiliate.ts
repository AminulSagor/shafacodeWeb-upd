/** Commission tiers: the rate rises with project value (spec: 4 to 6%). Confirm with the owner. */
export const commissionTiers = [
  { upTo: 150_000, low: 0.04, high: 0.05 },
  { upTo: 400_000, low: 0.04, high: 0.06 },
  { upTo: Infinity, low: 0.05, high: 0.06 },
] as const;

export function commissionFor(value: number) {
  const tier = commissionTiers.find((t) => value <= t.upTo) ?? commissionTiers[commissionTiers.length - 1];
  return { low: Math.round(value * tier.low), high: Math.round(value * tier.high), lowRate: tier.low, highRate: tier.high };
}

export const partnerSteps = [
  { title: 'Refer', body: 'Share a potential project or ask the client to mention you.', time: 'Any time' },
  { title: 'Discuss', body: 'We understand the requirements, budget and timeline.', time: 'Week 1' },
  { title: 'Start', body: 'Once confirmed and started, your referral is recorded.', time: 'On signing' },
  { title: 'Earn', body: 'You earn 4 to 6% of the project value.', time: 'Paid at kickoff' },
];

export const partnerPoints = [
  'Anyone can join: freelancers, agencies, past clients',
  'Referral is recorded when the client signs',
  '4 to 6% based on project value',
  'Paid by bank or bKash at project kickoff',
];

/** Explainer videos from the previous site. */
export const partnerVideos = [
  { lang: 'en', label: 'English', youtubeId: 'ZliPBGFF7rY' },
  { lang: 'bn', label: 'বাংলা', youtubeId: '8_j7NZsCiRI' },
] as const;
