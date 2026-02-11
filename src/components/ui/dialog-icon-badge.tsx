import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const dialogIconBadgeVariants = tv({
  base: 'mx-auto bg-gradient-to-r from-[#9333EA] to-[#D946EF] text-white p-2 rounded-full w-9 h-9 flex items-center justify-center mb-1',
});

type DialogIconBadgeVariants = VariantProps<typeof dialogIconBadgeVariants>;

interface DialogIconBadgeProps extends DialogIconBadgeVariants {
  children: React.ReactNode;
  className?: string;
}

function DialogIconBadge({ children, className }: DialogIconBadgeProps) {
  return (
    <div className={dialogIconBadgeVariants({ className })}>{children}</div>
  );
}

export { DialogIconBadge, dialogIconBadgeVariants };
export type { DialogIconBadgeProps };
