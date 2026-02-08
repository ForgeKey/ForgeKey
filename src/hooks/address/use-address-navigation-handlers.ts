import { useNavigation } from '@/hooks/router/use-navigation';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook providing navigation-aware wrappers for address handlers
 *
 * Wraps address management handlers to automatically navigate back to
 * the keystore view after successful operations. This prevents users
 * from being stuck on forms after completing actions.
 *
 * @param handleAddAddressOriginal - Original add address handler
 * @param handleImportKeystoreAddressOriginal - Original import keystore handler
 * @returns Wrapped handlers that include navigation
 */
export function useAddressNavigationHandlers(
  handleAddAddressOriginal: () => Promise<void>,
  handleImportKeystoreAddressOriginal: () => Promise<void>
) {
  const nav = useNavigation();
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);

  /**
   * Wraps add address handler to navigate back after success
   * Calls the original handler and then navigates to keystore view
   */
  const handleAddAddress = async () => {
    await handleAddAddressOriginal();
    if (selectedKeystore) {
      nav.reset();
      nav.toKeystoreView(selectedKeystore.name);
    }
  };

  /**
   * Wraps import keystore address handler to navigate back after success
   * Calls the original handler and then navigates to keystore view
   */
  const handleImportKeystoreAddress = async () => {
    await handleImportKeystoreAddressOriginal();
    if (selectedKeystore) {
      nav.reset();
      nav.toKeystoreView(selectedKeystore.name);
    }
  };

  return {
    handleAddAddress,
    handleImportKeystoreAddress,
  };
}
