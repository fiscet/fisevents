import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-headline font-bold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Primary CTA — coral-to-orange gradient
        default:
          'bg-gradient-to-r from-fe-primary to-fe-primary-container text-fe-on-primary hover:scale-[0.98] shadow-[0_8px_24px_-4px_rgba(157,67,0,0.25)]',
        // Solid primary — no gradient, for secondary emphasis
        primary: 'bg-fe-primary text-fe-on-primary hover:opacity-90',
        // Teal secondary
        secondary:
          'bg-fe-secondary-container text-fe-on-secondary-container hover:bg-fe-secondary-fixed',
        // Ghost border — no fill
        outline:
          'border border-fe-outline-variant/30 bg-fe-surface-container-low text-fe-on-surface hover:bg-fe-surface-container',
        // Subtle ghost
        ghost:
          'bg-transparent text-fe-on-surface hover:bg-fe-surface-container-low',
        // Underline link
        link: 'text-fe-primary underline-offset-4 hover:underline bg-transparent',
        // Destructive / error
        destructive: 'bg-fe-error text-fe-on-error hover:opacity-90',
        // Teal-based success
        success: 'bg-fe-secondary text-fe-on-secondary hover:opacity-90',
      },
      size: {
        default: 'h-11 px-6 py-2.5 text-sm rounded-xl',
        sm: 'h-9 px-4 py-2 text-sm rounded-xl',
        lg: 'h-12 px-8 py-3 text-base rounded-xl',
        xl: 'h-14 px-10 py-4 text-lg rounded-2xl',
        icon: 'h-10 w-10 rounded-xl',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
