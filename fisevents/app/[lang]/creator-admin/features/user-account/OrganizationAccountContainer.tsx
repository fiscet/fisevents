'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { FileImageType } from '@/types/custom.types';
import { User } from '@/types/sanity.types';
import { updateUser } from '@/lib/actions';
import ImageUploader from '../../components/ImageUploader';
import { useSession } from 'next-auth/react';
import { CurrentOrganization } from '@/types/sanity.extended.types';
import {
  OrganizationFormSchemaType,
  useOrganizationForm
} from './hooks/useOrganizationForm';
import OrganizatioAccount from './OrganizationAccount';

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
  const { data: sessionUserData, update: updateSession } = useSession();

  const [initImageUrl, setInitImageUrl] = useState(organizationData.imageUrl);

  const [newImg, setNewImg] = useState<FileImageType>({
    file: {} as File,
    imgUrl: organizationData.imageUrl ?? ''
  });

  const { form } = useOrganizationForm({
    organizationData: organizationData,
    dictionary: dictionary.organization
  });

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

  async function handleSubmit(values: OrganizationFormSchemaType) {
    onSaving && onSaving(true);

    const { imageUrl, ...restValues } = values;

    const insValues = { ...restValues } as Partial<User>;
    const newSession = { ...sessionUserData!.user, name: insValues.name };

    let imgRes: { status: string; id?: string; url?: string; error?: any };

    if (newImg.imgUrl != organizationData.imageUrl) {
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
      id: organizationData._id!,
      data: insValues as Partial<User>
    });

    await updateSession(newSession);

    onSaving && onSaving(false);
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
