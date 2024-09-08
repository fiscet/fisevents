'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import UserAccountContainer from './UserAccountContainer';
import Processing from '@/components/Processing';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UtilityBar from '../../components/UtilityBar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreatorAdminRoutes } from '@/lib/routes';
import {
  CurrentOrganization,
  CurrentUser
} from '@/types/sanity.extended.types';
import OrganizationAccountContainer from './OrganizationAccountContainer';

export type ProfileContainerProps = {
  userData: CurrentUser;
  organizationData: CurrentOrganization;
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
      <Tabs defaultValue="user">
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
          <OrganizationAccountContainer
            organizationData={organizationData}
            dictionary={dictionary}
            onSaving={setIsSaving}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
