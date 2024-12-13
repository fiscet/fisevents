'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { removeEventAttendant } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import Processing from '@/components/Processing';
import { getPublicEventLink } from '@/lib/utils';
import Link from 'next/link';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventUnsuscribeProps = {
  eventId: string;
  eventSlug: string;
  organizationSlug: string;
  eventAttendantUuid: string;
};

export default function EventUnsuscribe({
  eventId,
  eventSlug,
  organizationSlug,
  eventAttendantUuid
}: EventUnsuscribeProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { public: d } = useDictionary();

  const { showNotification } = useNotification();

  const publicLink = getPublicEventLink(eventSlug, organizationSlug);

  useEffect(() => {
    if (isConfirmed) {
      startProcessing(async () => {
        const alreadyUnsubscribedText = d.unsuscribe_error_already_unsubscribed;

        removeEventAttendant({
          eventId,
          eventAttendantUuid,
          alreadyUnsubscribedText
        })
          .then(() => {
            showNotification({
              title: 'Success',
              message: d.unsuscribe_success,
              type: 'success'
            });
          })
          .catch((e) => {
            const message = e instanceof Error ? e.message : d.unsuscribe_error;

            showNotification({
              title: 'Error',
              message: message,
              type: 'error'
            });

            setIsConfirmed(false);
          });
      });
    }
  }, [isConfirmed]);

  return !isConfirmed ? (
    <>
      <h1 className="text-2xl font-bold text-center mb-5">
        {d.unsuscribe_title}
      </h1>
      <p className="text-center mb-5">{d.unsuscribe_confirm}</p>
      <div className="flex justify-center mb-5">
        <Button
          variant="destructive"
          onClick={() => {
            setIsConfirmed(true);
          }}
        >
          {d.unsuscribe_confirm_yes}
        </Button>
      </div>
    </>
  ) : (
    <>
      {isSaving && <Processing text={d.unsubscribing} />}
      <p>If you want to subscribe again click this link:</p>
      <Link className="text-cyan-700" href={publicLink}>
        {publicLink}
      </Link>
    </>
  );
}
