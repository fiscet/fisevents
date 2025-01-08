import { Locale } from '@/lib/i18n';
import { getDictionary } from '@/lib/i18n.utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function WaitingEmailPage({
  params: { lang }
}: {
  params: { lang: Locale };
}) {
  const d = (await getDictionary(lang)).website.waiting_for_the_email;

  return (
    <Card className="md:w-[600px] mx-auto mt-5 md:mt-16">
      <CardHeader>
        <CardTitle>{d.title}</CardTitle>
      </CardHeader>
      <CardContent>{d.description}</CardContent>
    </Card>
  );
}
