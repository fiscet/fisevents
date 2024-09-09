'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { FileImageType } from '@/types/custom.types';
import { Organization } from '@/types/sanity.types';
import {
  createOrganization,
  updateOrganization,
  updateUser
} from '@/lib/actions';
import ImageUploader from '../../components/ImageUploader';
import { useSession } from 'next-auth/react';
import { useNotification } from '@/components/Notification/useNotification';
import { CurrentOrganization } from '@/types/sanity.extended.types';
import {
  OrganizationFormSchemaType,
  useOrganizationForm
} from './hooks/useOrganizationForm';
import OrganizatioAccount from './OrganizationAccount';
import { useUploadImage } from '@/hooks/useUploadImage';

export type OrganizationAccountContainerProps = {
  organizationData: CurrentOrganization;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
  onSaving?: (key: boolean) => void;
};

export default function OrganizationAccountContainer({
  organizationData,
  dictionary,
  onSaving
}: OrganizationAccountContainerProps) {
  const { data: sessionUserData } = useSession();

  const [initImageUrl, setInitImageUrl] = useState(organizationData.imageUrl);

  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: organizationData.imageUrl ?? ''
  });

  const { form } = useOrganizationForm({
    organizationData: organizationData,
    dictionary: dictionary.organization
  });

  const uploadImage = useUploadImage(newImg);

  const { showNotification } = useNotification();

  const handleRestoreImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: initImageUrl ?? ''
    });
  };

  const handleDeleteImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: ''
    });
  };

  async function handleSubmit(values: OrganizationFormSchemaType) {
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
            imgUrl: imgRes!.url!
          });

          setInitImageUrl(imgRes!.url!);
        }
      }
      if (!newImg.imgUrl) {
        insValues.image = {} as typeof insValues.image;
      }

      if (organizationData._id) {
        await updateOrganization({
          id: organizationData._id!,
          data: insValues
        });
      } else {
        insValues._type = 'organization';

        const res = await createOrganization({
          data: insValues as Organization
        });

        if (res._id) {
          await updateUser({
            id: sessionUserData!.user!.uid,
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
  }

  return (
    <OrganizatioAccount
      dictionary={{ ...dictionary.organization, ...dictionary.common }}
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
      onSubmit={handleSubmit}
    />
  );
}
