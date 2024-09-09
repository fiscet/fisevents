'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { FileImageType } from '@/types/custom.types';
import { User } from '@/types/sanity.types';
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
  onSaving?: (key: boolean) => void;
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

  async function handleUserAccountSubmit(values: UserAccountFormSchemaType) {
    onSaving && onSaving(true);

    const { imageUrl, ...restValues } = values;

    const insValues = { ...restValues } as Partial<User>;
    const newSession = { ...sessionUserData!.user, name: insValues.name };

    try {
      if (newImg.imgUrl && newImg.imgUrl != userData.image) {
        const imgRes = await uploadImage();

        if (imgRes.id) {
          insValues.image = imgRes.url;
          newSession.image = imgRes.url;

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

      await updateUser({
        id: userData._id!,
        data: insValues as Partial<User>
      });

      await updateSession(newSession);
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
