import { Address, Keystore } from '@/types/address';
import { walletApi } from '@/api/wallet-api';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook for deleting addresses from a keystore
 */
export function useDeleteAddress() {
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const removeAddress = useWalletStore((state) => state.removeAddress);

  /**
   * Handles deleting an address from a keystore
   */
  const handleDeleteAddress = async (address: Address) => {
    if (!selectedKeystore) {
      return;
    }

    try {
      // Remove the keystore file
      await walletApi.removeKeystore(address.label);

      // Remove the address from the keystore
      removeAddress(selectedKeystore.name, address);

      // Update the selectedKeystore state
      setSelectedKeystore((prevKeystore: Keystore | null) => {
        if (!prevKeystore) return null;
        return {
          ...prevKeystore,
          addresses: prevKeystore.addresses.filter(
            (a) => a.address !== address.address
          ),
        };
      });
    } catch (error) {
      console.error('Error deleting address:', error);

      // Check if the error is that the keystore file doesn't exist
      const errorMessage =
        error instanceof Error ? error.toString() : String(error);
      if (
        errorMessage.includes(`Keystore file '${address.label}' does not exist`)
      ) {
        // If the keystore file doesn't exist, still remove the address from the UI
        removeAddress(selectedKeystore.name, address);

        // Update the selectedKeystore state
        setSelectedKeystore((prevKeystore: Keystore | null) => {
          if (!prevKeystore) return null;
          return {
            ...prevKeystore,
            addresses: prevKeystore.addresses.filter(
              (a) => a.address !== address.address
            ),
          };
        });
      }
    }
  };

  return {
    handleDeleteAddress,
  };
}
