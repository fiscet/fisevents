'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/types/sanity.types';
import { CurrentUser } from '@/types/sanity.extended.types';
import { updateUser } from '@/lib/actions';
import { slugify } from '@/lib/utils';
import { useSession } from 'next-auth/react';
import { useCurrentLang } from '@/hooks/useCurrentLang';
import { useUploadImage } from '@/hooks/useUploadImage';
import { useUserAccountState } from '@/hooks/useUserAccountState';
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
  const router = useRouter();
  const { data: sessionUserData, update: updateSession } = useSession();
  const { showNotification } = useNotification();
  const curLang = useCurrentLang();
  const { creator_admin: ca } = useDictionary();
  const { account: a, shared: s } = ca;

  const {
    initImageUrl,
    setInitImageUrl,
    newImg,
    setNewImg,
    isVeryFirstAccess,
    handleRestoreImage,
    handleDeleteImage
  } = useUserAccountState(userData);

  const { form } = useUserAccountForm({
    userData
  });
  const uploadImage = useUploadImage(newImg);

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
            throw new Error(String(imgRes.error));
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
          router.push(`/${curLang}/${CreatorAdminRoutes.getItem('event')}`);
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
    !isVeryFirstAccess &&
    ((!isDirty && isValid) || (isDirty && isValid && isSubmitted));

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
            <h3 className="text-center text-xl font-bold text-fe-primary">
              {a.complete_your_profile}
            </h3>
          ) : null
        }
      />
      <UserAccount
        form={form}
        isVeryFirstAccess={isVeryFirstAccess}
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
