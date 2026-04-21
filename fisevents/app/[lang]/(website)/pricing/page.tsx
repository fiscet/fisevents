import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionHeader } from '@/components/SectionHeader/SectionHeader';
import HPPricing from '../_components/HPPricing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const d = (await getDictionary(lang)).website.pricingPage;
  return {
    title: d.meta.title,
    description: d.meta.description,
  };
}

export default async function PricingPage({
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
          className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-fe-primary-container/10 rounded-full blur-[120px] pointer-events-none"
          aria-hidden="true"
        />
        <div className="relative max-w-7xl mx-auto px-6 md:px-8 text-center">
          <SectionHeader
            heading={d.pricingPage.title}
            description={d.pricingPage.subtitle}
            align="center"
          />
          <HPPricing />
        </div>
      </section>

      {/* FAQ */}
      <section className="py-24 bg-fe-surface-container-low">
        <div className="max-w-3xl mx-auto px-6 md:px-8">
          <h2 className="text-3xl font-headline font-bold text-fe-on-surface mb-12 text-center">
            {d.pricingPage.faq.title}
          </h2>
          <div className="flex flex-col gap-6">
            {d.pricingPage.faq.items.map(
              (item: { q: string; a: string }, index: number) => (
                <div
                  key={index}
                  className="bg-fe-surface-container-lowest rounded-2xl p-6 border border-fe-outline-variant/15"
                >
                  <h3 className="font-headline font-semibold text-fe-on-surface mb-2">
                    {item.q}
                  </h3>
                  <p className="text-fe-on-surface-variant text-sm leading-relaxed">
                    {item.a}
                  </p>
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
          <Button variant="default" size="xl" asChild>
            <Link href={`/${lang}/auth`}>{d.home.getStartedFree}</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
