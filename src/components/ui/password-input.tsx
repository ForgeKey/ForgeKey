import { useMemo } from 'react';
import { motion } from 'motion/react';
import { Input } from '@/components/ui/input';
import {
  validatePassword,
  PasswordValidationResult,
  getScoreText,
  getColorHex,
} from '@/lib/password-validation';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';

interface PasswordInputProps {
  value: ZeroizedString | null;
  onChange: (password: ZeroizedString | null) => void;
  placeholder?: string;
  showRequirements?: boolean;
  className?: string;
  variant?: 'default' | 'dark';
}

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  showRequirements = true,
  className = '',
  variant = 'dark',
}: PasswordInputProps) {
  const { createZeroizedString } = useZeroize();

  const validation: PasswordValidationResult = useMemo(() => {
    if (value) {
      return validatePassword(value.getValue());
    }
    return { isValid: false, score: 0 };
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    value?.zeroize();

    if (e.target.value) {
      onChange(createZeroizedString(e.target.value));
    } else {
      onChange(null);
    }
  };

  const progressWidth = useMemo(() => {
    const percentage = ((validation.score + 1) / 5) * 100;
    return `${percentage}%`;
  }, [validation.score]);

  const colorHex = getColorHex(validation.score);

  return (
    <div className="space-y-1.5">
      <Input
        type="password"
        placeholder={placeholder}
        value={value?.getValue() || ''}
        onChange={handleChange}
        variant={variant}
        className={className}
      />
      {showRequirements && value && value.getValue().length > 0 && (
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-gray-300">Password strength:</p>
            <motion.p
              className="font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, color: colorHex }}
              transition={{ duration: 0.2 }}
            >
              {getScoreText(validation.score)}
            </motion.p>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              initial={{ width: 0 }}
              animate={{
                width: progressWidth,
                backgroundColor: colorHex,
              }}
              transition={{
                type: 'spring',
                stiffness: 300,
                damping: 30,
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
