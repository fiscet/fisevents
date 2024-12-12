import { getServerSession } from 'next-auth';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { authOptions } from '@/lib/authOptions';
import { NavBar } from './components/NavBar';
import Image from 'next/image';
import HPCarousel from './components/HPCarousel';

export default async function MainPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const session = await getServerSession(authOptions);
  const dictionary = await getDictionary(lang);

  return (
    <div className="text-gray-800 pt-[115px] md:pt-[200px] flex flex-col min-h-screen">
      <NavBar
        lang={lang}
        isLoggedIn={!!session?.user?.email}
      />
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center italic text-xl text-gray-600">
            <q>{dictionary.website.home.payoff}</q>
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 flex-grow">
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
          <div className="grid grid-cols-1 text-center gap-8">
            <div>
              <h4 className="font-semibold text-lg">
                {dictionary.website.home.features.list.login.title}
              </h4>
              <p className="text-gray-600 mb-2">
                {dictionary.website.home.features.list.login.text}
              </p>
              <Image
                src="/img/sh-login.jpg"
                alt="hp-event-details"
                width={1024}
                height={300}
                className="mx-auto"
              />
            </div>
            <div>
              <h4 className="font-semibold text-lg">
                {dictionary.website.home.features.list.events.title}
              </h4>
              <p className="text-gray-600 mb-2">
                {dictionary.website.home.features.list.events.text}
              </p>
              <HPCarousel />
            </div>
            <hr />
            <div>
              <h4 className="font-semibold text-lg">
                {dictionary.website.home.features.list.date_management.title}
              </h4>
              <p className="text-gray-600 mb-2">
                {dictionary.website.home.features.list.date_management.text}
              </p>
              <Image
                src="/img/sh-event-3.jpg"
                alt="hp-event-details"
                width={1024}
                height={300}
                className="mx-auto"
              />
            </div>
            {/* <div>
              <h4 className="font-semibold text-lg">Free for First 3 Events</h4>
              <p className="text-gray-600">
                {dictionary.website.home.features.list.start_free.text}
              </p>
            </div> */}
          </div>
        </section>
      </main>

      <footer className="bg-gray-100 py-6 text-center">
        <p className="text-gray-600 text-sm">
          &copy; {new Date().getFullYear()} FisEvents. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
