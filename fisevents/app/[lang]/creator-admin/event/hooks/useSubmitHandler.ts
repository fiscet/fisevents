import { useNotification } from '@/components/Notification/useNotification';
import { useUploadImage } from '@/hooks/useUploadImage';
import { FileImageType } from '@/types/custom.types';
import { OccurrenceSingle } from '@/types/sanity.extended.types';
import { useSession } from 'next-auth/react';
import { EventFormSchemaType } from './useEventSingleForm';
import { Occurrence } from '@/types/sanity.types';
import { getPublicEventSlug, slugify, toUserIsoString } from '@/lib/utils';
import { fromDatetimeLocalToISO, safeParseDate } from '@/lib/date-utils';
import { createEvent, updateEvent } from '@/lib/actions';
import { CreatorAdminRoutes } from '@/lib/routes';
import { Dispatch, SetStateAction, TransitionStartFunction } from 'react';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export const useSubmitHandler = (
  eventSingleData: OccurrenceSingle | undefined,
  organizationSlug: string,
  newImg: FileImageType,
  setNewImg: Dispatch<SetStateAction<FileImageType>>,
  setInitImageUrl: Dispatch<SetStateAction<string | undefined>>,
  startProcessing: TransitionStartFunction,
  session: ReturnType<typeof useSession>,
  router: ReturnType<typeof import('next/navigation').useRouter>,
  uploadImage: ReturnType<typeof useUploadImage>,
  showNotification: ReturnType<typeof useNotification>['showNotification'],
  lang: string
) => {
  const { creator_admin: ca } = useDictionary();
  const { shared: d } = ca;

  return async (values: EventFormSchemaType) => {
    startProcessing(async () => {
      const { ...restValues } = values;
      const insValues = { ...restValues } as Partial<Occurrence>;

      // Empty _id means new event (including duplicates where _id was cleared)
      const isNewEvent = !insValues._id;

      // Safely convert datetime-local format to ISO for storage
      insValues.publicationStartDate = values.publicationStartDate
        ? fromDatetimeLocalToISO(values.publicationStartDate)
        : undefined;
      insValues.startDate = fromDatetimeLocalToISO(values.startDate);
      insValues.endDate = fromDatetimeLocalToISO(values.endDate);

      if (!insValues.slug?.current) {
        insValues.slug = {
          _type: 'slug',
          current: slugify(insValues.title!),
        };
      }

      if (!insValues.publicSlug || insValues.publicSlug.length == 1) {
        const publicEventSlug = getPublicEventSlug(
          insValues?.slug!.current!,
          organizationSlug
        );

        insValues.publicSlug = publicEventSlug;
      }

      if (!values.maxSubscribers || values.maxSubscribers <= 0) {
        insValues.maxSubscribers = undefined;
        delete insValues.maxSubscribers;
      }

      // Normalize custom registration fields: drop empty rows, derive a stable
      // unique key from the label, keep options only for select fields.
      const seenNames = new Set<string>();
      insValues.customFields = (values.customFields ?? [])
        .filter((f) => f.label && f.label.trim())
        .map((f) => {
          const label = f.label!.trim();
          const base =
            f.name && f.name.trim() ? slugify(f.name.trim()) : slugify(label);
          let name = base || 'field';
          let i = 2;
          while (seenNames.has(name)) {
            name = `${base}-${i++}`;
          }
          seenNames.add(name);
          return {
            _type: 'customFieldDef' as const,
            _key: crypto.randomUUID(),
            name,
            label,
            fieldType: f.fieldType,
            required: !!f.required,
            ...(f.fieldType === 'select'
              ? {
                  options: (f.options ?? [])
                    .map((o) => o.trim())
                    .filter(Boolean),
                }
              : {}),
          };
        });

      let imgRes;

      try {
        if (newImg.imgUrl && newImg.imgUrl !== eventSingleData?.pageImage.url) {
          imgRes = await uploadImage();

          if (imgRes.error) {
            throw new Error(String(imgRes.error));
          }

          if (imgRes.id) {
            insValues.mainImage = {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imgRes.id,
              },
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
            _ref: session.data!.user!.uid as string,
          };
          insValues._type = 'occurrence';

          delete insValues._id;

          const res = await createEvent({ data: insValues as Occurrence, lang });

          if (res.requiresPayment) {
            window.location.href = res.paymentUrl;
            return;
          }

          if (res._id) {
            router.push(`/${CreatorAdminRoutes.getItem('event')}/${res._id}`);
          }
        } else {
          await updateEvent({
            id: eventSingleData!._id!,
            data: insValues as Partial<Occurrence>,
          });
        }

        if (imgRes?.id) {
          setNewImg({
            file: {} as File,
            imgUrl: imgRes.url!,
          });
          setInitImageUrl(imgRes.url);
        }
        showNotification({
          title: d.success,
          message: d.success_text,
          type: 'success',
        });
      } catch (error: unknown) {
        let errorMessage = d.error_text;
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error
        ) {
          const responseError = error as {
            response?: { data?: { message?: string } };
          };
          if (responseError.response?.data?.message) {
            // updateEvent or createEvent
            errorMessage = responseError.response.data.message;
          }
        } else if (error instanceof Error) {
          // uploadImage
          errorMessage = error.message;
        }
        showNotification({
          title: d.error,
          message: errorMessage,
          type: 'error',
        });
      }
    });
  };
};
