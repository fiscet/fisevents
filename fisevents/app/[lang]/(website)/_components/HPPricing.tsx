'use client';

import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function HPPricing() {
  const { website: d } = useDictionary();
  const params = useParams();
  const lang = params?.lang as string;

  return (
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-3xl mx-auto">
      {/* Starter plan */}
      <div className="flex-1 bg-fe-surface-container-lowest rounded-3xl p-8 border border-fe-outline-variant/15 shadow-editorial flex flex-col">
        <h4 className="font-headline font-bold text-xl text-fe-on-surface mb-2">
          {d.home.pricing.list.starter.title}
        </h4>
        <p className="text-fe-on-surface-variant text-sm mb-6">
          {d.home.pricing.list.starter.text}
        </p>
        <ul className="space-y-3 mb-8 flex-grow">
          {d.home.pricing.list.starter.features.map((feature: string) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-fe-on-surface-variant"
            >
              <span className="text-fe-secondary mt-0.5" aria-hidden="true">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mb-6">
          <span className="text-4xl font-headline font-extrabold text-fe-on-surface tracking-tight">
            0€
          </span>
          <span className="text-fe-on-surface-variant text-sm ml-2">
            /mese
          </span>
        </div>
        <Button variant="outline" size="lg" asChild className="w-full">
          <Link href={`/${lang}/auth`}>{d.home.getStarted}</Link>
        </Button>
      </div>

      {/* Hero plan */}
      <div className="flex-1 bg-gradient-to-br from-fe-primary to-fe-primary-container rounded-3xl p-8 flex flex-col relative overflow-hidden">
        <div
          className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-bl-full pointer-events-none"
          aria-hidden="true"
        />
        <h4 className="font-headline font-bold text-xl text-fe-on-primary mb-2">
          {d.home.pricing.list.hero.title}
        </h4>
        <p className="text-fe-on-primary/80 text-sm mb-6">
          {d.home.pricing.list.hero.text}
        </p>
        <ul className="space-y-3 mb-8 flex-grow">
          {d.home.pricing.list.hero.features.map((feature: string) => (
            <li
              key={feature}
              className="flex items-start gap-2 text-sm text-fe-on-primary/90"
            >
              <span className="text-white mt-0.5" aria-hidden="true">
                ✓
              </span>
              {feature}
            </li>
          ))}
        </ul>
        <div className="mb-6">
          <span className="text-4xl font-headline font-extrabold text-fe-on-primary tracking-tight">
            4,70€
          </span>
          <span className="text-fe-on-primary/70 text-sm ml-2">/evento</span>
        </div>
        <Button
          variant="ghost"
          size="lg"
          asChild
          className="w-full bg-white/15 text-fe-on-primary hover:bg-white/25 border border-white/20"
        >
          <Link href={`/${lang}/auth`}>{d.home.getStarted}</Link>
        </Button>
      </div>
    </div>
  );
}
