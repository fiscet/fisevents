import { authOptions } from '@/lib/authOptions';
import { getEventSingleById, getEventIdList, getUser } from '@/lib/actions';
import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { getServerSession } from 'next-auth';
import EventSingle from '../features/EventSingleContainer';

export async function generateStaticParams() {
  const slugData = await getEventIdList({
    active: true
  });

  if (!slugData.length) {
    return []; // Return an empty array if there are no events
  }

  return slugData.map((id) => ({
    slug: [id._id]
  }));
}

export default async function EventSinglePage({
  params: { lang, slug }
}: {
  params: { lang: Locale; slug?: string[] };
}) {
  const session = await getServerSession(authOptions);

  const dictionary = await getDictionary(lang);

  const userData = await getUser({ userId: session!.user!.uid! });

  if (!userData.curOrganization?.companySlug) {
    return <></>;
  }

  const eventSingleData =
    slug && slug.length > 0 && session?.user
      ? await getEventSingleById({
          createdBy: session.user.uid as string,
          id: slug[0]
        })
      : undefined;

  return (
    <EventSingle
      eventSingleData={eventSingleData}
      companySlug={userData.curOrganization!.companySlug!}
      dictionary={dictionary.creator_admin}
    />
  );
}
