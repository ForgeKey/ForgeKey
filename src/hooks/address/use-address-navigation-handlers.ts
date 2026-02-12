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
  handleAddAddressOriginal: () => Promise<boolean>,
  handleImportKeystoreAddressOriginal: () => Promise<void>
) {
  const nav = useNavigation();
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);

  const navigateToKeystore = () => {
    if (selectedKeystore) {
      nav.reset();
      nav.toKeystoreView(selectedKeystore.name);
    }
  };

  const handleAddAddress = async () => {
    const success = await handleAddAddressOriginal();
    if (success) navigateToKeystore();
  };

  const handleImportKeystoreAddress = async () => {
    await handleImportKeystoreAddressOriginal();
    navigateToKeystore();
  };

  return {
    handleAddAddress,
    handleImportKeystoreAddress,
  };
}
