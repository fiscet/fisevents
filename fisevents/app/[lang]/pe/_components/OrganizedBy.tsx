import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

export type OrganizedByProps = {
  companyName: string;
  logoUrl?: string;
  www?: string;
  organizedByLabel: string;
  orgPageUrl?: string;
  allEventsLabel?: string;
};

export default function OrganizedBy({
  companyName,
  logoUrl,
  www,
  organizedByLabel,
  orgPageUrl,
  allEventsLabel,
}: OrganizedByProps) {
  return (
    <div className="flex justify-end items-center mt-6 pt-5 border-t border-fe-outline-variant/20">
      <div className="flex flex-col items-end gap-1">
        <Link
          href={www ?? '#'}
          target={www ? '_blank' : '_self'}
          className="flex flex-row items-center gap-x-3 group"
        >
          {logoUrl ? (
            <Avatar className="w-10 h-10 rounded-full">
              <AvatarImage src={logoUrl} />
            </Avatar>
          ) : (
            <Avatar className="w-10 h-10 rounded-full">
              <AvatarFallback className="text-sm font-bold bg-fe-primary-container text-fe-on-primary-container">
                {companyName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          )}
          <div className="flex flex-col items-end">
            <span className="text-xs text-fe-on-surface-variant">{organizedByLabel}</span>
            <span className="text-sm font-medium text-fe-on-surface group-hover:text-fe-primary transition-colors">
              {companyName}
            </span>
          </div>
        </Link>
        {orgPageUrl && allEventsLabel && (
          <Link
            href={orgPageUrl}
            className="text-xs text-fe-primary hover:underline"
          >
            {allEventsLabel} →
          </Link>
        )}
      </div>
    </div>
  );
}
