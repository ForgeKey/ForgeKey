/**
 * Export all contexts from this file for easier imports
 */

// Export ZeroizeContext
export { ZeroizeProvider, useZeroize } from './zeroize-context';
export { ZeroizedString } from '../lib/zeroized-string';

// Export types
export type { ZeroizedStringType } from './zeroize-context';

// Export other contexts as needed
export { KeystoreProvider } from './keystore-context';
export { ThemeProvider } from './theme-context';
