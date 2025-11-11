import { Address } from '@/types/address';
import { WalletStates, WalletSetters } from '@/types/wallet';
import { walletApi } from '@/api/wallet-api';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';

/**
 * Hook for viewing and managing private keys
 */
export function usePrivateKey(states: WalletStates, setters: WalletSetters) {
  const { createZeroizedString } = useZeroize();

  /**
   * Handles viewing a private key
   */
  const handleViewPrivateKey = (address: Address) => {
    setters.setSelectedAddressForPrivateKey(address);
    setters.setIsPasswordDialogOpen(true);
  };

  /**
   * Handles password submission for viewing a private key
   */
  const handlePasswordSubmit = async (password: ZeroizedString | null) => {
    if (!states.selectedAddressForPrivateKey || !password) {
      return;
    }

    try {
      // Get the private key from the keystore
      const privateKey = await walletApi.decryptKeystore(
        states.selectedAddressForPrivateKey.label,
        password
      );

      // Create a secure private key wrapper
      const zeroizedPrivateKeyWrapper = createZeroizedString(privateKey);

      // Set the private key
      setters.setPrivateKey(zeroizedPrivateKeyWrapper);
      // Clear any previous error message
      setters.setPrivateKeyError('');
    } catch (error) {
      console.error('Error getting private key:', error);
      setters.setPrivateKeyError('Invalid password');
    }
  };

  return {
    handleViewPrivateKey,
    handlePasswordSubmit,
  };
}
