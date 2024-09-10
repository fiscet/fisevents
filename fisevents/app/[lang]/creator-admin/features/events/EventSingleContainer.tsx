'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { CreatorAdminRoutes } from '@/lib/routes';
import { useEventSingleForm } from './hooks/useEventSingleForm';
import ImageUploader from '../../components/ImageUploader';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import EventSingle from './EventSingle';
import Processing from '@/components/Processing';
import UtilityBar from '../../components/UtilityBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import EventAttentantList from './EventAttentantList';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useNotification } from '@/components/Notification/useNotification';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useSubmitHandler } from './hooks/useSubmitHandlers';

export type EventSingleContainerProps = {
  eventSingleData?: OccurrenceSingle;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
};

export default function EventSingleContainer({
  eventSingleData,
  dictionary
}: EventSingleContainerProps) {
  const session = useSession();
  const router = useRouter();
  const { showNotification } = useNotification();

  const {
    initImageUrl,
    newImg,
    setNewImg,
    handleRestoreImage,
    handleDeleteImage,
    setInitImageUrl
  } = useImageHandlers(eventSingleData?.pageImage.url);

  const [isSaving, setIsSaving] = useState(false);

  const { form } = useEventSingleForm({
    eventSingleData,
    dictionary: dictionary.events
  });

  const uploadImage = useUploadImage(newImg);

  const onSubmit = useSubmitHandler(
    eventSingleData,
    dictionary,
    newImg,
    setNewImg,
    setInitImageUrl,
    setIsSaving,
    session,
    router,
    uploadImage,
    showNotification
  );

  return (
    <>
      {isSaving && <Processing text={dictionary.common.saving} />}
      <Tabs defaultValue="event">
        <UtilityBar
          leftElements={
            <Button asChild>
              <Link href={`/${CreatorAdminRoutes.getBase()}`}>
                &larr; {dictionary.events.back}
              </Link>
            </Button>
          }
          rightElements={
            !!eventSingleData?.attendants?.length && (
              <TabsList>
                <TabsTrigger value="event">
                  {dictionary.events.event}
                </TabsTrigger>
                <TabsTrigger value="attendants">
                  {dictionary.events.attendants}
                </TabsTrigger>
              </TabsList>
            )
          }
        />
        <TabsContent value="event">
          <EventSingle
            title={eventSingleData?.title ?? dictionary.events.new_event}
            dictionary={dictionary.events}
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
            dictionary={dictionary.attendants}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
