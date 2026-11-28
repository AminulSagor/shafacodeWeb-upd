export type Faq = { q: string; a: string };

/** Home FAQ: seven questions, answers always visible (Figma FAQ Section 19:2879). */
export const sharedFaqs = {
  designAndDevelop: {
    q: 'Do you design and develop both?',
    a: 'Yes. One team handles research, UI/UX, development, testing and launch, so nothing is lost between handovers.',
  },
  ownCode: {
    q: 'Will I own the source code?',
    a: 'Yes. You own the code, designs and accounts from day one, delivered in your repository.',
  },
  supportAfterLaunch: {
    q: 'Do you provide support after launch?',
    a: 'Every project includes launch support, and we offer monthly maintenance plans for updates, monitoring and new features.',
  },
  updates: {
    q: 'How do you keep me updated?',
    a: 'You get a shared milestone plan, weekly progress updates and a demo at the end of each milestone.',
  },
} satisfies Record<string, Faq>;

export const homeFaqs: Faq[] = [
  {
    q: 'How much does a software project cost?',
    a: 'It depends on features, platform, timeline and integrations. Websites start from ৳80,000. We give a clear, itemised estimate after a free consultation.',
  },
  sharedFaqs.designAndDevelop,
  sharedFaqs.ownCode,
  sharedFaqs.supportAfterLaunch,
  sharedFaqs.updates,
  {
    q: 'Is customer support available?',
    a: 'Yes. Every launch includes 30 days of free support, then optional monthly care plans with fixes, updates and a reply within one business day.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'We do not build for free, but the first consultation and the written estimate are free, and you can start with a small paid discovery sprint before committing to the full project.',
  },
];

/** Services FAQ (Figma 28:3850). */
export const servicesFaqs: Faq[] = [
  {
    q: 'Which service do I need?',
    a: 'Tell us the problem you want to solve. In a free 30-minute call we recommend the right type of product, scope and budget.',
  },
  sharedFaqs.designAndDevelop,
  sharedFaqs.ownCode,
  sharedFaqs.supportAfterLaunch,
  sharedFaqs.updates,
];

export const pricingFaqs: Faq[] = [
  {
    q: 'Are these fixed prices?',
    a: 'They are starting prices. After a free consultation you get a fixed, itemised quote with milestones.',
  },
  sharedFaqs.designAndDevelop,
  sharedFaqs.ownCode,
  sharedFaqs.supportAfterLaunch,
];
