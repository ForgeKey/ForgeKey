import { Address, Keystore } from '@/types/address';
import { walletApi } from '@/api/wallet-api';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook for importing addresses from existing keystores
 */
export function useImportKeystoreAddress() {
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const newAddress = useWalletStore((state) => state.newAddress);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const setNewAddress = useWalletStore((state) => state.setNewAddress);
  const setIsAddingAddress = useWalletStore(
    (state) => state.setIsAddingAddress
  );
  const setAddAddressStep = useWalletStore((state) => state.setAddAddressStep);
  const addAddress = useWalletStore((state) => state.addAddress);

  /**
   * Handles importing an address from a keystore
   */
  const handleImportKeystoreAddress = async () => {
    if (
      !selectedKeystore ||
      !newAddress.label ||
      !newAddress.password
    ) {
      return;
    }

    try {
      // Get the address from the keystore
      const address: string = await walletApi.getWalletAddress(
        newAddress.label,
        newAddress.password
      );

      const importedAddress: Address = {
        address,
        label: newAddress.label,
      };

      // Update the selectedKeystore state
      setSelectedKeystore((prevKeystore: Keystore | null) => {
        if (!prevKeystore) return null;
        return {
          ...prevKeystore,
          addresses: [...prevKeystore.addresses, importedAddress],
        };
      });

      // Add the address to the keystore
      addAddress(selectedKeystore.name, importedAddress);

      // Reset the form
      setNewAddress({
        label: '',
        address: '',
        privateKey: undefined,
      });
      setIsAddingAddress(false);
      setAddAddressStep('select');
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
