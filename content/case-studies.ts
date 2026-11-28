import type { ServiceSlug } from '@/content/services';

export type CaseStudySummary = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  /** mono meta line, e.g. LOGISTICS · WEB + MOBILE */
  tags: string[];
  services: ServiceSlug[];
  cover: { src: string; alt: string; width: number; height: number };
  results: { value: string; label: string }[];
};

/**
 * Seed content from the Figma frames. Shown until published case studies
 * exist in Firestore. Sample metrics: confirm with the owner before launch.
 */
export const fallbackCaseStudies: CaseStudySummary[] = [
  {
    slug: 'meghswar-courier',
    client: 'MeghSwar Courier',
    title: 'MeghSwar Courier: a parcel platform that dispatches 3x faster',
    summary: 'Merchant portal, rider app and admin console for a courier network, built in 14 weeks.',
    tags: ['Logistics', 'Web + Mobile'],
    services: ['web-application-development', 'mobile-app-development'],
    cover: {
      src: '/images/work/meghswar-courier.jpg',
      alt: 'Courier rider in a lime jacket checking a delivery route on a phone mounted to his scooter',
      width: 1264,
      height: 848,
    },
    results: [
      { value: '3x', label: 'Faster dispatch' },
      { value: '12k+', label: 'Parcels / month' },
      { value: '14 wks', label: 'To launch' },
    ],
  },
  {
    slug: 'chorki',
    client: 'Chorki',
    title: 'Chorki: content operations dashboard for a streaming platform',
    summary:
      'Scaled concurrent streams during premieres with 99.99% uptime and 40% lower server costs.',
    tags: ['Media & OTT', 'SaaS', 'Web app'],
    services: ['saas-development', 'web-application-development'],
    cover: {
      src: '/images/work/chorki.jpg',
      alt: 'Three friends laughing on a sofa while browsing new releases on a streaming app on the TV',
      width: 1264,
      height: 848,
    },
    results: [
      { value: '99.99%', label: 'Uptime' },
      { value: '40%', label: 'Lower server costs' },
    ],
  },
  {
    slug: 'texas-airway-institute',
    client: 'Texas Airway Institute',
    title: 'Texas Airway Institute: course platform and admin dashboard',
    summary: 'Course discovery, enrollment management and admin operations for medical training.',
    tags: ['Medical education', 'Web + Admin'],
    services: ['web-application-development', 'custom-software-development'],
    cover: {
      src: '/images/work/texas-airway-institute.jpg',
      alt: 'Medical student and instructor reviewing a course dashboard on a laptop in a library',
      width: 1264,
      height: 848,
    },
    results: [],
  },
];
