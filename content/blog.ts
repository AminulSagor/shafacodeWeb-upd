export type Author = { name: string; role: string; bio: string; photo: string | null };

export type Post = {
  slug: string;
  title: string;
  /** Optional heading with a serif accent for the article page */
  headline?: { before: string; accent: string };
  excerpt: string;
  /** Markdown */
  content: string;
  category: string;
  cover: { src: string; alt: string } | null;
  author: Author;
  publishedAt: string; // ISO
  updatedAt: string; // ISO
  readingMinutes: number;
  featured: boolean;
  seo?: { metaTitle?: string; metaDescription?: string; canonicalUrl?: string; noIndex?: boolean };
  /** Earlier slugs that redirect here */
  previousSlugs?: string[];
};

/** Category ids to labels: the current CMS values plus the 2026 topics. */
export const categoryLabels: Record<string, string> = {
  'startup-mvp': 'Startup & MVP',
  'software-cost': 'Software cost',
  'web-apps': 'Web apps',
  'mobile-apps': 'Mobile apps',
  'ui-ux': 'UI/UX',
  automation: 'Automation',
  tech: 'Tech',
  design: 'Design',
  business: 'Business',
  lifestyle: 'Lifestyle',
};

export const categoryLabel = (id: string) =>
  categoryLabels[id] ?? id.replace(/[-_]/g, ' ').replace(/^\w/, (c) => c.toUpperCase());

export const defaultAuthor: Author = {
  name: 'Arif Hossain',
  role: 'Software Engineer',
  bio: 'Software engineer at ShafaCode. Writes about scoping, architecture and shipping MVPs on budget.',
  photo: '/images/people/arif-hossain.jpg',
};

const costArticle = `Navigating custom software development in Bangladesh requires a clear understanding of market dynamics, technical expertise and project scoping. Bangladesh offers a compelling mix of talent and cost-efficiency, but estimating the exact investment demands a nuanced approach.

## The variables that define the investment

Unlike off-the-shelf solutions, custom software is tailored to your operations, so a universal price tag is impossible. These factors decide the final cost:

- Complexity and scope: a simple CRUD app differs vastly from an ERP with machine learning.
- Platform: native iOS and Android usually cost more than cross-platform apps or PWAs.
- UI/UX fidelity: bespoke interactive design needs specialist designers.
- Integrations: payment gateways, logistics providers and legacy systems add complexity.

> **Key takeaway**
>
> Hourly rates are competitive ($15 to $40 for senior talent), but architecture decides the real cost. A well-defined MVP is the best cost control.

## Technical rigor vs. cost

Technical debt taken on early multiplies future costs. Scalable architecture, automated testing and CI/CD raise the first estimate but cut the total cost of ownership.

\`\`\`ts title="cost_estimator.ts"
const calculateBaseCost = (scope: ProjectScope): number => {
  const baseRate = 25; // average hourly rate in USD
  let hours = scope.complexity === 'high' ? 1200 : 480;
  hours += scope.integrationsCount * 40;
  return hours * baseRate;
};
\`\`\`

## The discovery phase is non-negotiable

Before writing a line of code, analysts and architects map user journeys, define data structures and choose the stack. Skipping discovery leads to feature creep and budget overruns.
`;

const seed = (
  slug: string,
  title: string,
  excerpt: string,
  category: string,
  date: string,
  minutes: number,
  image: string,
  alt: string
): Post => ({
  slug,
  title,
  excerpt,
  content: excerpt,
  category,
  cover: { src: `/images/blog/${image}`, alt },
  author: defaultAuthor,
  publishedAt: date,
  updatedAt: date,
  readingMinutes: minutes,
  featured: false,
});

/**
 * Seed posts from the Figma frames. Used only when the CMS cannot be read
 * (local development without credentials), never alongside real posts.
 */
export const fallbackPosts: Post[] = [
  {
    slug: 'custom-software-cost-bangladesh',
    title: 'How much does custom software cost in Bangladesh?',
    headline: { before: 'How much does custom software cost', accent: 'in Bangladesh?' },
    excerpt:
      'A breakdown of pricing models, hidden costs and what to expect to pay for a high-quality web or mobile application in 2026.',
    content: costArticle,
    category: 'software-cost',
    cover: {
      src: '/images/blog/software-cost-bangladesh.jpg',
      alt: 'Two founders reviewing a project budget chart on a laptop at a cafe table',
    },
    author: defaultAuthor,
    publishedAt: '2026-02-12T09:00:00.000Z',
    updatedAt: '2026-11-20T09:00:00.000Z',
    readingMinutes: 8,
    featured: true,
  },
  seed('website-vs-web-app', 'Website vs web app: what does your business need?', 'Architectural differences and how to choose for scalability.', 'web-apps', '2026-11-12T09:00:00.000Z', 6, 'website-vs-web-app.jpg', 'Two people comparing a marketing website and a dashboard on two laptops'),
  seed('mobile-app-vs-web-app', 'Mobile app vs web app: which should you build first?', 'User acquisition cost, reach and platform capabilities compared.', 'mobile-apps', '2026-11-04T09:00:00.000Z', 7, 'mobile-vs-web.jpg', 'Woman on a sofa using a phone with a laptop open beside her'),
  seed('ui-ux-before-development', 'Why UI/UX matters before development', 'How prototyping and user-flow testing prevent costly rebuilds.', 'ui-ux', '2026-10-28T09:00:00.000Z', 5, 'ux-before-dev.jpg', 'Two designers mapping user flows on a wall of lime sticky notes'),
  seed('plan-an-mvp', 'How to plan an MVP for your startup', 'A lean framework for prioritising features and launching faster.', 'startup-mvp', '2026-10-20T09:00:00.000Z', 9, 'plan-an-mvp.jpg', 'Startup team planning features on a whiteboard'),
  seed('before-hiring-a-software-agency', 'What to prepare before hiring a software agency', 'Requirements, budget alignment and clear milestones: a checklist.', 'software-cost', '2026-10-09T09:00:00.000Z', 8, 'before-hiring-agency.jpg', 'Checklist on a clipboard next to a laptop and a phone'),
  seed('business-automation-saves-time', 'How business automation saves time and cost', 'Finding redundant workflows and replacing them with software.', 'automation', '2026-09-30T09:00:00.000Z', 6, 'business-automation.jpg', 'Shop owner holding a tablet with an inventory dashboard in a stockroom'),
];
