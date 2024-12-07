import { getServerSession } from 'next-auth';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { authOptions } from '@/lib/authOptions';
import { NavBar } from './components/NavBar';

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
        dictionary={dictionary}
        lang={lang}
        isLoggedIn={!!session?.user?.email}
      />
      <div className="">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center italic text-xl text-gray-600">
            <q>Effortlessly publish and manage your events!</q>
          </p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-10 flex-grow">
        <section className="text-center mb-12">
          <h2 className="text-2xl font-bold mb-4">Simplify Event Management</h2>
          <p className="text-gray-600 mb-6">
            From cooking workshops to meetings, FisEvents lets you create,
            share, and manage one-time events seamlessly. Get started for free!
          </p>
          [image-hero]
        </section>

        <section id="features" className="mb-16">
          <h3 className="text-2xl font-semibold text-orange-600 text-center mb-8">
            Features
          </h3>
          <div className="grid grid-cols-1  gap-8">
            <div className="flex items-center gap-x-4">
              [image-event-details]
              <div>
                <h4 className="font-semibold text-lg">
                  Customizable Event Details
                </h4>
                <p className="text-gray-600">
                  Add a title, description, image, location, and set maximum
                  participants, price, and currency.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              [image-registration-link]
              <div>
                <h4 className="font-semibold text-lg">
                  Easy Registration Link
                </h4>
                <p className="text-gray-600">
                  Generate and share a unique link for users to register for
                  your event with ease.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              [image-date-management]
              <div>
                <h4 className="font-semibold text-lg">
                  Flexible Date Management
                </h4>
                <p className="text-gray-600">
                  Set start and end dates for publication and manage event
                  timelines effortlessly.
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              [image-free-events]
              <div>
                <h4 className="font-semibold text-lg">
                  Free for First 3 Events
                </h4>
                <p className="text-gray-600">
                  Publish your first three events for free. Pay only 5€ per
                  event after that.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" className="bg-orange-50 py-10 rounded-md">
          <h3 className="text-2xl font-semibold text-orange-600 text-center mb-6">
            Pricing
          </h3>
          <div className="flex flex-col md:flex-row justify-center items-center space-y-6 md:space-y-0 md:space-x-8">
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h4 className="font-semibold text-lg mb-2">Free Plan</h4>
              <p className="text-gray-600 mb-4">
                Perfect for trying out FisEvents.
              </p>
              <ul className="text-sm text-gray-600 mb-4">
                <li>• Publish up to 3 events</li>
                <li>• All core features included</li>
              </ul>
              <span className="text-3xl font-bold text-gray-800">0€</span>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 text-center">
              <h4 className="font-semibold text-lg mb-2">Pro Plan</h4>
              <p className="text-gray-600 mb-4">
                For regular event organizers.
              </p>
              <ul className="text-sm text-gray-600 mb-4">
                <li>• Publish unlimited events</li>
                <li>• All core features included</li>
              </ul>
              <span className="text-3xl font-bold text-gray-800">5€/event</span>
            </div>
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
