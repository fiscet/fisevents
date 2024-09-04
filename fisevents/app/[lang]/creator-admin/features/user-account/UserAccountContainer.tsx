'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { FDefaultSession, FileImageType } from '@/types/custom.types';
import { User } from '@/types/sanity.types';
import { updateUser } from '@/lib/actions';
import {
  UserAccountFormSchemaType,
  useUserAccountForm
} from './hooks/useUserAccountForm';
import ImageUploader from '../../components/ImageUploader';
import UserAccount from './UserAccount';
import Processing from '@/components/Processing';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

export type UserAccountContainerProps = {
  session: FDefaultSession;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
};

export default function UserAccountContainer({
  session,
  dictionary
}: UserAccountContainerProps) {
  const { update: updateSession } = useSession();

  const [initImageUrl, setInitImageUrl] = useState(session?.user?.image ?? '');

  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: session?.user?.image ?? ''
  });

  const [isSaving, setIsSaving] = useState(false);

  const { form } = useUserAccountForm({
    session,
    dictionary: dictionary.account
  });

  const handleRestoreImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: initImageUrl
    });
  };

  const handleDeleteImage = () => {
    setNewImg({
      file: {} as File,
      imgUrl: ''
    });
  };

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append('file', newImg.file);

    const response = await fetch('/api/uploadImage', {
      method: 'POST',
      body: formData
    });

    return (await response.json()) as {
      status: string;
      id?: string;
      url?: string;
      error?: any;
    };
  };

  async function onSubmit(values: UserAccountFormSchemaType) {
    setIsSaving(true);

    const insValues = { ...values } as Partial<User>;
    const newSession = { ...session.user, name: insValues.name };

    let imgRes: { status: string; id?: string; url?: string; error?: any };

    if (newImg.imgUrl != session?.user?.image) {
      imgRes = await uploadImage();

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

    await updateUser({
      id: session!.user!.uid as string,
      data: insValues as Partial<User>
    });

    await updateSession(newSession);

    setIsSaving(false);
  }

  const MyImageUploader = (
    <ImageUploader
      initImageUrl={initImageUrl}
      img={newImg}
      setImg={setNewImg}
      onRestore={handleRestoreImage}
      onDelete={handleDeleteImage}
    />
  );

  return (
    <>
      {isSaving && <Processing text={dictionary.saving} />}
      <UserAccount
        dictionary={dictionary.account}
        form={form}
        imageUploader={MyImageUploader}
        onSubmit={onSubmit}
      />
    </>
  );
}
