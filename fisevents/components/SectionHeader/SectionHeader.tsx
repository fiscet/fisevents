import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface SectionHeaderProps {
  badge?: string;
  heading: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

export function SectionHeader({
  badge,
  heading,
  description,
  align = 'left',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn('mb-16', align === 'center' && 'text-center', className)}
    >
      {badge && (
        <Badge variant="new" className="mb-6 inline-block">
          {badge}
        </Badge>
      )}
      <h2
        className={cn(
          'text-4xl md:text-5xl font-headline font-bold tracking-tight text-fe-on-surface mb-4'
        )}
      >
        {heading}
      </h2>
      {description && (
        <p
          className={cn(
            'text-lg text-fe-on-surface-variant leading-relaxed',
            align === 'center' ? 'max-w-2xl mx-auto' : 'max-w-xl'
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
