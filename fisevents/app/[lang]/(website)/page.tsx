import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { Metadata, Viewport } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import HPCarousel from './_components/HPCarousel';
import HPPricing from './_components/HPPricing';

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
    alternates: {
      canonical: `https://fisevents.vercel.app/${lang}`
    },
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      url: `https://fisevents.vercel.app/${lang}`,
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
    },
    robots: 'index, follow'
  };
}

export default async function HomePage({
  params
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const dictionary = (await getDictionary(lang)).website;

  return (
    <>
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
              {(dictionary.home.tagline || '!').split('!')[0]}
              <em className="text-fe-primary not-italic">!</em>
            </h1>

            <p className="text-lg md:text-xl text-fe-on-surface-variant max-w-2xl mb-10 leading-relaxed">
              {dictionary.home.main_text}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="default" size="xl" asChild>
                <Link href={`/${lang}/auth`}>
                  {dictionary.home.getStartedFree}
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <a href="#features">{dictionary.home.seeFeatures}</a>
              </Button>
            </div>
          </div>

          {/* Right column — hero image, visible only on lg+ */}
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden bg-fe-surface-container-lowest p-3 shadow-[0_40px_60px_-15px_rgba(21,28,39,0.10)] transform rotate-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/img/home-hero.png"
                alt="fisevents dashboard preview"
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card — Registration link */}
            <div className="group bg-fe-surface-container-lowest rounded-3xl p-8 card-hover border border-fe-outline-variant/15">
              <div className="w-12 h-12 rounded-2xl bg-fe-primary-fixed mb-6 flex items-center justify-center text-fe-primary text-xl">
                🔗
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-fe-on-surface">
                {dictionary.home.features.list.reg_link.title}
              </h3>
              <p className="text-fe-on-surface-variant leading-relaxed">
                {dictionary.home.features.list.reg_link.text}
              </p>
            </div>

            {/* Card — Customizable events */}
            <div className="group bg-fe-surface-container-lowest rounded-3xl p-8 card-hover border border-fe-outline-variant/15">
              <div className="w-12 h-12 rounded-2xl bg-fe-secondary-fixed mb-6 flex items-center justify-center text-fe-on-secondary-container text-xl">
                🎨
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-fe-on-surface">
                {dictionary.home.features.list.events.title}
              </h3>
              <p className="text-fe-on-surface-variant leading-relaxed">
                {dictionary.home.features.list.events.text}
              </p>
            </div>

            {/* Card — Date management */}
            <div className="group bg-fe-surface-container-lowest rounded-3xl p-8 card-hover border border-fe-outline-variant/15">
              <div className="w-12 h-12 rounded-2xl bg-fe-tertiary-fixed mb-6 flex items-center justify-center text-fe-tertiary text-xl">
                📅
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-fe-on-surface">
                {dictionary.home.features.list.date_management.title}
              </h3>
              <p className="text-fe-on-surface-variant leading-relaxed">
                {dictionary.home.features.list.date_management.text}
              </p>
            </div>

            {/* Card wide — Start free, with carousel */}
            <div className="md:col-span-1 group bg-gradient-to-br from-fe-primary-fixed to-fe-surface-container-lowest rounded-3xl p-8 card-hover border border-fe-outline-variant/15">
              <div className="w-12 h-12 rounded-2xl bg-fe-primary text-fe-on-primary mb-6 flex items-center justify-center text-xl">
                🚀
              </div>
              <h3 className="text-2xl font-headline font-bold mb-4 text-fe-on-surface">
                {dictionary.home.features.list.start_free.title}
              </h3>
              <p className="text-fe-on-surface-variant leading-relaxed">
                {dictionary.home.features.list.start_free.text}
              </p>
            </div>
          </div>

          {/* Screenshot carousel */}
          <div className="mt-16 rounded-3xl overflow-hidden shadow-editorial border border-fe-outline-variant/20">
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
                {dictionary.home.main_text}
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
    </>
  );
}
