import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import Image from 'next/image';
import HPCarousel from './components/HPCarousel';
import Payoff from './components/Payoff';

export default async function MainPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const dictionary = await getDictionary(lang);

  return (
    <>
      <Payoff text={dictionary.website.home.payoff} />
      <section className="text-center mb-12">
        <h2 className="text-2xl font-bold mb-4">
          {dictionary.website.home.subtitle}
        </h2>
        <p className="text-gray-600 mb-6">
          {dictionary.website.home.main_text}
        </p>
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
          {dictionary.website.home.features.title}
        </h3>
        <div className="max-w-[600px] mx-auto pb-4">
          <h4 className="font-semibold text-lg">
            {dictionary.website.home.features.list.reg_link.title}
          </h4>
          <ul className="list-disc list-inside text-gray-600 mb-2">
            <li>{dictionary.website.home.features.list.reg_link.title}</li>
            <li>{dictionary.website.home.features.list.events.title}</li>
            <li>
              {dictionary.website.home.features.list.date_management.title}
            </li>
            <li id="pricing">
              {dictionary.website.home.features.list.start_free.title}
            </li>
          </ul>
        </div>

        <HPCarousel />
      </section>
    </>
  );
}
