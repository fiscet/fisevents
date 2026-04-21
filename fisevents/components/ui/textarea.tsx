import * as React from 'react';

import { cn } from '@/lib/utils';

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          'flex min-h-[80px] w-full rounded-xl bg-fe-surface-container-high',
          'px-5 py-4 text-sm font-body border-none',
          'text-fe-on-surface placeholder:text-fe-on-surface-variant/50',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fe-primary/20',
          'focus-visible:bg-fe-surface-container-lowest transition-all duration-200',
          'disabled:cursor-not-allowed disabled:opacity-50 resize-none',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
