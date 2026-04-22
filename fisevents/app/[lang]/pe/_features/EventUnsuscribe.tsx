'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { unsubscribeFromEvent } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import Processing from '@/components/Processing';
import { getPublicEventSlug, getPublicEventUrl } from '@/lib/utils';
import Link from 'next/link';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import type { Locale } from '@/lib/i18n';

export type EventUnsuscribeProps = {
  eventId: string;
  eventSlug: string;
  organizationSlug: string;
  eventAttendantUuid: string;
  eventAttendantEmail: string;
  eventTitle: string;
  companyName: string;
  lang: Locale;
};

export default function EventUnsuscribe({
  eventId,
  eventSlug,
  organizationSlug,
  eventAttendantUuid,
  eventAttendantEmail,
  eventTitle,
  companyName,
  lang,
}: EventUnsuscribeProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { public: d } = useDictionary();
  const { showNotification } = useNotification();

  const publicEventSlug = getPublicEventSlug(eventSlug, organizationSlug);
  const publicUrl = getPublicEventUrl(publicEventSlug);

  useEffect(() => {
    if (!isConfirmed) return;

    startProcessing(() => {
      unsubscribeFromEvent({
        eventId,
        eventAttendantUuid,
        eventAttendantEmail,
        lang,
        emailData: { eventTitle, companyName, organizationSlug, eventSlug },
        alreadyUnsubscribedText: d.errors.already_unsubscribed,
      })
        .then(() => {
          showNotification({ title: 'Success', message: d.unsuscribe_success, type: 'success' });
        })
        .catch((e) => {
          const message = e instanceof Error ? e.message : d.errors.generic;
          showNotification({ title: 'Error', message, type: 'error' });
          setIsConfirmed(false);
        });
    });
  }, [isConfirmed]); // eslint-disable-line react-hooks/exhaustive-deps

  return !isConfirmed ? (
    <>
      <h1 className="text-2xl font-bold text-center mb-5">{d.unsuscribe_title}</h1>
      <p className="text-center mb-5">{d.unsuscribe_confirm}</p>
      <div className="flex justify-center mb-5">
        <Button variant="destructive" onClick={() => setIsConfirmed(true)}>
          {d.unsuscribe_confirm_yes}
        </Button>
      </div>
    </>
  ) : (
    <>
      {isSaving && <Processing text={d.unsubscribing} />}
      <p>If you want to subscribe again click this link:</p>
      <Link className="text-fe-secondary" href={publicUrl}>
        {publicUrl}
      </Link>
    </>
  );
}
