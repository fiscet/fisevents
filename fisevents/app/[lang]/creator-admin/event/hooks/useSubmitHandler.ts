import { useNotification } from "@/components/Notification/useNotification";
import { useUploadImage } from "@/hooks/useUploadImage";
import { FileImageType } from "@/types/custom.types";
import { OccurrenceSingle } from "@/types/sanity.extended.types";
import { useSession } from "next-auth/react";
import { EventFormSchemaType } from "./useEventSingleForm";
import { Occurrence } from "@/types/sanity.types";
import { toUserIsoString } from "@/lib/utils";
import { createEvent, updateEvent } from "@/lib/actions";
import { CreatorAdminRoutes } from "@/lib/routes";
import { Dispatch, SetStateAction, TransitionStartFunction } from "react";
import handleCreate from "@/lib/tests/handleMutation";

export const useSubmitHandler = (
  eventSingleData: OccurrenceSingle | undefined,
  dictionary: any,
  newImg: FileImageType,
  setNewImg: Dispatch<SetStateAction<FileImageType>>,
  setInitImageUrl: Dispatch<SetStateAction<string | undefined>>,
  startProcessing: TransitionStartFunction,
  session: ReturnType<typeof useSession>,
  router: any,
  uploadImage: ReturnType<typeof useUploadImage>,
  showNotification: ReturnType<typeof useNotification>['showNotification']
) => {
  const isNewEvent = !eventSingleData;

  return async (values: EventFormSchemaType) => {
    startProcessing(async () => {

      const { ...restValues } = values;
      const insValues = { ...restValues } as Partial<Occurrence>;

      insValues.publicationStartDate = toUserIsoString(new Date(values.publicationStartDate));
      insValues.startDate = toUserIsoString(new Date(values.startDate));
      insValues.endDate = toUserIsoString(new Date(values.endDate));

      let imgRes;

      try {
        if (newImg.imgUrl && newImg.imgUrl !== eventSingleData?.pageImage.url) {
          imgRes = await uploadImage();

          if (imgRes.error) {
            throw new Error(imgRes.error);
          }

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

          delete insValues._id;

          const res = await handleCreate<Partial<Occurrence>>(insValues);
          // const res = await createEvent({ data: insValues as Occurrence });

          if (res._id) {
            router.push(`/${CreatorAdminRoutes.getItem('event')}/${res._id}`);
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
      } catch (error: unknown) {
        let errorMessage = dictionary.common.error_text;
        if (typeof error === 'object' && error !== null && 'response' in error) {
          const responseError = error as { response?: { data?: { message?: string; }; }; };
          if (responseError.response?.data?.message) {
            // updateEvent or createEvent
            errorMessage = responseError.response.data.message;
          }
        } else if (error instanceof Error) {
          // uploadImage
          errorMessage = error.message;
        }
        showNotification({
          title: dictionary.common.error,
          message: errorMessage,
          type: 'error'
        });
      }
    });
  };
};