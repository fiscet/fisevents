'use client';

import { useTransition, useState, useEffect } from 'react';
import { User } from '@/types/sanity.types';
import { FileImageType } from '@/types/custom.types';
import { CurrentUser } from '@/types/sanity.extended.types';
import { updateUser } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useUploadImage } from '@/hooks/useUploadImage';
import {
  UserAccountFormSchemaType,
  useUserAccountForm
} from '../hooks/useUserAccountForm';
import { useNotification } from '@/components/Notification/useNotification';
import { useDictionary } from '@/app/contexts/DictionaryContext';
import UserAccount from './UserAccount';
import Processing from '@/components/Processing';
import ImageUploader from '../../_components/ImageUploader';
import UtilityBar from '../../_components/UtilityBar';
import GoToEventList from '../../_components/GoToEventList';
import { CreatorAdminRoutes } from '@/lib/routes';

export type UserAccountContainerProps = {
  userData: CurrentUser;
};

export default function UserAccountContainer({
  userData
}: UserAccountContainerProps) {
  const [isSaving, startProcessing] = useTransition();
  const { data: sessionUserData, update: updateSession } = useSession();
  const { showNotification } = useNotification();
  const curLang = useCurrentLang();
  const { creator_admin: ca } = useDictionary();
  const { account: a, shared: s } = ca;

  const [initImageUrl, setInitImageUrl] = useState(userData.logoUrl);
  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: userData.logoUrl ?? ''
  });
  const [isVeryFirstAccess, setIsVeryFirstAccess] = useState(false);

  useEffect(() => {
    if (!userData.name || !userData.companyName) {
      setIsVeryFirstAccess(true);
    }
  }, []);

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

        if (isVeryFirstAccess) {
          const url = `${
            window.location.origin
          }/${curLang}/${CreatorAdminRoutes.getItem('event')}`;

          window.location.href = url;
        }
      } catch (error) {
        let errorMessage = s.error_text;
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
          title: s.error,
          message: errorMessage,
          type: 'error'
        });
      }
    });
  };

  const { isDirty, isValid, isSubmitted } = form.formState;

  const isBackVisible =
    (!isDirty && isValid) || (isDirty && isValid && isSubmitted);

  return (
    <>
      {isSaving && <Processing text={s.saving} />}
      <UtilityBar
        leftElements={
          isBackVisible && (
            <GoToEventList label={s.goto_event_list} lang={curLang} />
          )
        }
        centerElements={
          isVeryFirstAccess ? (
            <h3 className="text-center text-xl font-bold text-orange-600">
              {a.complete_your_profile}
            </h3>
          ) : null
        }
      />
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
