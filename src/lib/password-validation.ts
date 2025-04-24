import zxcvbn from 'zxcvbn';

export interface PasswordValidationResult {
  isValid: boolean;
  score: number;
}

/**
 * Get the color class for a password strength score
 */
export function getScoreColor(score: number): string {
  switch (score) {
    case 0:
      return 'text-rose-500';
    case 1:
      return 'text-amber-500';
    case 2:
      return 'text-yellow-500';
    case 3:
      return 'text-emerald-500';
    case 4:
      return 'text-emerald-500';
    default:
      return 'text-rose-500';
  }
}

/**
 * Get the hex color value for a password strength score
 */
export function getColorHex(score: number): string {
  switch (score) {
    case 0:
      return '#f43f5e'; // rose-500
    case 1:
      return '#f59e0b'; // amber-500
    case 2:
      return '#eab308'; // yellow-500
    case 3:
      return '#10b981'; // emerald-500
    case 4:
      return '#10b981'; // emerald-500
    default:
      return '#f43f5e'; // rose-500
  }
}

/**
 * Get the text description for a password strength score
 */
export function getScoreText(score: number): string {
  switch (score) {
    case 0:
      return 'Very Weak';
    case 1:
      return 'Weak';
    case 2:
      return 'Fair';
    case 3:
      return 'Strong';
    case 4:
      return 'Very Strong';
    default:
      return 'Very Weak';
  }
}

/**
 * Validates a password using zxcvbn for strength estimation
 * Requirements:
 * - Minimum score of 3 (out of 4) from zxcvbn
 */
export function validatePassword(password: string): PasswordValidationResult {
  // Get password strength estimation from zxcvbn
  const result = zxcvbn(password);

  return {
    isValid: result.score >= 3,
    score: result.score,
  };
}
