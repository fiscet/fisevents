import * as React from 'react';

import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          // Base: no border, tonal background
          'flex w-full rounded-xl bg-fe-surface-container-high px-5 py-4',
          'text-fe-on-surface placeholder:text-fe-on-surface-variant/50',
          'text-sm font-body border-none',
          // Focus: shift to lighter bg + primary glow ring
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-primary/20',
          'focus-visible:bg-fe-surface-container-lowest transition-all duration-200',
          // File input
          'file:border-0 file:bg-transparent file:text-sm file:font-medium',
          // Disabled
          'disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';

export { Input };
