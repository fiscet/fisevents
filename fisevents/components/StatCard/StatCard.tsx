import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

type StatCardVariant = 'standard' | 'tonal' | 'accent';

interface StatCardProps {
  label: string;
  value: string | number;
  sublabel?: string;
  icon?: ReactNode;
  variant?: StatCardVariant;
  badge?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  sublabel,
  icon,
  variant = 'standard',
  badge,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'p-8 rounded-xl flex flex-col justify-between',
        variant === 'standard' &&
          'bg-fe-surface-container-lowest shadow-editorial border border-fe-outline-variant/15',
        variant === 'tonal' && 'bg-fe-surface-container-low',
        variant === 'accent' &&
          'bg-gradient-to-br from-fe-primary to-fe-primary-container text-fe-on-primary shadow-xl',
        className
      )}
    >
      <div className="flex justify-between items-start">
        <span
          className={cn(
            'font-label font-medium text-sm tracking-wide uppercase',
            variant === 'accent'
              ? 'text-fe-on-primary opacity-90'
              : 'text-fe-on-surface-variant'
          )}
        >
          {label}
        </span>
        {icon && (
          <span
            className={cn(
              'text-lg',
              variant === 'accent' ? 'text-fe-on-primary' : 'text-fe-primary'
            )}
            aria-hidden="true"
          >
            {icon}
          </span>
        )}
      </div>

      <div className="mt-4">
        <span
          className={cn(
            'text-5xl font-headline font-extrabold tracking-tighter',
            variant === 'accent' ? 'text-fe-on-primary' : 'text-fe-on-surface'
          )}
        >
          {value}
        </span>
        {badge && (
          <span className="ml-2 text-fe-on-secondary-container text-xs font-semibold bg-fe-secondary-container/30 px-2 py-1 rounded-full inline-block">
            {badge}
          </span>
        )}
        {sublabel && (
          <p
            className={cn(
              'text-xs mt-2',
              variant === 'accent'
                ? 'text-fe-on-primary opacity-80'
                : 'text-fe-on-surface-variant'
            )}
          >
            {sublabel}
          </p>
        )}
      </div>
    </div>
  );
}
