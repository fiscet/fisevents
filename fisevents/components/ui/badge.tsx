import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-label font-bold uppercase tracking-widest transition-colors',
  {
    variants: {
      variant: {
        active: 'bg-fe-secondary-container text-fe-on-secondary-container',
        draft: 'bg-fe-surface-container-highest text-fe-on-surface-variant',
        past: 'bg-fe-surface-dim text-fe-on-surface-variant',
        category: 'bg-fe-secondary-container text-fe-on-secondary-container',
        new: 'bg-fe-secondary-container/30 text-fe-on-secondary-container',
        error: 'bg-fe-error-container text-fe-on-error-container',
        primary: 'bg-fe-primary-fixed text-fe-on-primary-container',
      },
    },
    defaultVariants: {
      variant: 'category',
    },
  }
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
