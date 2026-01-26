import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';
import { tv, type VariantProps } from 'tailwind-variants';

const switchVariants = tv({
  slots: {
    root: 'peer inline-flex shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input dark:data-[state=unchecked]:bg-input/80',
    thumb:
      'pointer-events-none block rounded-full ring-0 transition-transform bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground data-[state=unchecked]:translate-x-0',
  },
  variants: {
    size: {
      default: {
        root: 'h-[1.15rem] w-8',
        thumb: 'size-4 data-[state=checked]:translate-x-[calc(100%-2px)]',
      },
      sm: {
        root: 'h-3.5 w-6',
        thumb: 'size-3 data-[state=checked]:translate-x-[calc(100%-2px)]',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type SwitchVariants = VariantProps<typeof switchVariants>;

interface SwitchProps
  extends React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root>,
    SwitchVariants {}

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, size, ...props }, ref) => {
  const { root, thumb } = switchVariants({ size });

  return (
    <SwitchPrimitive.Root
      ref={ref}
      className={root({ className })}
      {...props}
    >
      <SwitchPrimitive.Thumb className={thumb()} />
    </SwitchPrimitive.Root>
  );
});
Switch.displayName = SwitchPrimitive.Root.displayName;

export { Switch, switchVariants };
