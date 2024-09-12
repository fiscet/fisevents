'use client';

import { useState } from 'react';
import { getDictionary } from '@/lib/i18n.utils';
import UserAccountContainer from './UserAccountContainer';
import Processing from '@/components/Processing';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import UtilityBar from '../../components/UtilityBar';
import {
  CurrentOrganization,
  CurrentUser
} from '@/types/sanity.extended.types';
import OrganizationAccountContainer from './OrganizationAccountContainer';
import ProfileTabs from './components/ProfileTabs';
import GoToEventList from '../../components/GoToEventList';

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
          leftElements={<GoToEventList backText={dictionary.common.back} />}
          rightElements={
            <ProfileTabs
              userAccountText={dictionary.account.userAccount}
              organizationText={dictionary.organization.organization}
            />
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
            currentUserId={userData._id!}
            dictionary={dictionary}
            onSaving={setIsSaving}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
