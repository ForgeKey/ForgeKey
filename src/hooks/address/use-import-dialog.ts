import { useState } from 'react';
import { useNavigation } from '@/hooks/router/use-navigation';
import { WalletStates, WalletSetters } from '@/types/wallet';

/**
 * Hook for managing import dialog flow
 *
 * Handles the import options dialog state and navigation for both:
 * - Private key import
 * - Keystore file import
 *
 * @param states - Wallet state object
 * @param setters - Wallet state setters
 * @param getKeystoreId - Function to get current keystoreId
 * @returns Dialog state and handlers
 */
export function useImportDialog(
  states: WalletStates,
  setters: WalletSetters,
  getKeystoreId: () => string | null
) {
  const nav = useNavigation();
  const [isImportOptionsOpen, setIsImportOptionsOpen] = useState(false);

  /**
   * Opens the import options dialog
   */
  const handleImportClick = () => {
    setIsImportOptionsOpen(true);
  };

  /**
   * Handles private key import selection
   * Closes dialog and navigates to private key import route
   */
  const handleImportPrivateKey = () => {
    setIsImportOptionsOpen(false);
    const keystoreId = getKeystoreId();
    if (!keystoreId) {
      console.error('No keystoreId available for import');
      return;
    }
    nav.toAddressImport(keystoreId);
  };

  /**
   * Handles keystore file import selection
   * Closes dialog and navigates to keystore selection route
   */
  const handleShowKeystoreSelect = () => {
    setIsImportOptionsOpen(false);
    const keystoreId = getKeystoreId();
    if (!keystoreId) {
      console.error('No keystoreId available for keystore selection');
      return;
    }
    nav.toAddressSelectKeystore(keystoreId);
  };

  /**
   * Handles keystore file selection
   * Pre-fills the address label with keystore name and navigates to import form
   *
   * @param keystoreName - Name of the selected keystore file
   */
  const handleKeystoreSelect = (keystoreName: string) => {
    const keystoreId = getKeystoreId();
    if (!keystoreId) {
      console.error('No keystoreId available for keystore import');
      return;
    }

    // Pre-fill the label with the keystore name
    setters.setNewAddress({
      ...states.newAddress,
      label: keystoreName,
    });

    nav.toAddressImportKeystore(keystoreId);
  };

  return {
    isImportOptionsOpen,
    setIsImportOptionsOpen,
    handleImportClick,
    handleImportPrivateKey,
    handleShowKeystoreSelect,
    handleKeystoreSelect,
  };
}
