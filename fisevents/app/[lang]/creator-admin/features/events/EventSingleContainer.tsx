'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { FileImageType } from '@/types/custom.types';
import { Occurrence } from '@/types/sanity.types';
import { toIsoString } from '@/lib/utils';
import { updateEvent } from '@/lib/actions';
import ImageUploader from '../../components/ImageUploader';
import { EventFormSchemaType, getForm } from './eventSingle.form';
import EventSingle from './EventSingle';

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

  const { form } = getForm({ eventSingleData, dictionary });

  const handleRestoreImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: initImageUrl
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
    const insValue = { ...values } as Partial<Occurrence>;

    insValue.publicationStartDate = toIsoString(
      new Date(values.publicationStartDate)
    );
    insValue.startDate = toIsoString(new Date(values.startDate));
    insValue.endDate = toIsoString(new Date(values.endDate));

    let imgRes;

    if (newImg.imgUrl != eventSingleData?.pageImage.url) {
      imgRes = await uploadImage();

      if (imgRes.id) {
        insValue.mainImage = {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: imgRes.id
          }
        };
      } else {
        insValue.mainImage = {} as typeof insValue.mainImage;
      }
    }

    insValue.basicPrice = Number(insValue.basicPrice);

    await updateEvent({
      id: eventSingleData!._id!,
      data: insValue as Partial<Occurrence>
    });

    if (imgRes?.id) {
      setNewImg({
        file: {} as File,
        imgUrl: imgRes!.url!
      });

      setInitImageUrl(imgRes!.url!);
    }
  }

  const MyImageUploader = (
    <ImageUploader
      initImageUrl={initImageUrl}
      img={newImg}
      setImg={setNewImg}
      onRestore={handleRestoreImage}
    />
  );

  return (
    <EventSingle
      title={eventSingleData?.title}
      dictionary={dictionary}
      form={form}
      imageUploader={MyImageUploader}
      onSubmit={onSubmit}
    />
  );
}
