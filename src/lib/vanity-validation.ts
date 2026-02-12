const HEX_CHARS = /[^0-9a-fA-F]/g;
const MAX_HEX_LENGTH = 6;

/**
 * Strips non-hex characters, uppercases, and caps at 6 characters.
 */
export function sanitizeHexInput(value: string): string {
  return value.replace(HEX_CHARS, '').toUpperCase().slice(0, MAX_HEX_LENGTH);
}

export type DifficultyLevel = 'instant' | 'seconds' | 'moderate' | 'long' | 'extreme';

export interface VanityDifficulty {
  level: DifficultyLevel;
  label: string;
  color: string;
}

/**
 * Returns difficulty estimation for vanity address generation
 * based on combined prefix + suffix hex character length.
 */
export function getVanityDifficulty(
  prefixLen: number,
  suffixLen: number,
): VanityDifficulty | null {
  const combined = prefixLen + suffixLen;

  if (combined === 0) return null;

  if (combined <= 4) {
    return { level: 'instant', label: 'Instant', color: 'text-emerald-500' };
  }
  if (combined === 5) {
    return { level: 'seconds', label: '~10 seconds', color: 'text-emerald-500' };
  }
  if (combined === 6) {
    return { level: 'moderate', label: '~3 minutes', color: 'text-yellow-500' };
  }
  if (combined === 7) {
    return { level: 'long', label: '~45 minutes', color: 'text-amber-500' };
  }
  return { level: 'extreme', label: 'May take hours or longer', color: 'text-rose-500' };
}
