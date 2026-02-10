import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';
import { Eye, EyeOff } from 'lucide-react';

const inputVariants = tv({
  base: 'flex h-9 w-full rounded-md px-3 py-2 text-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
  variants: {
    variant: {
      default:
        'bg-white/90 text-gray-900 placeholder:text-gray-400 border border-transparent',
      dark: 'bg-white/10 text-white placeholder:text-white/40 border border-white/10',
    },
  },
  defaultVariants: {
    variant: 'dark',
  },
});

type InputVariants = VariantProps<typeof inputVariants>;

interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariants {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, variant, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const isPassword = type === 'password';

    return (
      <div className="input-focus-gradient w-full rounded-md relative">
        <input
          type={isPassword && showPassword ? 'text' : type}
          className={inputVariants({
            variant,
            className: isPassword ? `pr-9 ${className ?? ''}` : className,
          })}
          ref={ref}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
          >
            {showPassword ? (
              <Eye className="h-4 w-4" />
            ) : (
              <EyeOff className="h-4 w-4" />
            )}
          </button>
        )}
      </div>
    );
  }
);
Input.displayName = 'Input';

export { Input, inputVariants };
