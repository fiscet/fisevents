import { getUserBySlug, getPublicEventListByOrgSlug } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { notFound } from 'next/navigation';
import OrgEventCard from '../_components/OrgEventCard';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

export default async function OrganizerPage({
  params,
}: {
  params: Promise<{ lang: Locale; 'organization-slug': string }>;
}) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  const orgSlug = resolvedParams['organization-slug'];

  const [userData, events, dict] = await Promise.all([
    getUserBySlug({ slug: orgSlug }),
    getPublicEventListByOrgSlug({ orgSlug }),
    getDictionary(lang),
  ]);

  if (!userData) return notFound();

  const d = dict.public.organizer_page;
  const displayName = userData.companyName ?? userData.name ?? orgSlug;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Organizer header */}
      <div className="flex flex-col items-center gap-4 mb-10 text-center">
        <Avatar className="w-20 h-20">
          {userData.logoUrl ? (
            <AvatarImage src={userData.logoUrl} alt={displayName} />
          ) : (
            <AvatarFallback className="text-2xl font-bold bg-fe-primary-container text-fe-on-primary-container">
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold text-fe-on-surface">{displayName}</h1>
          {userData.www && (
            <a
              href={userData.www}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-fe-primary hover:underline mt-1 inline-block"
            >
              {userData.www}
            </a>
          )}
        </div>
      </div>

      <h2 className="text-lg font-semibold mb-6 text-center text-fe-on-surface-variant">
        {d.title}
      </h2>

      {events.length === 0 ? (
        <p className="text-center text-fe-on-surface-variant py-16">{d.no_events}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <OrgEventCard
              key={event._id}
              event={event}
              lang={lang}
              registerLabel={d.register}
              fullLabel={d.full}
              placesLeftLabel={d.places_left}
            />
          ))}
        </div>
      )}
    </div>
  );
}
