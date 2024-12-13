import { memo } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CreatorAdminRoutes } from '@/lib/routes';
import { Locale } from '@/lib/i18n';

type UtilityBarLeftElementsProps = {
  label: string;
  lang: Locale;
  variant?:
    | 'default'
    | 'success'
    | 'link'
    | 'destructive'
    | 'outline'
    | 'secondary'
    | 'ghost';
};

export default memo(function GoToEventList({
  label: backText,
  lang,
  variant
}: UtilityBarLeftElementsProps) {
  return (
    <Button variant={variant} asChild>
      <Link href={`/${lang}/${CreatorAdminRoutes.getBase()}`}>
        &larr; {backText}
      </Link>
    </Button>
  );
});
