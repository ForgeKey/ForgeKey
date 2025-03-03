import { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import {
  validatePassword,
  PasswordValidationResult,
  getScoreColor,
  getScoreText,
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

  return (
    <div className="space-y-2">
      <Input
        type="password"
        placeholder={placeholder}
        value={value?.getValue() || ''}
        onChange={handleChange}
        className={className}
      />
      {showRequirements && value && value.getValue().length > 0 && (
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Password strength:</p>
            <p className={getScoreColor(validation.score)}>
              {getScoreText(validation.score)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
