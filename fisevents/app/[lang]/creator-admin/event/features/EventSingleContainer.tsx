'use client';

import { useEffect, useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { useEventSingleForm } from '../hooks/useEventSingleForm';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '../../_components/ImageUploader';
import EventSingle from './EventSingle';
import Processing from '@/components/Processing';
import UtilityBar from '../../_components/UtilityBar';
import EventAttentantList from './EventAttentantList';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useNotification } from '@/components/Notification/useNotification';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useSubmitHandler } from '../hooks/useSubmitHandler';
import GoToEventList from '../../_components/GoToEventList';
import AddToSite from '../../_components/AddToSite';
import { getPublicEventUrl } from '@/lib/utils';
import { resumeOrCreateCheckout } from '@/lib/actions';
import { Button } from '@/components/ui/button';

export type EventSingleContainerProps = {
  eventSingleData?: OccurrenceSingle;
  organizationSlug: string;
};

export default function EventSingleContainer({
  eventSingleData,
  organizationSlug,
}: EventSingleContainerProps) {
  const session = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const curLang = useCurrentLang();

  const { creator_admin: ca } = useDictionary();
  const { events: d, shared: s } = ca;

  const {
    initImageUrl,
    newImg,
    setNewImg,
    handleRestoreImage,
    handleDeleteImage,
    setInitImageUrl,
  } = useImageHandlers(eventSingleData?.pageImage.url);

  const [isSaving, startProcessing] = useTransition();

  const tabParams = useSearchParams();

  const tab = tabParams.get('tab');
  const paymentStatus = tabParams.get('payment');

  const { form } = useEventSingleForm({
    eventSingleData,
  });

  const publicUrl = getPublicEventUrl(eventSingleData?.publicSlug);

  const uploadImage = useUploadImage(newImg);

  const onSubmit = useSubmitHandler(
    eventSingleData,
    organizationSlug,
    newImg,
    setNewImg,
    setInitImageUrl,
    startProcessing,
    session,
    router,
    uploadImage,
    showNotification,
    curLang
  );

  const isPaymentPending =
    !!eventSingleData?.pendingPayment || eventSingleData?.active === false;

  useEffect(() => {
    if (paymentStatus === 'success') {
      showNotification({
        title: s.success,
        message: isPaymentPending ? s.payment_processing : s.payment_success,
        type: isPaymentPending ? 'info' : 'success',
      });
    } else if (paymentStatus === 'cancelled') {
      showNotification({
        title: s.error,
        message: s.payment_cancelled,
        type: 'error',
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (paymentStatus !== 'success' || !isPaymentPending) return;
    const interval = setInterval(() => {
      router.refresh();
    }, 3000);
    const warningTimeout = setTimeout(() => {
      showNotification({
        title: s.error,
        message: s.payment_timeout_warning,
        type: 'warning',
      });
    }, 30000);
    return () => {
      clearInterval(interval);
      clearTimeout(warningTimeout);
    };
  }, [paymentStatus, isPaymentPending, router, showNotification, s]);

  const isExistingEvent = !!eventSingleData;

  const [isRedirecting, startRedirect] = useTransition();

  const handleCompletePayment = () => {
    if (!eventSingleData?._id) return;
    startRedirect(async () => {
      try {
        const { paymentUrl } = await resumeOrCreateCheckout({
          occurrenceId: eventSingleData._id!,
          lang: curLang,
        });
        window.location.href = paymentUrl;
      } catch {
        showNotification({ title: s.error, message: s.error_text, type: 'error' });
      }
    });
  };

  return (
    <>
      {(isSaving || isRedirecting) && <Processing text={s.saving} />}
      {isPaymentPending && !paymentStatus && (
        <div className="mx-4 mt-4 flex items-center justify-between gap-4 rounded-lg border border-yellow-300 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
          <span>{s.payment_pending_notice}</span>
          <Button
            size="sm"
            className="shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white"
            onClick={handleCompletePayment}
            disabled={isRedirecting}
          >
            {s.complete_payment}
          </Button>
        </div>
      )}
      <Tabs defaultValue={tab ?? 'event'}>
        <UtilityBar
          leftElements={
            <GoToEventList label={s.goto_event_list} lang={curLang} />
          }
          centerElements={
            eventSingleData?.publicSlug && (
              <AddToSite
                publicUrl={publicUrl}
                title={d.public_link}
                description={d.descriptions.public_link}
                copyText={s.copy}
                copySuccessText={s.copied}
                copyErrorText={s.copy_error}
              />
            )
          }
        />

        {isExistingEvent && (
          <div className="flex justify-center mt-4 mb-2">
            <TabsList>
              <TabsTrigger value="event">{d.event}</TabsTrigger>
              <TabsTrigger value="attendants">
                {d.attendants}
                {!!eventSingleData.attendants?.length && (
                  <span className="ml-2 inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-fe-secondary-container text-fe-on-secondary-container text-xs font-semibold">
                    {eventSingleData.attendants.length}
                  </span>
                )}
              </TabsTrigger>
            </TabsList>
          </div>
        )}

        <TabsContent value="event">
          <EventSingle
            title={eventSingleData?.title ?? d.new_event}
            form={form}
            imageUploaderRender={() => (
              <ImageUploader
                initImageUrl={initImageUrl}
                img={newImg}
                setImg={setNewImg}
                onRestore={handleRestoreImage}
                onDelete={handleDeleteImage}
              />
            )}
            onSubmit={onSubmit}
          />
        </TabsContent>
        <TabsContent value="attendants">
          <EventAttentantList
            eventId={eventSingleData?._id}
            attendants={eventSingleData?.attendants}
            eventDescription={`${eventSingleData?.title} - ${new Date(
              eventSingleData?.startDate!
            ).toLocaleDateString()}`}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
