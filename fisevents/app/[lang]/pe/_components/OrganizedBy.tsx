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
    <div className="flex justify-end items-center mt-6 pt-5 border-t border-fe-outline-variant/20">
      <Link
        href={www ?? '#'}
        target={www ? '_blank' : '_self'}
        className="flex flex-row items-center gap-x-3 group"
      >
        {logoUrl && (
          <Avatar className="w-10 h-10 rounded-full">
            <AvatarImage src={logoUrl} />
          </Avatar>
        )}
        <div className="flex flex-col items-end">
          <span className="text-xs text-fe-on-surface-variant">{organizedByLabel}</span>
          <span className="text-sm font-medium text-fe-on-surface group-hover:text-fe-primary transition-colors">{companyName}</span>
        </div>
      </Link>
    </div>
  );
}
