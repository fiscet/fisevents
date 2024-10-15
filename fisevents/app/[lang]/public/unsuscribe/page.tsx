import { removeEventAttendant } from '@/lib/actions';
import { Locale } from '@/lib/i18n';

export default async function UnsuscribePage({
  params: { lang },
  searchParams: { eventId, eventAttendantUuid, eventAttendantEmail }
}: {
  params: { lang: Locale };
  searchParams: {
    eventId: string;
    eventAttendantUuid: string;
    eventAttendantEmail: string;
  };
}) {
  try {
    const res = await removeEventAttendant({
      eventId,
      eventAttendantUuid
    });
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Unsusbcribe generic error';
    console.error('Unsusbcribe', message);
  }

  return (
    <div>
      <h1>Unsuscribe</h1>
    </div>
  );
}
