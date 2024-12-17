'use client';

import { useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { useEventSingleForm } from '../hooks/useEventSingleForm';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploader from '../../components/ImageUploader';
import EventSingle from './EventSingle';
import Processing from '@/components/Processing';
import UtilityBar from '../../components/UtilityBar';
import EventAttentantList from './EventAttentantList';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useNotification } from '@/components/Notification/useNotification';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useSubmitHandler } from '../hooks/useSubmitHandler';
import GoToEventList from '../../components/GoToEventList';
import AddToSite from '../../components/AddToSite';
import { getPublicEventUrl } from '@/lib/utils';

export type EventSingleContainerProps = {
  eventSingleData?: OccurrenceSingle;
  organizationSlug: string;
};

export default function EventSingleContainer({
  eventSingleData,
  organizationSlug
}: EventSingleContainerProps) {
  const session = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();
  const curLang = useCurrentLang();

  const { creator_admin: ca } = useDictionary();
  const { events: d, common: c } = ca;

  const {
    initImageUrl,
    newImg,
    setNewImg,
    handleRestoreImage,
    handleDeleteImage,
    setInitImageUrl
  } = useImageHandlers(eventSingleData?.pageImage.url);

  const [isSaving, startProcessing] = useTransition();

  const { form } = useEventSingleForm({
    eventSingleData
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
    showNotification
  );

  return (
    <>
      {isSaving && <Processing text={c.saving} />}
      <Tabs defaultValue="event">
        <UtilityBar
          leftElements={
            <GoToEventList label={c.goto_event_list} lang={curLang} />
          }
          centerElements={
            eventSingleData?.publicSlug && (
              <AddToSite
                publicUrl={publicUrl}
                title={d.public_link}
                description={d.descriptions.public_link}
                copyText={c.copy}
                copySuccessText={c.copied}
                copyErrorText={c.copy_error}
              />
            )
          }
          rightElements={
            !!eventSingleData?.attendants?.length && (
              <TabsList>
                <TabsTrigger value="event">{d.event}</TabsTrigger>
                <TabsTrigger value="attendants">{d.attendants}</TabsTrigger>
              </TabsList>
            )
          }
        />
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
