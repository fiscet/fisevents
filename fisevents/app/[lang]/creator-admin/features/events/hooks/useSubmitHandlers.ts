import { useNotification } from "@/components/Notification/useNotification";
import { useUploadImage } from "@/hooks/useUploadImage";
import { FileImageType } from "@/types/custom.types";
import { OccurrenceSingle } from "@/types/sanity.extended.types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { EventFormSchemaType } from "./useEventSingleForm";
import { Occurrence } from "@/types/sanity.types";
import { toUserIsoString } from "@/lib/utils";
import { createEvent, updateEvent } from "@/lib/actions";
import { CreatorAdminRoutes } from "@/lib/routes";

export const useSubmitHandler = (
  eventSingleData: OccurrenceSingle | undefined,
  dictionary: any,
  newImg: FileImageType,
  setNewImg: React.Dispatch<React.SetStateAction<FileImageType>>,
  setInitImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
  setIsSaving: React.Dispatch<React.SetStateAction<boolean>>,
  session: ReturnType<typeof useSession>,
  router: any,
  uploadImage: ReturnType<typeof useUploadImage>,
  showNotification: ReturnType<typeof useNotification>['showNotification']
) => {
  const isNewEvent = !eventSingleData;

  return async (values: EventFormSchemaType) => {
    setIsSaving(true);

    const { ...restValues } = values;
    const insValues = { ...restValues } as Partial<Occurrence>;

    insValues.publicationStartDate = toUserIsoString(new Date(values.publicationStartDate));
    insValues.startDate = toUserIsoString(new Date(values.startDate));
    insValues.endDate = toUserIsoString(new Date(values.endDate));

    let imgRes;

    try {
      if (newImg.imgUrl && newImg.imgUrl !== eventSingleData?.pageImage.url) {
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
          router.push(`/${CreatorAdminRoutes.getItem('event')}/${res.slug.current}`);
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
          imgUrl: imgRes.url!
        });
        setInitImageUrl(imgRes.url);
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
  };
};