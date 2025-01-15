import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';

export type OrganizedByProps = {
  companyName: string;
  logoUrl?: string;
  www?: string;
  organizedByLabel: string;
};

export default function OrganizedBy({
  companyName,
  logoUrl,
  www,
  organizedByLabel
}: OrganizedByProps) {
  return (
    <div className="flex justify-end items-baseline mt-6">
      <Link
        href={www ?? '#'}
        target={www ? '_blank' : '_self'}
        className="flex flex-row items-center gap-x-2"
      >
        <span className="text-sm text-muted-foreground">
          {organizedByLabel} {companyName}
        </span>
        {logoUrl && (
          <Avatar className="w-12 h-12 rounded-full">
            <AvatarImage src={logoUrl} />
          </Avatar>
        )}
      </Link>
    </div>
  );
}
