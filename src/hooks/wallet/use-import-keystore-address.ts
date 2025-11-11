import { Address, Keystore } from '@/types/address';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';
import { walletApi } from '@/api/wallet-api';
import { ZeroizedString } from '@/lib/zeroized-string';

/**
 * Hook for importing addresses from existing keystores
 */
export function useImportKeystoreAddress(
  states: WalletStates,
  setters: WalletSetters,
  actions: WalletActions
) {
  /**
   * Handles importing an address from a keystore
   */
  const handleImportKeystoreAddress = async () => {
    if (
      !states.selectedKeystore ||
      !states.newAddress.label ||
      !states.newAddress.password
    ) {
      return;
    }

    try {
      // Get the address from the keystore
      const address: string = await walletApi.getWalletAddress(
        states.newAddress.label,
        states.newAddress.password
      );

      const newAddress: Address = {
        address,
        label: states.newAddress.label,
      };

      // Update the selectedKeystore state
      setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
        if (!prevKeystore) return null;
        return {
          ...prevKeystore,
          addresses: [...prevKeystore.addresses, newAddress],
        };
      });

      // Add the address to the keystore
      actions.addAddress(states.selectedKeystore.name, newAddress);

      // Reset the form
      setters.setNewAddress({
        label: '',
        address: '',
        privateKey: undefined,
      });
      setters.setIsAddingAddress(false);
      setters.setAddAddressStep('select');
    } catch (error) {
      console.error('Error importing address from keystore:', error);
    }
  };

  /**
   * Validates a keystore password
   */
  const validateKeystorePassword = async (
    keystoreName: string,
    securePassword: ZeroizedString
  ): Promise<boolean> => {
    try {
      // Try to get the address from the keystore to validate the password
      await walletApi.getWalletAddress(keystoreName, securePassword);
      return true;
    } catch (error) {
      console.error('Error validating keystore password:', error);
      return false;
    }
  };

  return {
    handleImportKeystoreAddress,
    validateKeystorePassword,
  };
}
