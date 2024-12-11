'use client';

import { useTransition } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { useEventSingleForm } from '../hooks/useEventSingleForm';
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
import { getPublicEventLink } from '@/lib/utils';
import AddToSite from '../../components/AddToSite';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type EventSingleContainerProps = {
  eventSingleData?: OccurrenceSingle;
  companySlug: string;
};

export default function EventSingleContainer({
  eventSingleData,
  companySlug
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

  const publicLink = getPublicEventLink(
    eventSingleData?.slug!.current!,
    companySlug
  );

  const [isSaving, startProcessing] = useTransition();

  const { form } = useEventSingleForm({
    eventSingleData,
    dictionary: d
  });

  const uploadImage = useUploadImage(newImg);

  const onSubmit = useSubmitHandler(
    eventSingleData,
    d,
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
            <GoToEventList backText={c.back} lang={curLang} />
          }
          centerElements={
            publicLink && (
              <AddToSite
                publicLink={publicLink}
                copyText={c.copy}
                copySuccessText={c.copied}
                copyErrorText={c.copy_error}
              />
            )
          }
          rightElements={
            !!eventSingleData?.attendants?.length && (
              <TabsList>
                <TabsTrigger value="event">
                  {d.event}
                </TabsTrigger>
                <TabsTrigger value="attendants">
                  {d.attendants}
                </TabsTrigger>
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
