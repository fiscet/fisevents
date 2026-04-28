import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getAlternates } from '@/lib/seo';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const d = (await getDictionary(lang)).website.howItWorks;
  return {
    title: d.meta.title,
    description: d.meta.description,
    alternates: getAlternates('/how-it-works', lang),
  };
}

const STEP_ICONS = ['👤', '🗓️', '🔗', '📋'];

export default async function HowItWorksPage({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params;
  const d = (await getDictionary(lang)).website;

  return (
    <>
      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-48 md:pb-24 overflow-hidden">
        <div
          className="absolute -top-32 -right-32 w-[600px] h-[600px] bg-fe-secondary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center">
          <SectionHeader
            heading={d.howItWorks.title}
            description={d.howItWorks.subtitle}
            align="center"
          />
        </div>
      </section>

      {/* Steps */}
      <section className="pb-24 bg-fe-surface-container-low">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <div className="flex flex-col gap-8">
            {d.howItWorks.steps.map(
              (step: { title: string; text: string }, index: number) => (
                <div
                  key={index}
                  className="flex gap-6 items-start bg-fe-surface-container-lowest rounded-3xl p-8 border border-fe-outline-variant/15 shadow-editorial"
                >
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-fe-primary-fixed flex items-center justify-center text-2xl">
                    {STEP_ICONS[index]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs font-bold text-fe-primary bg-fe-primary-fixed px-2 py-0.5 rounded-full">
                        {index + 1}
                      </span>
                      <h3 className="text-xl font-headline font-bold text-fe-on-surface">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-fe-on-surface-variant leading-relaxed">
                      {step.text}
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-headline font-bold text-fe-on-surface mb-6">
            {d.home.readyToHost}
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="xl" asChild>
              <Link href={`/${lang}/auth`}>{d.home.getStartedFree}</Link>
            </Button>
            <Button variant="outline" size="xl" asChild>
              <Link href={`/${lang}/pricing`}>{d.navbar.pricing}</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
