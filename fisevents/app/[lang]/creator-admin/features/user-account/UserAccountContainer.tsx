'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { User } from '@/types/sanity.types';
import { FileImageType } from '@/types/custom.types';
import { updateUser } from '@/lib/actions';
import {
  UserAccountFormSchemaType,
  useUserAccountForm
} from './hooks/useUserAccountForm';
import ImageUploader from '../../components/ImageUploader';
import UserAccount from './UserAccount';
import { useSession } from 'next-auth/react';
import { CurrentUser } from '@/types/sanity.extended.types';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useNotification } from '@/components/Notification/useNotification';

export type UserAccountContainerProps = {
  userData: CurrentUser;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
  onSaving?: (isSaving: boolean) => void;
};

export default function UserAccountContainer({
  userData,
  dictionary,
  onSaving
}: UserAccountContainerProps) {
  const { data: sessionUserData, update: updateSession } = useSession();
  const { showNotification } = useNotification();

  const [initImageUrl, setInitImageUrl] = useState(userData.image);
  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: userData.image ?? ''
  });

  const { form } = useUserAccountForm({
    userData,
    dictionary: dictionary.account
  });
  const uploadImage = useUploadImage(newImg);

  const handleRestoreImage = () =>
    setNewImg({ file: {} as File, imgUrl: initImageUrl ?? '' });
  const handleDeleteImage = () => setNewImg({ file: {} as File, imgUrl: '' });

  const handleUserAccountSubmit = async (values: UserAccountFormSchemaType) => {
    onSaving?.(true);

    const { imageUrl, ...restValues } = values;
    const insValues = { ...restValues } as Partial<User>;
    const newSession = { ...sessionUserData!.user, name: insValues.name };

    try {
      if (newImg.imgUrl && newImg.imgUrl !== userData.image) {
        const imgRes = await uploadImage();
        if (imgRes.error) {
          throw new Error(imgRes.error);
        }
        if (imgRes.id) {
          insValues.image = imgRes.url;
          newSession.image = imgRes.url;
          setNewImg({ file: {} as File, imgUrl: imgRes!.url! });
          setInitImageUrl(imgRes!.url!);
        }
      }

      if (!newImg.imgUrl) {
        insValues.image = undefined;
      }

      await updateUser({ id: userData._id!, data: insValues });
      await updateSession(newSession);
    } catch (error) {
      let errorMessage = dictionary.common.error_text;
      if (typeof error === 'object' && error !== null && 'response' in error) {
        const responseError = error as {
          response?: { data?: { message?: string } };
        };
        if (responseError.response?.data?.message) {
          // updateUser
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
    } finally {
      onSaving?.(false);
    }
  };

  return (
    <UserAccount
      dictionary={{ ...dictionary.account, ...dictionary.common }}
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
      onSubmit={handleUserAccountSubmit}
    />
  );
}
