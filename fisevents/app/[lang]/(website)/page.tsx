import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getAlternates } from '@/lib/seo';
import { getLandingPageNavList } from '@/lib/landing-page';
import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import HPPricing from './_components/HPPricing';
import HPCarousel from './_components/HPCarousel';
import { FiArrowDown } from 'react-icons/fi';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dictionary = (await getDictionary(lang)).website.home;

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    alternates: getAlternates('', lang),
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      url: `${
        process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fisevents.com'
      }/${lang}`,
      images: [
        {
          url: '/img/og-image.png',
          width: 1200,
          height: 630,
          alt: dictionary.meta.title
        }
      ],
      type: 'website'
    },
    twitter: {
      card: 'summary_large_image',
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      images: '/img/og-image.png'
    }
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = (await getDictionary(lang)).website;

  const landingPages = (await getLandingPageNavList()).filter(
    (p): p is { title: string; slug: string } => !!p.title && !!p.slug
  );

  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://www.fisevents.com';
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'FisEvents',
        url: baseUrl,
        logo: `${baseUrl}/img/icon.png`
      },
      {
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'FisEvents',
        url: baseUrl,
        inLanguage: lang,
        publisher: { '@id': `${baseUrl}/#organization` }
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* ── HERO ──────────────────────────────────────────────── */}
      <section
        className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        {/* Ambient background blobs */}
        <div
          className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-fe-primary-container/20 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div
          className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-fe-secondary-container/20 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left column — text content */}
          <div className="lg:col-span-7">
            <Badge variant="new" className="mb-8 inline-block">
              {dictionary.home.features.list.start_free.title}
            </Badge>

            <h1
              id="hero-heading"
              className="text-5xl md:text-7xl font-headline font-extrabold text-fe-on-surface leading-[1.1] tracking-tight mb-6"
            >
              {dictionary.home.tagline}
            </h1>

            <p className="text-lg md:text-xl text-fe-on-surface-variant max-w-2xl mb-6 leading-relaxed">
              {dictionary.home.value_prop}
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {dictionary.home.use_cases.map(
                (uc: { icon: string; label: string }) => (
                  <span
                    key={uc.label}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-fe-surface-container text-fe-on-surface-variant text-sm border border-fe-outline-variant/20"
                  >
                    <span aria-hidden="true">{uc.icon}</span>
                    {uc.label}
                  </span>
                )
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="xl" asChild>
                <Link href={`/${lang}/auth`}>
                  {dictionary.home.getStartedFree}
                </Link>
              </Button>
              <Button variant="secondary" size="xl" asChild>
                <a href="#features" className="group">
                  {dictionary.home.seeFeatures}
                  <FiArrowDown className="w-5 h-5 transition-transform group-hover:translate-y-0.5" />
                </a>
              </Button>
            </div>
          </div>

          {/* Right column — hero image, visible only on lg+ */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden bg-fe-surface-container-lowest p-3 shadow-[0_40px_60px_-15px_rgba(21,28,39,0.10)] transform rotate-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/home-hero-2.jpg"
                alt={dictionary.home.screenshots.hero}
                className="rounded-[1.5rem] w-full h-auto"
              />
            </div>
            <div
              className="absolute -top-12 -right-12 w-64 h-64 bg-fe-primary-container/20 rounded-full blur-3xl -z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-12 -left-12 w-64 h-64 bg-fe-secondary-container/20 rounded-full blur-3xl -z-10 pointer-events-none"
              aria-hidden="true"
            />
          </div>
        </div>
      </section>

      {/* ── FEATURES BENTO ────────────────────────────────────── */}
      <section
        id="features"
        className="py-24 bg-fe-surface-container-low"
        aria-labelledby="features-heading"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            heading={dictionary.home.craftFocus}
            description={dictionary.home.main_text}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: '🔗', bg: 'bg-fe-primary-fixed', fg: 'text-fe-primary', item: dictionary.home.features.list.reg_link },
              { icon: '🎨', bg: 'bg-fe-secondary-fixed', fg: 'text-fe-on-secondary-container', item: dictionary.home.features.list.events },
              { icon: '⏳', bg: 'bg-fe-tertiary-fixed', fg: 'text-fe-tertiary', item: dictionary.home.features.list.waitlist },
              { icon: '✅', bg: 'bg-fe-primary-fixed', fg: 'text-fe-primary', item: dictionary.home.features.list.attendee_management },
              { icon: '📧', bg: 'bg-fe-secondary-fixed', fg: 'text-fe-on-secondary-container', item: dictionary.home.features.list.auto_emails },
              { icon: '🚀', bg: 'bg-fe-tertiary-fixed', fg: 'text-fe-tertiary', item: dictionary.home.features.list.start_free },
            ].map(({ icon, bg, fg, item }) => (
              <div
                key={item.title}
                className="group bg-fe-surface-container-lowest rounded-2xl p-5 card-hover border border-fe-outline-variant/15 flex gap-4"
              >
                <div className={`w-10 h-10 shrink-0 rounded-xl ${bg} flex items-center justify-center ${fg} text-lg`}>
                  {icon}
                </div>
                <div>
                  <h3 className="text-base font-headline font-bold mb-1 text-fe-on-surface leading-snug">
                    {item.title}
                  </h3>
                  <p
                    className="text-sm text-fe-on-surface-variant leading-relaxed [&_strong]:font-semibold [&_strong]:text-fe-on-surface"
                    dangerouslySetInnerHTML={{ __html: item.text }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* App screenshots carousel */}
          <div className="mt-16 max-w-4xl mx-auto px-10">
            <HPCarousel />
          </div>
        </div>
      </section>

      {/* ── PRICING ───────────────────────────────────────────── */}
      <section
        id="pricing"
        className="py-24 bg-fe-surface"
        aria-labelledby="pricing-heading"
      >
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <SectionHeader
            heading={dictionary.home.pricing.title}
            align="center"
          />
          <HPPricing />
        </div>
      </section>

      {/* ── FINAL CTA ─────────────────────────────────────────── */}
      <section className="py-24" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="relative bg-fe-inverse-surface rounded-[3rem] p-12 md:p-24 overflow-hidden text-center">
            {/* Ambient light blobs inside dark card */}
            <div
              className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
              aria-hidden="true"
            >
              <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-fe-primary rounded-full blur-[120px]" />
              <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-fe-secondary rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10">
              <h2
                id="cta-heading"
                className="text-4xl md:text-6xl font-headline font-extrabold text-white mb-8 tracking-tight"
              >
                {dictionary.home.readyToHost}
              </h2>
              <p className="text-xl text-slate-300 max-w-2xl mx-auto mb-12 leading-relaxed">
                {dictionary.home.value_prop}
              </p>
              <Button variant="default" size="xl" asChild>
                <Link href={`/${lang}/auth`}>
                  {dictionary.home.createFirstEvent}
                </Link>
              </Button>
              <p className="mt-8 text-slate-400 font-medium text-sm">
                {dictionary.home.features.list.start_free.text}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOLUTIONS LINKS (discreet, for SEO/internal linking) ─ */}
      {landingPages.length > 0 && (
        <section
          className="pb-16"
          aria-labelledby="solutions-heading"
        >
          <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
            <h2
              id="solutions-heading"
              className="text-sm font-semibold uppercase tracking-wide text-fe-on-surface-variant mb-4"
            >
              {dictionary.home.solutions_heading}
            </h2>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              {landingPages.map(page => (
                <li key={page.slug}>
                  <Link
                    href={`/${lang}/per/${page.slug}`}
                    className="text-sm text-fe-on-surface-variant hover:text-fe-primary hover:underline"
                  >
                    {page.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
