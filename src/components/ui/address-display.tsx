import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const addressDisplayVariants = tv({
  slots: {
    root: 'font-mono',
    highlight: 'font-bold text-white',
    muted: 'text-white/70',
  },
  variants: {
    size: {
      default: {
        root: 'text-xs',
      },
      sm: {
        root: 'text-[10px]',
      },
      lg: {
        root: 'text-sm',
      },
    },
  },
  defaultVariants: {
    size: 'default',
  },
});

type AddressDisplayVariants = VariantProps<typeof addressDisplayVariants>;

interface AddressDisplayProps extends AddressDisplayVariants {
  address: string;
  /** Number of characters to show at start (default: 6) */
  startChars?: number;
  /** Number of characters to show at end (default: 5) */
  endChars?: number;
  className?: string;
}

function AddressDisplay({
  address,
  startChars = 6,
  endChars = 5,
  size,
  className,
}: AddressDisplayProps) {
  const styles = addressDisplayVariants({ size });

  const start = address.slice(0, startChars);
  const middle = address.slice(startChars, -endChars);
  const end = address.slice(-endChars);

  return (
    <span className={styles.root({ className })}>
      <span className={styles.highlight()}>{start}</span>
      <span className={styles.muted()}>{middle}</span>
      <span className={styles.highlight()}>{end}</span>
    </span>
  );
}

export { AddressDisplay, addressDisplayVariants };
export type { AddressDisplayProps };
