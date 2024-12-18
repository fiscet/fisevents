import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';

import HPCarousel from './_components/HPCarousel';
import Payoff from './_components/Payoff';
import { Metadata } from 'next';

export async function generateMetadata({
  params
}: {
  params: {
    lang: Locale;
  };
}): Promise<Metadata> {
  const { lang } = params;

  const dictionary = (await getDictionary(lang)).website.home;

  return {
    title: dictionary.meta.title,
    description: dictionary.meta.description,
    keywords: dictionary.meta.keywords,
    openGraph: {
      title: dictionary.meta.title,
      description: dictionary.meta.description,
      url: 'https://fisevents.vercel.app/',
      images: [
        {
          url: '/img/og-image.png',
          width: 800,
          height: 600,
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
    viewport: 'width=device-width, initial-scale=1',
    robots: 'index, follow'
  };
}

export default async function HomePage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dictionary = (await getDictionary(lang)).website.home;

  return (
    <>
      <Payoff text={dictionary.payoff} />
      <section className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">{dictionary.subtitle}</h2>
        <p className="text-gray-600 mb-6">{dictionary.main_text}</p>
        <Image
          src="/img/hp-fisevents.jpg"
          alt="hp-fisevents"
          width={1024}
          height={500}
          className="mx-auto"
        />
      </section>

      <section id="features" className="mb-16">
        <h3 className="text-2xl font-semibold text-orange-600 text-center mb-8">
          {dictionary.features.title}
        </h3>
        <div className="max-w-[600px] mx-auto pb-4">
          <Accordion type="single" collapsible>
            <AccordionItem value="unique-item" className="border-none">
              <AccordionTrigger>
                {dictionary.features.list.reg_link.title}
              </AccordionTrigger>
              <AccordionContent className="p-1">
                {dictionary.features.list.reg_link.text}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="unique-item" className="border-none">
              <AccordionTrigger>
                {dictionary.features.list.events.title}
              </AccordionTrigger>
              <AccordionContent className="p-1">
                {dictionary.features.list.events.text}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="unique-item" className="border-none">
              <AccordionTrigger>
                {dictionary.features.list.date_management.title}
              </AccordionTrigger>
              <AccordionContent className="p-1">
                {dictionary.features.list.date_management.text}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Accordion type="single" collapsible>
            <AccordionItem value="unique-item" className="border-none">
              <AccordionTrigger>
                {dictionary.features.list.start_free.title}
              </AccordionTrigger>
              <AccordionContent className="p-1">
                {dictionary.features.list.start_free.text}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
        <HPCarousel />
      </section>
    </>
  );
}
