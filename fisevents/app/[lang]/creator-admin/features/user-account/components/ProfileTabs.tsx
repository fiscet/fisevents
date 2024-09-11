import { memo } from 'react';
import { TabsList, TabsTrigger } from '@/components/ui/tabs';

type UtilityBarRightElementsProps = {
  userAccountText: string;
  organizationText: string;
};

export default memo(function ProfileTabs({
  userAccountText,
  organizationText
}: UtilityBarRightElementsProps) {
  return (
    <TabsList>
      <TabsTrigger value="user">{userAccountText}</TabsTrigger>
      <TabsTrigger value="organization">{organizationText}</TabsTrigger>
    </TabsList>
  );
});
