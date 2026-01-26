import * as React from 'react';
import * as ScrollAreaPrimitive from '@radix-ui/react-scroll-area';
import { tv, type VariantProps } from 'tailwind-variants';

const scrollAreaVariants = tv({
  slots: {
    root: 'relative overflow-hidden',
    viewport: 'h-full w-full rounded-[inherit]',
    scrollbar:
      'flex touch-none select-none transition-opacity duration-150 data-[state=hidden]:opacity-0 data-[state=visible]:opacity-100',
    thumb: 'relative flex-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors',
  },
  variants: {
    orientation: {
      vertical: {
        scrollbar: 'h-full w-2 border-l border-l-transparent p-[1px]',
      },
      horizontal: {
        scrollbar: 'h-2 flex-col border-t border-t-transparent p-[1px]',
      },
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
});

const { root, viewport } = scrollAreaVariants();

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.Root>
>(({ className, children, ...props }, ref) => (
  <ScrollAreaPrimitive.Root
    ref={ref}
    type="auto"
    className={root({ className })}
    {...props}
  >
    <ScrollAreaPrimitive.Viewport className={viewport()}>
      {children}
    </ScrollAreaPrimitive.Viewport>
    <ScrollBar />
    <ScrollAreaPrimitive.Corner />
  </ScrollAreaPrimitive.Root>
));
ScrollArea.displayName = ScrollAreaPrimitive.Root.displayName;

type ScrollBarVariants = VariantProps<typeof scrollAreaVariants>;

interface ScrollBarProps
  extends React.ComponentPropsWithoutRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
    ScrollBarVariants {}

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof ScrollAreaPrimitive.ScrollAreaScrollbar>,
  ScrollBarProps
>(({ className, orientation = 'vertical', ...props }, ref) => {
  const styles = scrollAreaVariants({ orientation });

  return (
    <ScrollAreaPrimitive.ScrollAreaScrollbar
      ref={ref}
      orientation={orientation}
      forceMount={undefined}
      className={styles.scrollbar({ className })}
      {...props}
    >
      <ScrollAreaPrimitive.ScrollAreaThumb className={styles.thumb()} />
    </ScrollAreaPrimitive.ScrollAreaScrollbar>
  );
});
ScrollBar.displayName = ScrollAreaPrimitive.ScrollAreaScrollbar.displayName;

export { ScrollArea, ScrollBar, scrollAreaVariants };
