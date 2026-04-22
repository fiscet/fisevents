'use client';

import { useEffect, useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { removeEventAttendant } from '@/lib/actions';
import { sendMail } from '@/lib/send-mail';
import { useNotification } from '@/components/Notification/useNotification';
import Processing from '@/components/Processing';
import { getPublicEventSlug, getPublicEventUrl } from '@/lib/utils';
import Link from 'next/link';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventUnsuscribeProps = {
  eventId: string;
  eventSlug: string;
  organizationSlug: string;
  eventAttendantUuid: string;
  eventAttendantEmail: string;
  eventTitle: string;
  companyName: string;
  emailDictionary: {
    subject: string;
    body_txt: string;
    body_html: string;
  };
};

export default function EventUnsuscribe({
  eventId,
  eventSlug,
  organizationSlug,
  eventAttendantUuid,
  eventAttendantEmail,
  eventTitle,
  companyName,
  emailDictionary,
}: EventUnsuscribeProps) {
  const [isSaving, startProcessing] = useTransition();
  const [isConfirmed, setIsConfirmed] = useState(false);

  const { public: d } = useDictionary();

  const { showNotification } = useNotification();

  const publicEventSlug = getPublicEventSlug(eventSlug, organizationSlug);
  const publicUrl = getPublicEventUrl(publicEventSlug);

  useEffect(() => {
    if (isConfirmed) {
      startProcessing(async () => {
        const alreadyUnsubscribedText = d.errors.already_unsubscribed;

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

            const subject = emailDictionary.subject.replace('%event_title%', eventTitle);
            const text = emailDictionary.body_txt
              .replaceAll('%event_title%', eventTitle)
              .replaceAll('%company_name%', companyName)
              .replaceAll('%public_url%', publicUrl);
            const html = emailDictionary.body_html
              .replaceAll('%event_title%', eventTitle)
              .replaceAll('%company_name%', companyName)
              .replaceAll('%public_url%', publicUrl);

            sendMail({ sendTo: eventAttendantEmail, subject, text, html });
          })
          .catch((e) => {
            const message = e instanceof Error ? e.message : d.errors.generic;

            showNotification({
              title: 'Error',
              message: message,
              type: 'error'
            });

            setIsConfirmed(false);
          });
      });
    }
  }, [isConfirmed, d.errors.already_unsubscribed, d.unsuscribe_success, d.errors.generic, eventAttendantUuid, eventId, showNotification, emailDictionary, eventTitle, companyName, publicUrl, eventAttendantEmail]);

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
      <Link className="text-fe-secondary" href={publicUrl}>
        {publicUrl}
      </Link>
    </>
  );
}
