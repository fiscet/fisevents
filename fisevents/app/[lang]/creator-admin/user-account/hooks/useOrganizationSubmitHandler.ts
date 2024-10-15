'use client';

import { useNotification } from "@/components/Notification/useNotification";
import { useUploadImage } from "@/hooks/useUploadImage";
import { FileImageType } from "@/types/custom.types";
import { CurrentOrganization } from "@/types/sanity.extended.types";
import { OrganizationFormSchemaType } from "./useOrganizationForm";
import { Organization } from "@/types/sanity.types";
import { createOrganization, getOrganizationCountBySlug, updateOrganization, updateUser } from "@/lib/actions";
import { TransitionStartFunction } from "react";

export const useOrganizationSubmitHandler = (
  organizationData: CurrentOrganization,
  currentUserId: string,
  dictionary: any,
  newImg: FileImageType,
  setNewImg: React.Dispatch<React.SetStateAction<FileImageType>>,
  setInitImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
  startProcessing: TransitionStartFunction
) => {
  const uploadImage = useUploadImage(newImg);
  const { showNotification } = useNotification();

  return async (values: OrganizationFormSchemaType) => {
    startProcessing(async () => {

      const { imageUrl, ...restValues } = values;
      const insValues = { ...restValues } as Partial<Organization>;

      try {
        if (newImg.imgUrl && newImg.imgUrl !== organizationData.imageUrl) {
          const imgRes = await uploadImage();
          if (imgRes.error) {
            throw new Error(imgRes.error);
          }
          if (imgRes.id) {
            insValues.image = {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: imgRes.id
              }
            };
            setNewImg({
              file: {} as File,
              imgUrl: imgRes.url!
            });
            setInitImageUrl(imgRes.url);
          }
        }
        if (!newImg.imgUrl) {
          insValues.image = {} as typeof insValues.image;
        }

        const organizationCount = await getOrganizationCountBySlug({ slug: insValues.slug!.current! });

        if (organizationData.slug?.current !== insValues.slug?.current && organizationCount > 0) {
          throw new Error(dictionary.common.error_slug_exists);
        }

        if (organizationData._id) {
          await updateOrganization({
            id: organizationData._id,
            data: insValues
          });
        } else {
          insValues._type = 'organization';

          const res = await createOrganization({ data: insValues as Organization });

          if (res._id) {
            await updateUser({
              id: currentUserId,
              data: { organization: { _type: 'reference', _ref: res._id } }
            });
          }
        }
      } catch (error: unknown) {
        let errorMessage = dictionary.common.error_text;

        if (typeof error === 'object' && error !== null && 'response' in error) {
          const responseError = error as { response?: { data?: { message?: string; }; }; };
          if (responseError.response?.data?.message) {
            // updateOrganization or createOrganization
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