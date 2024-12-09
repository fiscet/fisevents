import { memo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreatorAdminRoutes } from '@/lib/routes';
import { Locale } from '@/lib/i18n';

type UtilityBarLeftElementsProps = {
  backText: string;
  lang: Locale;
};

export default memo(function GoToEventList({
  backText,
  lang
}: UtilityBarLeftElementsProps) {
  return (
    <Button asChild>
      <Link href={`/${lang}/${CreatorAdminRoutes.getBase()}`}>
        &larr; {backText}
      </Link>
    </Button>
  );
});
