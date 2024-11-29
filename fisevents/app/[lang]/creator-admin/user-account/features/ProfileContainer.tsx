'use client';

import { useTransition } from 'react';
import { useSearchParams } from 'next/navigation';
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
import ProfileTabs from '../components/ProfileTabs';
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
  const [isSaving, startProcessing] = useTransition();

  const allowedTabs = ['user', 'organization'] as const;

  const searchParams = useSearchParams();
  const tab = searchParams.get('tab');

  const tabSel =
    tab && allowedTabs.includes(tab as typeof allowedTabs[number])
      ? tab
      : 'user';

  return (
    <>
      {isSaving && <Processing text={dictionary.common.saving} />}
      <Tabs defaultValue={tabSel}>
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
            startProcessing={startProcessing}
          />
        </TabsContent>
        <TabsContent value="organization">
          <OrganizationAccountContainer
            organizationData={organizationData}
            currentUserId={userData._id!}
            dictionary={dictionary}
            startProcessing={startProcessing}
          />
        </TabsContent>
      </Tabs>
    </>
  );
}
