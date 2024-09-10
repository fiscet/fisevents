'use client';

import { useNotification } from "@/components/Notification/useNotification";
import { useUploadImage } from "@/hooks/useUploadImage";
import { FileImageType } from "@/types/custom.types";
import { CurrentOrganization } from "@/types/sanity.extended.types";
import { useSession } from "next-auth/react";
import { OrganizationFormSchemaType } from "./useOrganizationForm";
import { Organization } from "@/types/sanity.types";
import { createOrganization, updateOrganization, updateUser } from "@/lib/actions";

export const useSubmitHandler = (
  organizationData: CurrentOrganization,
  dictionary: any,
  newImg: FileImageType,
  setNewImg: React.Dispatch<React.SetStateAction<FileImageType>>,
  setInitImageUrl: React.Dispatch<React.SetStateAction<string | undefined>>,
  onSaving?: (key: boolean) => void
) => {
  const { data: sessionUserData } = useSession();
  const uploadImage = useUploadImage(newImg);
  const { showNotification } = useNotification();

  return async (values: OrganizationFormSchemaType) => {
    onSaving && onSaving(true);

    const { imageUrl, ...restValues } = values;
    const insValues = { ...restValues } as Partial<Organization>;

    try {
      if (newImg.imgUrl && newImg.imgUrl != organizationData.imageUrl) {
        const imgRes = await uploadImage();
        if (imgRes && imgRes.id) {
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
            id: sessionUserData?.user?.uid ?? '',
            data: { organization: { _type: 'reference', _ref: res._id } }
          });
        }
      }
    } catch (error) {
      showNotification({
        title: dictionary.common.error,
        message: dictionary.common.error_text,
        type: 'error'
      });
    } finally {
      onSaving && onSaving(false);
    }
  };
};