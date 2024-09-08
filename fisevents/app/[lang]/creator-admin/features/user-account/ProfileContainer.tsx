'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import { FileImageType } from '@/types/custom.types';
import { Organization, User } from '@/types/sanity.types';
import { updateUser } from '@/lib/actions';
import {
  UserAccountFormSchemaType,
  useUserAccountForm
} from './hooks/useUserAccountForm';
import ImageUploader from '../../components/ImageUploader';
import UserAccountContainer from './UserAccountContainer';
import Processing from '@/components/Processing';
import { useSession } from 'next-auth/react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UtilityBar from '../../components/UtilityBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreatorAdminRoutes } from '@/lib/routes';
import OrganizationAccount from './OrganizationAccount';
import { OrganizationFormSchemaType } from './hooks/useOrganizationForm';
import { CurrentUser } from '@/types/sanity.extended.types';

export type ProfileContainerProps = {
  userData: CurrentUser;
  organizationData: Organization;
  dictionary: Awaited<ReturnType<typeof getDictionary>>['creator_admin'];
};

export default function ProfileContainer({
  userData,
  organizationData,
  dictionary
}: ProfileContainerProps) {
  const [isSaving, setIsSaving] = useState(false);

  return (
    <>
      {isSaving && <Processing text={dictionary.common.saving} />}
      <Tabs defaultValue="event">
        <UtilityBar
          leftElements={
            <Button asChild>
              <Link href={`/${CreatorAdminRoutes.getBase()}`}>
                &larr; {dictionary.common.back}
              </Link>
            </Button>
          }
          rightElements={
            <TabsList>
              <TabsTrigger value="user">
                {dictionary.account.userAccount}
              </TabsTrigger>
              <TabsTrigger value="organization">
                {dictionary.organization.organization}
              </TabsTrigger>
            </TabsList>
          }
        />
        <TabsContent value="user">
          <UserAccountContainer
            userData={userData}
            dictionary={dictionary}
            onSaving={setIsSaving}
          />
        </TabsContent>
        <TabsContent value="organization">
          {/* <OrganizationAccount
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
            onSubmit={handleUserAccountSubmit} /> */}
        </TabsContent>
      </Tabs>
    </>
  );
}
