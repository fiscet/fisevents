'use client';

import { useTransition, useState } from 'react';
import { User } from '@/types/sanity.types';
import { FileImageType } from '@/types/custom.types';
import { updateUser } from '@/lib/actions';
import {
  UserAccountFormSchemaType,
  useUserAccountForm
} from '../hooks/useUserAccountForm';
import ImageUploader from '../../components/ImageUploader';
import UserAccount from './UserAccount';
import { useSession } from 'next-auth/react';
import { CurrentUser } from '@/types/sanity.extended.types';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useNotification } from '@/components/Notification/useNotification';
import Processing from '@/components/Processing';
import { slugify } from '@/lib/utils';
import { useDictionary } from '@/app/contexts/DictionaryContext';

export type UserAccountContainerProps = {
  userData: CurrentUser;
};

export default function UserAccountContainer({
  userData
}: UserAccountContainerProps) {
  const [isSaving, startProcessing] = useTransition();
  const { data: sessionUserData, update: updateSession } = useSession();
  const { showNotification } = useNotification();

  const { creator_admin: ca } = useDictionary();
  const { account: a, common: c } = ca;

  const [initImageUrl, setInitImageUrl] = useState(userData.logoUrl);
  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: userData.logoUrl ?? ''
  });

  const { form } = useUserAccountForm({
    userData
  });
  const uploadImage = useUploadImage(newImg);

  const handleRestoreImage = () =>
    setNewImg({ file: {} as File, imgUrl: initImageUrl ?? '' });
  const handleDeleteImage = () => setNewImg({ file: {} as File, imgUrl: '' });

  const handleUserAccountSubmit = async (values: UserAccountFormSchemaType) => {
    startProcessing(async () => {
      const { logoUrl, ...restValues } = values;
      const insValues = { ...restValues } as Partial<User>;
      const newSession = { ...sessionUserData!.user, name: insValues.name };

      insValues.slug = {
        _type: 'slug',
        current: slugify(insValues.companyName ?? insValues.name ?? '')
      };

      try {
        if (newImg.imgUrl && newImg.imgUrl !== userData.logoUrl) {
          const imgRes = await uploadImage();
          if (imgRes.error) {
            throw new Error(imgRes.error);
          }
          if (imgRes.id) {
            insValues.logo = {
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
          insValues.logo = {} as typeof insValues.logo;
        }

        await updateUser({ id: userData._id!, data: insValues });
        await updateSession(newSession);
      } catch (error) {
        let errorMessage = c.error_text;
        if (
          typeof error === 'object' &&
          error !== null &&
          'response' in error
        ) {
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
          title: c.error,
          message: errorMessage,
          type: 'error'
        });
      }
    });
  };

  return (
    <>
      {isSaving && <Processing text={c.saving} />}
      <UserAccount
        form={form}
        imageUploaderRender={() => (
          <ImageUploader
            label={a.logo}
            description={a.descriptions.logo}
            initImageUrl={initImageUrl}
            img={newImg}
            setImg={setNewImg}
            onRestore={handleRestoreImage}
            onDelete={handleDeleteImage}
          />
        )}
        onSubmit={handleUserAccountSubmit}
      />
    </>
  );
}
