import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva } from 'class-variance-authority';
import { VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md hover:opacity-90 hover:shadow-lg',
        destructive:
          'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:opacity-90',
        outline:
          'border border-white/10 bg-white/5 shadow-sm hover:bg-white/10 text-foreground backdrop-blur-sm',
        secondary:
          'bg-white/10 text-foreground shadow-sm hover:bg-white/15 backdrop-blur-sm',
        ghost:
          'hover:bg-white/10 text-foreground backdrop-blur-sm',
        link: 'text-purple-400 underline-offset-4 hover:underline hover:text-pink-400',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-lg px-6 text-sm',
        icon: 'h-8 w-8',
        'icon-xs': 'h-6 w-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: VariantProps<typeof buttonVariants>['variant'];
  size?: VariantProps<typeof buttonVariants>['size'];
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
