import { useNavigation } from '@/hooks/router/use-navigation';
import { WalletStates } from '@/types/wallet';

/**
 * Hook providing navigation-aware wrappers for address handlers
 *
 * Wraps address management handlers to automatically navigate back to
 * the keystore view after successful operations. This prevents users
 * from being stuck on forms after completing actions.
 *
 * @param states - Wallet state object
 * @param handleAddAddressOriginal - Original add address handler
 * @param handleImportKeystoreAddressOriginal - Original import keystore handler
 * @returns Wrapped handlers that include navigation
 */
export function useAddressNavigationHandlers(
  states: WalletStates,
  handleAddAddressOriginal: () => Promise<void>,
  handleImportKeystoreAddressOriginal: () => Promise<void>
) {
  const nav = useNavigation();

  /**
   * Wraps add address handler to navigate back after success
   * Calls the original handler and then navigates to keystore view
   */
  const handleAddAddress = async () => {
    await handleAddAddressOriginal();
    if (states.selectedKeystore) {
      nav.toKeystoreView(states.selectedKeystore.name);
    }
  };

  /**
   * Wraps import keystore address handler to navigate back after success
   * Calls the original handler and then navigates to keystore view
   */
  const handleImportKeystoreAddress = async () => {
    await handleImportKeystoreAddressOriginal();
    if (states.selectedKeystore) {
      nav.toKeystoreView(states.selectedKeystore.name);
    }
  };

  return {
    handleAddAddress,
    handleImportKeystoreAddress,
  };
}
