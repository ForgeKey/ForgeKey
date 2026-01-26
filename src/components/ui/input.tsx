import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
  variant?: 'default' | 'dark';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant = 'dark', ...props }, ref) => {
    const baseStyles =
      'flex h-9 w-full rounded-md px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      default:
        'bg-white/90 text-gray-900 placeholder:text-gray-400 border-0 focus-visible:ring-purple-500/50',
      dark: 'bg-white/10 text-white placeholder:text-white/40 border border-white/10 focus-visible:ring-purple-500/50 focus-visible:border-purple-500/30',
    };

    return (
      <input
        type={type}
        className={cn(baseStyles, variants[variant], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
