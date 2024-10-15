'use client';

import { getDictionary } from '@/lib/i18n.utils';
import { useOrganizationForm } from '../hooks/useOrganizationForm';
import { useImageHandlers } from '@/hooks/useImageHandlers';
import { useOrganizationSubmitHandler } from '../hooks/useOrganizationSubmitHandler';
import { CurrentOrganization } from '@/types/sanity.extended.types';
import ImageUploader from '../../components/ImageUploader';
import OrganizatioAccount from './OrganizationAccount';
import { TransitionStartFunction } from 'react';

export type OrganizationAccountContainerProps = {
  organizationData: CurrentOrganization;
  currentUserId: string;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
  startProcessing: TransitionStartFunction;
};

export default function OrganizationAccountContainer({
  organizationData,
  currentUserId,
  dictionary,
  startProcessing
}: OrganizationAccountContainerProps) {
  const {
    initImageUrl,
    newImg,
    setNewImg,
    handleRestoreImage,
    handleDeleteImage,
    setInitImageUrl
  } = useImageHandlers(organizationData.imageUrl);

  const { form } = useOrganizationForm({
    organizationData: organizationData,
    dictionary: dictionary.organization
  });

  const handleSubmit = useOrganizationSubmitHandler(
    organizationData,
    currentUserId,
    dictionary,
    newImg,
    setNewImg,
    setInitImageUrl,
    startProcessing
  );

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
