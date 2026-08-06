'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { confirmWaitlistOffer } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import Processing from '@/components/Processing';
import { getPublicEventSlug, getPublicEventUrl } from '@/lib/utils';
import Link from 'next/link';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import type { Locale } from '@/lib/i18n';

export type EventWaitlistAcceptProps = {
  eventId: string;
  eventSlug: string;
  organizationSlug: string;
  eventAttendantUuid: string;
  eventTitle: string;
  description?: string;
  location?: string;
  talkTo?: string;
  startDate?: string;
  endDate?: string;
  timeZone?: string;
  companyName: string;
  organizerEmail?: string;
  lang: Locale;
};

export default function EventWaitlistAccept({
  eventId,
  eventSlug,
  organizationSlug,
  eventAttendantUuid,
  eventTitle,
  description,
  location,
  talkTo,
  startDate,
  endDate,
  timeZone,
  companyName,
  organizerEmail,
  lang,
}: EventWaitlistAcceptProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isDone, setIsDone] = useState(false);

  const { public: d } = useDictionary();
  const { showNotification } = useNotification();

  const publicUrl = getPublicEventUrl(getPublicEventSlug(eventSlug, organizationSlug));

  const handleAccept = () => {
    startProcessing(async () => {
      try {
        await confirmWaitlistOffer({
          eventId,
          eventAttendantUuid,
          lang,
          emailData: {
            eventTitle,
            description,
            location,
            talkTo,
            startDate,
            endDate,
            timeZone,
            companyName,
            organizationSlug,
            eventSlug,
            organizerEmail,
          },
        });
        showNotification({ title: d.success, message: d.waitlist_accept_success, type: 'success' });
        setIsDone(true);
      } catch (e) {
        const message = e instanceof Error
          ? (d.errors[e.message as keyof typeof d.errors] ?? d.errors.generic)
          : d.errors.generic;
        showNotification({ title: d.errors.default_title, message, type: 'error' });
      }
    });
  };

  if (isDone) {
    return (
      <>
        <p>{d.waitlist_accept_success}</p>
        <Link className="text-fe-secondary" href={publicUrl}>
          {publicUrl}
        </Link>
      </>
    );
  }

  return (
    <>
      {isSaving && <Processing text={d.accepting} />}
      <h1 className="text-2xl font-bold text-center mb-5">{d.waitlist_accept_title}</h1>
      <p className="text-center mb-5">{d.waitlist_accept_confirm}</p>
      <div className="flex justify-center mb-5">
        <Button onClick={handleAccept} disabled={isSaving}>
          {d.waitlist_accept_button}
        </Button>
      </div>
    </>
  );
}
