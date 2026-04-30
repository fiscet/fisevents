import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { Locale } from '@/lib/i18n';
import { getAlternates } from '@/lib/seo';
import { getDictionary } from '@/lib/i18n.utils';
import { getLandingPageBySlug } from '@/lib/landing-page';
import type { LandingPage, LandingPageItem } from '@/types/sanity.extended.types';
import { Button } from '@/components/ui/button';

type Params = { lang: Locale; slug: string };

type LandingDict = {
  pain_points_heading: string;
  features_heading: string;
  cta_heading: string;
  cta_sub: string;
  cta_button: string;
  default_cta: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = await getLandingPageBySlug(slug);
  if (!page) return {};

  const title = lang === 'it' ? page.seoTitleIt : page.seoTitleEn;
  const description = lang === 'it' ? page.seoDescriptionIt : page.seoDescriptionEn;

  return {
    title: title ?? page.title,
    description: description ?? undefined,
    alternates: getAlternates(`/per/${slug}`, lang),
    openGraph: {
      title: title ?? page.title,
      description: description ?? undefined,
      images: page.coverImageUrl ? [{ url: page.coverImageUrl }] : [],
      type: 'website',
    },
  };
}

function loc(field: { it?: string; en?: string } | null | undefined, lang: Locale) {
  return (lang === 'it' ? field?.it : field?.en) ?? field?.it ?? field?.en ?? '';
}

function HeroSection({
  page,
  lang,
  dict,
}: {
  page: LandingPage;
  lang: Locale;
  dict: LandingDict;
}) {
  const headline = loc(page.heroHeadline, lang);
  const subheadline = loc(page.heroSubheadline, lang);
  const ctaLabel = loc(page.heroCtaLabel, lang) || dict.default_cta;

  return (
    <section className="relative pt-16 pb-20 md:pt-24 md:pb-32 overflow-hidden">
      <div
        className="absolute -top-32 -right-32 w-[700px] h-[700px] bg-fe-primary-container/20 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 -left-32 w-[500px] h-[500px] bg-fe-secondary-container/20 rounded-full blur-[120px] pointer-events-none"
        aria-hidden="true"
      />
      <div className="relative max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          {headline && (
            <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-fe-on-surface leading-[1.1] tracking-tight mb-6">
              {headline}
            </h1>
          )}
          {subheadline && (
            <p className="text-lg md:text-xl text-fe-on-surface-variant max-w-2xl mb-10 leading-relaxed">
              {subheadline}
            </p>
          )}
          <Button variant="default" size="xl" asChild>
            <Link href={`/${lang}/auth`}>{ctaLabel}</Link>
          </Button>
        </div>
        {page.coverImageUrl && (
          <div className="lg:col-span-5 relative hidden lg:block">
            <div className="relative z-10 rounded-[2.5rem] overflow-hidden bg-fe-surface-container-lowest p-3 shadow-[0_40px_60px_-15px_rgba(21,28,39,0.10)] transform rotate-3">
              <Image
                src={page.coverImageUrl}
                alt={headline}
                width={600}
                height={400}
                className="rounded-[1.5rem] w-full h-auto object-cover"
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function PainPointsSection({
  items,
  lang,
  dict,
}: {
  items: LandingPageItem[];
  lang: Locale;
  dict: LandingDict;
}) {
  if (!items.length) return null;

  return (
    <section className="py-20 bg-fe-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-fe-on-surface mb-12 text-center">
          {dict.pain_points_heading}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="bg-fe-surface-container-lowest rounded-3xl p-7 border border-fe-outline-variant/15"
            >
              {item.icon && (
                <div className="w-12 h-12 rounded-2xl bg-fe-error-container flex items-center justify-center text-2xl mb-5">
                  {item.icon}
                </div>
              )}
              {item.title && (
                <h3 className="text-lg font-headline font-semibold text-fe-on-surface mb-2">
                  {loc(item.title, lang)}
                </h3>
              )}
              {item.description && (
                <p className="text-fe-on-surface-variant text-sm leading-relaxed">
                  {loc(item.description, lang)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({
  items,
  lang,
  dict,
}: {
  items: LandingPageItem[];
  lang: Locale;
  dict: LandingDict;
}) {
  if (!items.length) return null;

  return (
    <section className="py-20 bg-fe-surface">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <h2 className="text-3xl md:text-4xl font-headline font-bold text-fe-on-surface mb-12 text-center">
          {dict.features_heading}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {items.map((item, i) => (
            <div
              key={i}
              className="group bg-fe-surface-container-lowest rounded-3xl p-8 border border-fe-outline-variant/15 card-hover"
            >
              {item.icon && (
                <div className="w-12 h-12 rounded-2xl bg-fe-primary-fixed flex items-center justify-center text-2xl mb-5">
                  {item.icon}
                </div>
              )}
              {item.title && (
                <h3 className="text-xl font-headline font-bold text-fe-on-surface mb-3">
                  {loc(item.title, lang)}
                </h3>
              )}
              {item.description && (
                <p className="text-fe-on-surface-variant leading-relaxed">
                  {loc(item.description, lang)}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection({ lang, dict }: { lang: Locale; dict: LandingDict }) {
  return (
    <section className="py-24">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="relative bg-fe-inverse-surface rounded-[3rem] p-12 md:p-24 overflow-hidden text-center">
          <div
            className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none"
            aria-hidden="true"
          >
            <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] bg-fe-primary rounded-full blur-[120px]" />
            <div className="absolute -bottom-1/2 -left-1/4 w-[800px] h-[800px] bg-fe-secondary rounded-full blur-[120px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-headline font-extrabold text-white mb-6 tracking-tight">
              {dict.cta_heading}
            </h2>
            <p className="text-xl text-slate-300 max-w-xl mx-auto mb-10 leading-relaxed">
              {dict.cta_sub}
            </p>
            <Button variant="default" size="xl" asChild>
              <Link href={`/${lang}/auth`}>{dict.cta_button}</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default async function LandingPageRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { lang, slug } = await params;
  const [page, dictionary] = await Promise.all([
    getLandingPageBySlug(slug),
    getDictionary(lang),
  ]);

  if (!page) notFound();

  const dict = (dictionary as any).landing as LandingDict;
  const body = lang === 'it' ? page.bodyIt : page.bodyEn;

  return (
    <>
      <HeroSection page={page} lang={lang} dict={dict} />

      {!!page.painPoints?.length && (
        <PainPointsSection items={page.painPoints} lang={lang} dict={dict} />
      )}

      {!!page.features?.length && (
        <FeaturesSection items={page.features} lang={lang} dict={dict} />
      )}

      {body && body.length > 0 && (
        <section className="py-16 bg-fe-surface-container-low">
          <div className="max-w-3xl mx-auto px-6 md:px-8 prose prose-slate
            [&_h2]:text-2xl [&_h2]:font-headline [&_h2]:font-bold [&_h2]:text-fe-on-surface [&_h2]:mb-4
            [&_h3]:text-xl [&_h3]:font-headline [&_h3]:font-semibold [&_h3]:text-fe-on-surface [&_h3]:mb-3
            [&_p]:text-fe-on-surface-variant [&_p]:leading-relaxed [&_p]:mb-4
            [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:text-fe-on-surface-variant
            [&_a]:text-fe-primary [&_a]:underline">
            <PortableText value={body} />
          </div>
        </section>
      )}

      <CtaSection lang={lang} dict={dict} />
    </>
  );
}
