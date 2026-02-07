import { Address, Keystore } from '@/types/address';
import { walletApi } from '@/api/wallet-api';
import { useWalletStore } from '@/stores/wallet-store';
import { useNavigation } from '@/hooks/router/use-navigation';
import { ROUTES } from '@/router/types';

/**
 * Hook for deleting addresses from a keystore
 */
export function useDeleteAddress() {
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const removeAddress = useWalletStore((state) => state.removeAddress);
  const setKeystores = useWalletStore((state) => state.setKeystores);
  const nav = useNavigation();

  /**
   * Removes the address from UI state and navigates if the group becomes empty
   */
  const removeAddressFromUI = (address: Address) => {
    removeAddress(selectedKeystore!.name, address);

    setSelectedKeystore((prevKeystore: Keystore | null) => {
      if (!prevKeystore) return null;
      return {
        ...prevKeystore,
        addresses: prevKeystore.addresses.filter(
          (a) => a.address !== address.address
        ),
      };
    });

    // Check if the group is now empty after removal
    const updatedKeystores = useWalletStore.getState().keystores;
    const currentGroup = updatedKeystores.find(
      (k) => k.name === selectedKeystore!.name
    );

    if (currentGroup && currentGroup.addresses.length === 0) {
      // Remove the empty group
      const remainingKeystores = updatedKeystores.filter(
        (k) => k.name !== selectedKeystore!.name
      );
      setKeystores(remainingKeystores);
      setSelectedKeystore(null);

      if (remainingKeystores.length === 0) {
        nav.navigate({ name: ROUTES.ONBOARDING_WELCOME });
      } else {
        nav.toKeystoreList();
      }
    }
  };

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

      removeAddressFromUI(address);
    } catch (error) {
      console.error('Error deleting address:', error);

      // Check if the error is that the keystore file doesn't exist
      const errorMessage =
        error instanceof Error ? error.toString() : String(error);
      if (
        errorMessage.includes(`Keystore file '${address.label}' does not exist`)
      ) {
        // If the keystore file doesn't exist, still remove the address from the UI
        removeAddressFromUI(address);
      }
    }
  };

  return {
    handleDeleteAddress,
  };
}
