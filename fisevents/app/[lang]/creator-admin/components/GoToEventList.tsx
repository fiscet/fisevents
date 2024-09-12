import { memo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreatorAdminRoutes } from '@/lib/routes';

type UtilityBarLeftElementsProps = {
  backText: string;
};

export default memo(function GoToEventList({
  backText
}: UtilityBarLeftElementsProps) {
  return (
    <Button asChild>
      <Link href={`/${CreatorAdminRoutes.getBase()}`}>&larr; {backText}</Link>
    </Button>
  );
});
