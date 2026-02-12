import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { tv, type VariantProps } from 'tailwind-variants';

const buttonVariants = tv({
  base: 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:text-neutral-400',
  variants: {
    variant: {
      default:
        'btn-gradient text-white shadow-md hover:shadow-lg',
      destructive:
        'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:opacity-90 disabled:opacity-50',
      outline:
        'btn-outline-gradient shadow-sm text-foreground',
      secondary:
        'bg-white/10 text-foreground shadow-sm hover:bg-white/15 backdrop-blur-sm disabled:opacity-50',
      ghost: 'hover:bg-white/10 text-foreground backdrop-blur-sm disabled:opacity-50',
      link: 'text-purple-400 underline-offset-4 hover:underline hover:text-pink-400 disabled:opacity-50',
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
});

type ButtonVariants = VariantProps<typeof buttonVariants>;

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    ButtonVariants {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp
        className={buttonVariants({ variant, size, className })}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
export type { ButtonVariants };
