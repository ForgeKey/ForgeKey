import { Address, Keystore } from '@/types/address';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';
import { walletApi } from '@/api/wallet-api';

/**
 * Hook for deleting addresses from a keystore
 */
export function useDeleteAddress(
  states: WalletStates,
  setters: WalletSetters,
  actions: WalletActions
) {
  /**
   * Handles deleting an address from a keystore
   */
  const handleDeleteAddress = async (address: Address) => {
    if (!states.selectedKeystore) {
      return;
    }

    try {
      // Remove the keystore file
      await walletApi.removeKeystore(address.label);

      // Remove the address from the keystore
      actions.removeAddress(states.selectedKeystore.name, address);

      // Update the selectedKeystore state
      setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
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
        actions.removeAddress(states.selectedKeystore.name, address);

        // Update the selectedKeystore state
        setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
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
