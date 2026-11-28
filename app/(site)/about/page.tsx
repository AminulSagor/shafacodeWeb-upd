import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Check, Mail } from 'lucide-react';
import type { AboutPage as AboutPageLd, WithContext } from 'schema-dts';

import { Accent } from '@/components/ui/accent';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { FeatureCard } from '@/components/site/cards/feature-card';
import { JsonLd } from '@/components/site/json-ld';
import { StatGrid } from '@/components/site/stat-grid';
import { CtaBand } from '@/components/site/sections/cta-band';
import { PageHero } from '@/components/site/sections/page-hero';
import { SectionHeader } from '@/components/site/sections/section-header';
import { aboutStats, methodology, values } from '@/content/about';
import { site } from '@/content/site';
import { getTeam } from '@/lib/data/team';
import { absoluteUrl, buildMetadata } from '@/lib/seo';

export const metadata: Metadata = buildMetadata({
  title: 'About ShafaCode: a transparent software team',
  description:
    'A software development and digital product agency from Barishal, Bangladesh, building reliable websites, apps, SaaS platforms, custom software and IoT solutions.',
  path: '/about',
});

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className="size-4">
      <path d="M6.94 5a2 2 0 1 1-4-.002 2 2 0 0 1 4 .002M7 8.48H3V21h4zm6.32 0H9.34V21h3.94v-6.57c0-3.66 4.77-4 4.77 0V21H22v-7.93c0-6.17-7.06-5.94-8.72-2.91z" />
    </svg>
  );
}

/** About. Figma: About 50:7265 (mobile 53:16013) */
export default async function AboutPage() {
  const team = await getTeam();

  const ld: WithContext<AboutPageLd> = {
    '@context': 'https://schema.org',
    '@type': 'AboutPage',
    name: `About ${site.name}`,
    url: absoluteUrl('/about'),
    mainEntity: {
      '@type': 'Organization',
      '@id': `${site.url}/#organization`,
      name: site.name,
      url: site.url,
      employee: team.map((m) => ({ '@type': 'Person', name: m.name, jobTitle: m.role })),
    },
  };

  return (
    <>
      <JsonLd data={ld} />
      <PageHero
        crumbs={[{ name: 'About', path: '/about' }]}
        eyebrow="About ShafaCode"
        title={
          <>
            A transparent software team built for <Accent>growing businesses</Accent>
          </>
        }
        lede="A software development and digital product agency from Barishal, Bangladesh, helping businesses design, build and launch reliable websites, apps, SaaS platforms, custom software and IoT solutions."
        actions={
          <>
            <Button asChild size="lg">
              <Link href={team.length ? '#team' : '/careers'}>
                {team.length ? 'Meet the team' : 'Join the team'} <ArrowRight aria-hidden />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/contact">Work with us</Link>
            </Button>
          </>
        }
      />

      <section aria-labelledby="story-title" className="container-page grid items-center gap-10 pb-section xl:grid-cols-2 xl:gap-14">
        <div className="relative aspect-4/3 overflow-hidden rounded-card bg-surface-1 xl:aspect-608/460">
          <Image
            src="/images/about/team-planning.jpg"
            alt="The ShafaCode team celebrating a launch around a table with laptops and a wall of sticky notes"
            fill
            preload
            sizes="(min-width: 1280px) 608px, 92vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 id="story-title" className="type-h2 text-fg">
            Our <Accent>story</Accent>
          </h2>
          <div className="mt-6 flex flex-col gap-4 type-body-lg text-fg-muted">
            <p>
              ShafaCode started with a simple goal: make software development more transparent, practical and
              business-friendly.
            </p>
            <p>
              Across web, mobile, UI/UX, automation, SaaS and IoT projects, we saw the industry lacked a middle ground
              between rigid enterprise agencies and unreliable freelancers.
            </p>
            <p>Today, we are that middle ground: a reliable engine for your digital ambitions.</p>
          </div>
        </div>
      </section>

      <StatGrid items={aboutStats} label="ShafaCode in numbers" />

      <section aria-labelledby="values-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="values-title"
            eyebrow="Our philosophy"
            title={
              <>
                Built on a <Accent>win-win</Accent> paradigm
              </>
            }
            lede="Successful software is built through transparency, trust and shared growth."
          />
          <ul className="mt-section-head grid gap-grid md:grid-cols-2 xl:grid-cols-4">
            {values.map((v) => (
              <li key={v.title}>
                <FeatureCard icon={v.icon} title={v.title} body={v.body} className="bg-surface-1" />
              </li>
            ))}
          </ul>
        </div>
      </section>

      {team.length > 0 && (
        <section id="team" aria-labelledby="team-title" className="scroll-mt-nav-offset bg-surface-1 section-y">
          <div className="container-page">
            <SectionHeader
              id="team-title"
              eyebrow="The team"
              title={
                <>
                  Meet the people <Accent>behind ShafaCode</Accent>
                </>
              }
              lede="Designers, developers, product thinkers and problem solvers building meaningful digital products together."
              ledeBelow
            />
            <ul className="mt-section-head grid grid-cols-1 gap-grid sm:grid-cols-2 xl:grid-cols-4">
              {team.map((m) => (
                <li key={`${m.name}-${m.role}`}>
                  <article className="flex h-full flex-col overflow-hidden rounded-md border border-line-subtle bg-canvas">
                    <div className="relative aspect-290/300 bg-surface-2">
                      {m.photo ? (
                        <Image src={m.photo} alt={`Portrait of ${m.name}`} fill sizes="(min-width: 1280px) 290px, (min-width: 640px) 46vw, 92vw" className="object-cover" />
                      ) : (
                        <span aria-hidden className="absolute inset-0 grid place-items-center type-display text-fg-subtle">
                          {m.name
                            .split(' ')
                            .map((w) => w[0])
                            .join('')
                            .slice(0, 2)}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-card">
                      <h3 className="type-h5 text-fg">{m.name}</h3>
                      <p className="type-mono-xs text-fg-brand">{m.role}</p>
                      {m.bio && <p className="mt-2 type-body-sm text-fg-muted">{m.bio}</p>}
                      {(m.linkedinUrl || m.email) && (
                        <div className="mt-auto flex gap-1 pt-4">
                          {m.linkedinUrl && (
                            <IconButton asChild variant="ghost" size="sm" aria-label={`${m.name} on LinkedIn`}>
                              <a href={m.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <LinkedInIcon />
                              </a>
                            </IconButton>
                          )}
                          {m.email && (
                            <IconButton asChild variant="ghost" size="sm" aria-label={`Email ${m.name}`}>
                              <a href={`mailto:${m.email}`}>
                                <Mail aria-hidden />
                              </a>
                            </IconButton>
                          )}
                        </div>
                      )}
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section aria-labelledby="method-title" className="section-y">
        <div className="container-page">
          <SectionHeader
            id="method-title"
            eyebrow="How we work"
            title={
              <>
                Our culture and <Accent>methodology</Accent>
              </>
            }
          />
          <ul className="mt-10 grid gap-x-6 gap-y-3 sm:grid-cols-2 xl:grid-cols-3">
            {methodology.map((m) => (
              <li key={m} className="flex items-center gap-2.5 type-body text-fg-muted">
                <Check className="size-4 shrink-0 text-icon-brand" strokeWidth={2.5} aria-hidden />
                {m}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBand showSteps={false} />
    </>
  );
}
