import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  step: number;
  label: string;
  status: 'active' | 'completed' | 'upcoming';
}

export function StepIndicator({ step, label, status }: StepIndicatorProps) {
  return (
    <div className="flex items-center gap-4">
      <span
        className={cn(
          'w-8 h-8 rounded-full flex items-center justify-center font-headline font-bold text-sm shrink-0',
          status === 'active' &&
            'bg-fe-primary-container text-fe-on-primary-container',
          status === 'completed' && 'bg-fe-primary text-fe-on-primary',
          status === 'upcoming' &&
            'bg-fe-surface-container-high text-fe-on-surface-variant'
        )}
        aria-current={status === 'active' ? 'step' : undefined}
      >
        {status === 'completed' ? '✓' : step}
      </span>
      <h2 className="text-2xl font-headline font-bold tracking-tight text-fe-on-surface">
        {label}
      </h2>
    </div>
  );
}
