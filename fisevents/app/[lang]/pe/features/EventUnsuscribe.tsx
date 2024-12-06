'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { removeEventAttendant } from '@/lib/actions';
import { useNotification } from '@/components/Notification/useNotification';
import { getDictionary } from '@/lib/i18n.utils';
import Processing from '@/components/Processing';
import { getPublicEventLink } from '@/lib/utils';
import Link from 'next/link';

export type EventUnsuscribeProps = {
  eventId: string;
  eventSlug: string;
  companySlug: string;
  eventAttendantUuid: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['public'];
};

export default function EventUnsuscribe({
  eventId,
  eventSlug,
  companySlug,
  eventAttendantUuid,
  dictionary
}: EventUnsuscribeProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { showNotification } = useNotification();

  const publicLink = getPublicEventLink(eventSlug, companySlug);

  useEffect(() => {
    if (isConfirmed) {
      startProcessing(async () => {
        const alreadyUnsubscribedText =
          dictionary.unsuscribe_error_already_unsubscribed;

        removeEventAttendant({
          eventId,
          eventAttendantUuid,
          alreadyUnsubscribedText
        })
          .then(() => {
            showNotification({
              title: 'Success',
              message: dictionary.unsuscribe_success,
              type: 'success'
            });
          })
          .catch((e) => {
            const message =
              e instanceof Error ? e.message : dictionary.unsuscribe_error;

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
        {dictionary.unsuscribe_title}
      </h1>
      <p className="text-center mb-5">{dictionary.unsuscribe_confirm}</p>
      <div className="flex justify-center mb-5">
        <Button
          variant="destructive"
          onClick={() => {
            setIsConfirmed(true);
          }}
        >
          {dictionary.unsuscribe_confirm_yes}
        </Button>
      </div>
    </>
  ) : (
    <>
      {isSaving && <Processing text={dictionary.unsubscribing} />}
      <p>If you want to subscribe again click this link:</p>
      <Link className="text-cyan-700" href={publicLink}>
        {publicLink}
      </Link>
    </>
  );
}
