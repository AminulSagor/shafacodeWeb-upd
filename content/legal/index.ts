import { site } from '@/content/site';

export type LegalDoc = {
  slug: 'privacy-policy' | 'terms' | 'cookie-policy';
  title: string;
  accent: string;
  description: string;
  updated: string; // ISO date
  /** Markdown with numbered "## n. Heading" sections */
  body: string;
};

const contact = `${site.name}, ${site.address.locality}, ${site.address.country} · [${site.email}](mailto:${site.email}) · ${site.phoneDisplay}`;

/**
 * Legal copy from the Figma Privacy Policy frame (52:8946). Terms and Cookie
 * pages follow the same template. Have a lawyer review before launch.
 */
export const legalDocs: Record<LegalDoc['slug'], LegalDoc> = {
  'privacy-policy': {
    slug: 'privacy-policy',
    title: 'Privacy',
    accent: 'Policy',
    description:
      'How ShafaCode collects, uses and protects information from website visitors, clients, partners and job applicants.',
    updated: '2026-11-20',
    body: `## 1. Information we collect

Contact details you submit through our forms (name, email, phone, company), project details, partner applications and job applications including resumes.

## 2. How we use information

To reply to inquiries, prepare estimates, process applications and improve our services. We never sell personal data.

## 3. Job applications and resumes

Resumes are stored in a private storage bucket and shared internally only through expiring links. We keep applications for 12 months unless you ask us to delete them sooner.

## 4. Cookies and analytics

We use privacy-friendly analytics to understand site usage. Non-essential cookies are only set with your consent. See our [Cookie Policy](/cookie-policy).

## 5. Data retention and security

Data is stored with reputable providers, encrypted in transit, and access is limited to people who need it.

## 6. Your rights

You can request access, correction or deletion of your data at any time by emailing [${site.email}](mailto:${site.email}).

## 7. Contact

${contact}
`,
  },
  terms: {
    slug: 'terms',
    title: 'Terms of',
    accent: 'Service',
    description: 'The terms that apply when you use the ShafaCode website and work with us on a project.',
    updated: '2026-11-20',
    body: `## 1. About these terms

These terms cover your use of shafacode.com. Project work is governed by the written proposal or agreement we sign with each client, which takes precedence over these terms.

## 2. Using the website

You may browse and share our content for personal and business evaluation. Do not misuse the site, attempt to break its security or submit false information through our forms.

## 3. Estimates and pricing

Prices on the website, including the instant estimate, are starting points and not binding offers. A project starts only after a written, itemised quote is accepted.

## 4. Intellectual property

Website content, design and code belong to ${site.name} unless stated otherwise. For client projects, ownership of code, designs and accounts transfers to the client as set out in the project agreement.

## 5. Partner program

Partner commissions are paid as described on the [partner program page](/affiliate) and confirmed in writing for each referral.

## 6. Liability

The website is provided as is. To the extent the law allows, we are not liable for indirect losses arising from its use.

## 7. Changes and contact

We may update these terms; the date above shows the latest version. Questions: ${contact}
`,
  },
  'cookie-policy': {
    slug: 'cookie-policy',
    title: 'Cookie',
    accent: 'Policy',
    description: 'Which cookies and similar technologies the ShafaCode website uses, and how to control them.',
    updated: '2026-11-20',
    body: `## 1. What cookies are

Cookies are small files a website stores in your browser. Similar technologies include local storage and pixels.

## 2. Cookies we use

**Essential:** keep the site secure and working, for example spam protection on our forms. These are always on.

**Analytics:** privacy-friendly, aggregated statistics about page visits. Set only with your consent.

## 3. Third-party content

Videos on the partner page load from YouTube's privacy-enhanced domain only after you press play.

## 4. Managing cookies

You can clear or block cookies in your browser settings. Blocking essential cookies may stop forms from working.

## 5. Contact

${contact}
`,
  },
};

export const legalNav = Object.values(legalDocs).map((d) => ({ slug: d.slug, label: `${d.title} ${d.accent}` }));
