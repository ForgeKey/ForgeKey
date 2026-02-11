import * as React from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const formFieldVariants = tv({
  slots: {
    root: 'space-y-1.5',
    label: 'block text-xs font-semibold text-white',
    hint: 'text-xs text-neutral-200 mt-1',
    error: 'text-xs text-red-400 mt-1',
  },
});

const { root, label, hint, error } = formFieldVariants();

interface FormFieldProps {
  children: React.ReactNode;
  className?: string;
}

interface FormLabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
  children: React.ReactNode;
}

interface FormHintProps {
  children: React.ReactNode;
  className?: string;
}

interface FormErrorProps {
  children: React.ReactNode;
  className?: string;
}

function FormField({ children, className }: FormFieldProps) {
  return <div className={root({ className })}>{children}</div>;
}

function FormLabel({ children, className, ...props }: FormLabelProps) {
  return (
    <label className={label({ className })} {...props}>
      {children}
    </label>
  );
}

function FormHint({ children, className }: FormHintProps) {
  return <p className={hint({ className })}>{children}</p>;
}

function FormError({ children, className }: FormErrorProps) {
  return <p className={error({ className })}>{children}</p>;
}

export type FormFieldVariants = VariantProps<typeof formFieldVariants>;

export { FormField, FormLabel, FormHint, FormError, formFieldVariants };
