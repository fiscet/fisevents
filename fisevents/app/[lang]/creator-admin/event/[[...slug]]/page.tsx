import { authOptions } from '@/lib/authOptions';
import { getEventSingle } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getServerSession } from 'next-auth';
import EventSingle from '../../features/events/EventSingleContainer';

export default async function EventSinglePage({
  params: { lang, slug }
}: {
  params: { lang: Locale; slug?: string[] };
}) {
  const session = await getServerSession(authOptions);

  const dictionary = await getDictionary(lang);

  const eventSingleData =
    slug && slug.length > 0 && session?.user
      ? await getEventSingle({
          createdBy: session.user.uid as string,
          slug: slug[0]
        })
      : undefined;

  return (
    <EventSingle
      eventSingleData={eventSingleData}
      dictionary={dictionary.creator_admin}
    />
  );
}
