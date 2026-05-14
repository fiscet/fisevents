import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type SubscribeAnchorProps = {
  anchorId: string;
  label: string;
};

export default function SubscribeAnchor({
  anchorId,
  label,
}: SubscribeAnchorProps) {
  return (
    <Button variant="default" size="lg" asChild>
      <Link href={anchorId}>{label}</Link>
    </Button>
  );
}
