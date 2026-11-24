import Link from 'next/link';
import { ArrowRight, Gauge, Ruler, ShieldCheck } from 'lucide-react';
import FooterContactForm from '../footer/footer-contact-form';

const contactLinks = [
  {
    label: 'Email',
    text: 'aminulislamsagor@shafacode.com',
    href: 'mailto:aminulislamsagor@shafacode.com',
  },
  {
    label: 'Whatsapp',
    text: 'Chat on Whatsapp',
    href: 'https://wa.me/8801540233587',
  },
  {
    label: 'Linkedin',
    text: 'Connect on Linkedin',
    href: 'https://www.linkedin.com/company/shafacodedotcom/',
  },
  {
    label: 'Facebook',
    text: 'Follow us on Facebook',
    href: 'https://www.facebook.com/profile.php?id=61580938442647',
  },
  {
    label: 'Location',
    text: 'Barishal, Swarupkathi',
    href: 'https://www.google.com/maps/search/?api=1&query=Barishal%2C%20Swarupkathi',
  },
];

const trust = [
  { icon: ShieldCheck, label: 'Your Trusted Agency' },
  { icon: Gauge, label: 'Fast Execution' },
  { icon: Ruler, label: 'Solid Architecture' },
];

const CtaSection = () => {
  return (
    <section
      id="contact"
      className="scroll-mt-20 bg-[radial-gradient(ellipse_70%_60%_at_100%_100%,rgba(110,150,10,0.45),transparent_70%)] px-4 py-24"
    >
      <div className="mx-auto max-w-4xl text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-1.5 text-xs uppercase tracking-widest text-slate-200">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Start Your Journey
        </span>
        <h2 className="mt-8 text-5xl font-semibold leading-tight sm:text-6xl">
          Have an Idea? Let&apos;s Build It
          <span className="block text-brand">
            Clearly <span className="text-white">and</span> Reliably.
          </span>
        </h2>
        <p className="mx-auto mt-8 max-w-xl text-slate-300">
          Tell us what you want to build. We will help you understand the
          scope, timeline, budget, and best technical direction.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <a
            href="#contact-form"
            className="inline-flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-sm font-semibold text-black shadow-[0_0_24px_-4px_var(--color-brand)] hover:bg-brand/90"
          >
            Book a Free Consultation
            <ArrowRight className="h-4 w-4" />
          </a>
          <Link
            href="#contact-form"
            className="rounded-xl border border-white/15 px-7 py-3.5 text-sm font-semibold hover:bg-white/5"
          >
            Request Project Estimate
          </Link>
        </div>

        <ul className="mt-16 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 text-sm text-slate-400">
          {trust.map(({ icon: Icon, label }) => (
            <li key={label} className="flex flex-col items-center gap-2">
              <Icon className="h-6 w-6 text-brand/80" />
              {label}
            </li>
          ))}
        </ul>
      </div>

      <div
        id="contact-form"
        className="mx-auto mt-24 grid max-w-5xl scroll-mt-24 gap-10 rounded-3xl border border-white/10 bg-black/30 p-8 md:grid-cols-2"
      >
        <div>
          <h3 className="text-2xl font-semibold">Contact</h3>
          <ul className="mt-6 space-y-3 text-sm">
            {contactLinks.map((c) => (
              <li key={c.label}>
                <strong className="mr-2 text-white">{c.label}:</strong>
                <a
                  href={c.href}
                  target={c.href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="text-brand hover:underline"
                >
                  {c.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <FooterContactForm />
      </div>
    </section>
  );
};

export default CtaSection;
