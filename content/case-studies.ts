import type { ServiceSlug } from '@/content/services';

export const portfolioCategories = [
  { id: 'web-app', label: 'Web app' },
  { id: 'mobile-app', label: 'Mobile app' },
  { id: 'ui-ux', label: 'UI/UX' },
  { id: 'backend', label: 'Backend' },
  { id: 'saas', label: 'SaaS' },
  { id: 'iot', label: 'IoT' },
] as const;

export type PortfolioCategory = (typeof portfolioCategories)[number]['id'];

export type MediaImage = { src: string; alt: string; width: number; height: number };

export type CaseStudySummary = {
  slug: string;
  client: string;
  title: string;
  summary: string;
  /** mono meta line, e.g. LOGISTICS · WEB + MOBILE */
  tags: string[];
  services: ServiceSlug[];
  categories: PortfolioCategory[];
  delivery: 'delivered' | 'ongoing';
  /** Legacy CMS entries have no cover yet; cards then render without media */
  cover: MediaImage | null;
  results: { value: string; label: string }[];
  /** Chosen for the home page in the admin */
  featured?: boolean;
};

export type CaseStudy = CaseStudySummary & {
  /** Hero heading with one accent phrase */
  headline?: { before: string; accent: string };
  lede?: string;
  industry?: string;
  servicesLabel?: string;
  timeline?: string;
  stackLabel?: string;
  stack?: string[];
  /** Results strip on the case study page */
  stats?: { value: string; unit?: string; label: string }[];
  challenge?: string;
  solution?: string;
  gallery?: MediaImage[];
  quote?: { text: string; accent?: string; after?: string; name: string; role: string; company: string; initials: string };
  /** Free text from the legacy CMS (Markdown) */
  body?: string;
  liveUrl?: string;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; noIndex?: boolean };
  /** Earlier slugs that redirect here */
  previousSlugs?: string[];
};

const img = (file: string, alt: string): MediaImage => ({ src: `/images/work/${file}`, alt, width: 1264, height: 848 });

/**
 * Seed content from the Figma frames, shown until published case studies
 * exist in Firestore. Sample metrics are placeholders: confirm with the owner
 * before launch (spec section 14).
 */
export const fallbackCaseStudies: CaseStudy[] = [
  {
    slug: 'meghswar-courier',
    client: 'MeghSwar Courier',
    title: 'MeghSwar Courier: a parcel platform that dispatches 3x faster',
    summary: 'Merchant portal, rider app and admin console for a courier network, built in 14 weeks.',
    tags: ['Logistics', 'Web + Mobile'],
    services: ['web-application-development', 'mobile-app-development'],
    categories: ['web-app', 'mobile-app', 'backend'],
    delivery: 'delivered',
    cover: img('meghswar-courier.jpg', 'Courier rider in a lime jacket checking a delivery route on a phone mounted to his scooter'),
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
    summary: 'Scaled concurrent streams during premieres with 99.99% uptime and 40% lower server costs.',
    tags: ['Media & OTT', 'SaaS', 'Web app'],
    services: ['saas-development', 'web-application-development'],
    categories: ['saas', 'web-app', 'backend'],
    delivery: 'delivered',
    cover: img('chorki.jpg', 'Three friends laughing on a sofa while browsing new releases on a streaming app on the TV'),
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
    services: ['web-application-development', 'custom-software-development', 'ui-ux-design'],
    categories: ['web-app', 'ui-ux'],
    delivery: 'delivered',
    cover: img('texas-airway-institute.jpg', 'Medical student and instructor reviewing a course dashboard on a laptop in a library'),
    results: [],
    headline: { before: 'Texas Airway Institute: website and', accent: 'admin dashboard' },
    lede: 'A clean digital platform for course discovery, enrollment management, admin operations and medical training workflows.',
    industry: 'Medical education',
    servicesLabel: 'UI/UX · Web development',
    timeline: '10 weeks',
    stackLabel: 'Next.js · Firebase',
    stack: ['Next.js', 'React', 'TypeScript', 'Firebase', 'Figma'],
    stats: [
      { value: '2', unit: 'x', label: 'More course enquiries' },
      { value: '60', unit: '%', label: 'Less admin time per enrollment' },
      { value: '98', label: 'Lighthouse performance' },
      { value: '10', unit: 'wk', label: 'From kickoff to launch' },
    ],
    challenge:
      'The client needed a professional platform where users could explore medical training courses, manage enrollments and trust a clean educational interface, plus an admin side to manage course content and operations efficiently.',
    solution:
      'We designed a modern website with clear course presentation, smooth navigation and responsive layouts, and built an admin dashboard for key operations. The design focuses on clarity, credibility and ease of use for students and administrators.',
    gallery: [
      img('tai-shot-1.jpg', 'Instructor reviewing a training checklist on a tablet in a simulation lab'),
      img('tai-shot-2.jpg', 'Administrator managing enrollments on the course dashboard at her desk'),
      img('tai-shot-3.jpg', 'Student checking her course schedule on a phone on campus'),
      {
        src: '/images/home/adaptive-ux.jpg',
        alt: 'The course platform on a laptop, tablet and phone with lime charts',
        width: 1264,
        height: 848,
      },
    ],
    quote: {
      text: 'ShafaCode turned a messy enrollment process into a platform our students and staff',
      accent: 'actually enjoy using.',
      after: ' Communication was clear at every milestone.',
      name: 'Program Director',
      role: 'Program Director',
      company: 'Texas Airway Institute',
      initials: 'SC',
    },
  },
  {
    slug: 'business-directory-crm',
    client: 'Business Directory CRM',
    title: 'Business Directory CRM for local service companies',
    summary: 'Listings, leads and follow-ups in one CRM-style web app built on Next.js and Firebase.',
    tags: ['Local services', 'Web app'],
    services: ['web-application-development', 'custom-software-development'],
    categories: ['web-app', 'backend'],
    delivery: 'delivered',
    cover: img('business-directory-crm.jpg', 'Market stall owner showing a customer a listing on a tablet with lime charts'),
    results: [],
  },
  {
    slug: 'tri-gardening',
    client: 'Tri Gardening',
    title: 'Tri Gardening: website UI/UX',
    summary: 'A calm, product-led storefront design for a gardening brand.',
    tags: ['Retail', 'UI/UX'],
    services: ['ui-ux-design', 'wordpress-development'],
    categories: ['ui-ux'],
    delivery: 'delivered',
    cover: img('trigardening.jpg', 'Smiling gardener holding a potted plant in a greenhouse full of seedlings'),
    results: [],
  },
  {
    slug: 'meghswar-courier-ui-ux',
    client: 'MeghSwar Courier',
    title: 'MeghSwar Courier: UI/UX design',
    summary: 'Design system and flows for merchants, riders and admins.',
    tags: ['Logistics', 'UI/UX'],
    services: ['ui-ux-design'],
    categories: ['ui-ux'],
    delivery: 'delivered',
    cover: img('meghswar-ux.jpg', 'Two designers mapping courier app screens on a wall of lime sticky notes'),
    results: [],
  },
  {
    slug: 'influencer-marketing-pr-platform',
    client: 'Influencer marketing & PR platform',
    title: 'Influencer marketing & PR platform',
    summary: 'Campaign planning, creator management and reporting.',
    tags: ['Marketing', 'Mobile app'],
    services: ['mobile-app-development', 'saas-development'],
    categories: ['mobile-app', 'saas'],
    delivery: 'ongoing',
    cover: img('influencer.jpg', 'Creator filming a product video with a ring light and phone in a bright studio'),
    results: [],
  },
];
