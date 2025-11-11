import { Address } from '@/types/address';
import { walletApi } from '@/api/wallet-api';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook for viewing and managing private keys
 */
export function usePrivateKey() {
  const { createZeroizedString } = useZeroize();
  const selectedAddressForPrivateKey = useWalletStore(
    (state) => state.selectedAddressForPrivateKey
  );
  const setSelectedAddressForPrivateKey = useWalletStore(
    (state) => state.setSelectedAddressForPrivateKey
  );
  const setIsPasswordDialogOpen = useWalletStore(
    (state) => state.setIsPasswordDialogOpen
  );
  const setPrivateKey = useWalletStore((state) => state.setPrivateKey);
  const setPrivateKeyError = useWalletStore(
    (state) => state.setPrivateKeyError
  );

  /**
   * Handles viewing a private key
   */
  const handleViewPrivateKey = (address: Address) => {
    setSelectedAddressForPrivateKey(address);
    setIsPasswordDialogOpen(true);
  };

  /**
   * Handles password submission for viewing a private key
   */
  const handlePasswordSubmit = async (password: ZeroizedString | null) => {
    if (!selectedAddressForPrivateKey || !password) {
      return;
    }

    try {
      // Get the private key from the keystore
      const privateKey = await walletApi.decryptKeystore(
        selectedAddressForPrivateKey.label,
        password
      );

      // Create a secure private key wrapper
      const zeroizedPrivateKeyWrapper = createZeroizedString(privateKey);

      // Set the private key
      setPrivateKey(zeroizedPrivateKeyWrapper);
      // Clear any previous error message
      setPrivateKeyError('');
    } catch (error) {
      console.error('Error getting private key:', error);
      setPrivateKeyError('Invalid password');
    }
  };

  return {
    handleViewPrivateKey,
    handlePasswordSubmit,
  };
}
