/**
 * This file defines types for the zeroize module.
 * These types are used for TypeScript type checking.
 */

// Define the ZeroizedString type
export type ZeroizedString = {
  get_value(): string;
  zeroize(): void;
};
