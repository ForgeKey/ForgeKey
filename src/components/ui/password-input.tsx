import { useState, useEffect } from 'react';
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
}

export function PasswordInput({
  value,
  onChange,
  placeholder = 'Password',
  showRequirements = true,
  className = '',
}: PasswordInputProps) {
  const { createZeroizedString } = useZeroize();
  const [validation, setValidation] = useState<PasswordValidationResult>({
    isValid: false,
    score: 0,
  });

  useEffect(() => {
    if (value) {
      const result = validatePassword(value.getValue());
      setValidation(result);
    } else {
      setValidation({
        isValid: false,
        score: 0,
      });
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      onChange(createZeroizedString(e.target.value));
    } else {
      onChange(null);
    }
  };

  // Create a progress bar width based on the score
  const getProgressWidth = (score: number) => {
    const percentage = ((score + 1) / 5) * 100;
    return `${percentage}%`;
  };

  return (
    <div className="space-y-1.5">
      <Input
        type="password"
        placeholder={placeholder}
        value={value?.getValue() || ''}
        onChange={handleChange}
        className={className}
      />
      {showRequirements && value && value.getValue().length > 0 && (
        <div className="text-xs space-y-1">
          <div className="flex items-center justify-between">
            <p className="text-gray-300">Password strength:</p>
            <p
              className="font-medium"
              style={{ color: getColorHex(validation.score) }}
            >
              {getScoreText(validation.score)}
            </p>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-300 ease-in-out rounded-full`}
              style={{
                width: getProgressWidth(validation.score),
                backgroundColor: getColorHex(validation.score),
              }}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}
