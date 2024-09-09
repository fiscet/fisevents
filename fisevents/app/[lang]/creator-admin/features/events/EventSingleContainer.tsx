'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toUserIsoString } from '@/lib/utils';
import { createEvent, updateEvent } from '@/lib/actions';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { FileImageType } from '@/types/custom.types';
import { Occurrence } from '@/types/sanity.types';
import { CreatorAdminRoutes } from '@/lib/routes';
import {
  EventFormSchemaType,
  useEventSingleForm
} from './hooks/useEventSingleForm';
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

export type EventSingleContainerProps = {
  eventSingleData?: OccurrenceSingle;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
};

export default function EventSingleContainer({
  eventSingleData,
  dictionary
}: EventSingleContainerProps) {
  const [initImageUrl, setInitImageUrl] = useState(
    eventSingleData?.pageImage.url ?? ''
  );

  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: eventSingleData?.pageImage.url ?? ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const { form } = useEventSingleForm({
    eventSingleData,
    dictionary: dictionary.events
  });

  const session = useSession();

  const router = useRouter();

  const uploadImage = useUploadImage(newImg);

  const isNewEvent = !eventSingleData;

  const title = eventSingleData?.title ?? dictionary.events.new_event;

  const { showNotification } = useNotification();

  const handleRestoreImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: initImageUrl
    });
  };

  const handleDeleteImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: ''
    });
  };

  async function onSubmit(values: EventFormSchemaType) {
    setIsSaving(true);

    const { ...restValues } = values;

    const insValues = { ...restValues } as Partial<Occurrence>;

    insValues.publicationStartDate = toUserIsoString(
      new Date(values.publicationStartDate)
    );
    insValues.startDate = toUserIsoString(new Date(values.startDate));
    insValues.endDate = toUserIsoString(new Date(values.endDate));

    let imgRes;

    try {
      if (newImg.imgUrl && newImg.imgUrl != eventSingleData?.pageImage.url) {
        imgRes = await uploadImage();

        if (imgRes.id) {
          insValues.mainImage = {
            _type: 'image',
            asset: {
              _type: 'reference',
              _ref: imgRes.id
            }
          };
        }
      }
      if (!newImg.imgUrl) {
        insValues.mainImage = {} as typeof insValues.mainImage;
      }

      insValues.basicPrice = Number(insValues.basicPrice);

      if (isNewEvent) {
        insValues.createdByUser = {
          _type: 'reference',
          _ref: session.data!.user!.uid as string
        };
        insValues._type = 'occurrence';

        const res = await createEvent({ data: insValues as Occurrence });

        if (res.slug?.current) {
          router.push(
            `/${CreatorAdminRoutes.getItem('event')}/${res.slug.current}`
          );
        }
      } else {
        await updateEvent({
          id: eventSingleData!._id!,
          data: insValues as Partial<Occurrence>
        });
      }

      if (imgRes?.id) {
        setNewImg({
          file: {} as File,
          imgUrl: imgRes!.url!
        });

        setInitImageUrl(imgRes!.url!);
      }
    } catch (error) {
      showNotification({
        title: dictionary.common.error,
        message: dictionary.common.error_text,
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  }

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
            eventSingleData?.attendants?.length && (
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
            title={title}
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
