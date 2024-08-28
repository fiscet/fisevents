'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { FileImageType } from '@/types/custom.types';
import { Occurrence } from '@/types/sanity.types';
import { toUserIsoString } from '@/lib/utils';
import { updateEvent } from '@/lib/actions';
import { EventFormSchemaType, useEventSingleForm } from './useEventSingleForm';
import ImageUploader from '../../components/ImageUploader';
import EventSingle from './EventSingle';
import Processing from '@/components/Processing';

export type EventSingleContainerProps = {
  eventSingleData?: OccurrenceSingle;
  dictionary: Awaited<
    ReturnType<typeof getDictionary>
  >['creator_admin']['events'];
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

  const { form } = useEventSingleForm({ eventSingleData, dictionary });

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

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', newImg.file);

    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData
    });
    return (await response.json()) as {
      status: string;
      id?: string;
      url?: string;
      error?: any;
    };
  };

  async function onSubmit(values: EventFormSchemaType) {
    setIsSaving(true);

    const insValues = { ...values } as Partial<Occurrence>;

    insValues.publicationStartDate = toUserIsoString(
      new Date(values.publicationStartDate)
    );
    insValues.startDate = toUserIsoString(new Date(values.startDate));
    insValues.endDate = toUserIsoString(new Date(values.endDate));

    let imgRes;

    if (newImg.imgUrl != eventSingleData?.pageImage.url) {
      imgRes = await uploadImage();

      if (imgRes.id) {
        insValues.mainImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imgRes.id
          }
        };
      } else {
        insValues.mainImage = {} as typeof insValues.mainImage;
      }
    }

    insValues.basicPrice = Number(insValues.basicPrice);

    await updateEvent({
      id: eventSingleData!._id!,
      data: insValues as Partial<Occurrence>
    });

    if (imgRes?.id) {
      setNewImg({
        file: {} as File,
        imgUrl: imgRes!.url!
      });

      setInitImageUrl(imgRes!.url!);
    }

    setIsSaving(false);
  }

  const MyImageUploader = (
    <ImageUploader
      initImageUrl={initImageUrl}
      img={newImg}
      setImg={setNewImg}
      onRestore={handleRestoreImage}
      onDelete={handleDeleteImage}
    />
  );

  return (
    <>
      {isSaving && <Processing text={dictionary.saving} />}
      <EventSingle
        title={eventSingleData?.title}
        dictionary={dictionary}
        form={form}
        imageUploader={MyImageUploader}
        onSubmit={onSubmit}
      />
    </>
  );
}
