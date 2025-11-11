import { Address, Keystore } from '@/types/address';
import { walletApi } from '@/api/wallet-api';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook for adding new addresses to a keystore
 */
export function useAddAddress() {
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const newAddress = useWalletStore((state) => state.newAddress);
  const addAddressStep = useWalletStore((state) => state.addAddressStep);
  const vanityOptions = useWalletStore((state) => state.vanityOptions);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const setNewAddress = useWalletStore((state) => state.setNewAddress);
  const setVanityOptions = useWalletStore((state) => state.setVanityOptions);
  const setIsAddingAddress = useWalletStore(
    (state) => state.setIsAddingAddress
  );
  const setAddAddressStep = useWalletStore((state) => state.setAddAddressStep);
  const addAddress = useWalletStore((state) => state.addAddress);

  /**
   * Handles adding a new address to a keystore
   */
  const handleAddAddress = async () => {
    if (
      !selectedKeystore ||
      !newAddress.label ||
      !newAddress.password
    ) {
      return;
    }

    let address: Address;
    try {
      switch (addAddressStep) {
        case 'new':
          const createdAddress: string = await walletApi.createNewWallet(
            newAddress.label,
            newAddress.password
          );

          address = {
            address: createdAddress,
            label: newAddress.label,
          };

          // Update the selectedKeystore state
          setSelectedKeystore((prevKeystore: Keystore | null) => {
            if (!prevKeystore) return null;
            return {
              ...prevKeystore,
              addresses: [...prevKeystore.addresses, address],
            };
          });
          break;
        case 'vanity':
          if (!newAddress.password) {
            console.error('Password is required for vanity address');
            return;
          }

          const vanityOpts = {
            address_label: newAddress.label,
            starts_with: vanityOptions.starts_with,
            ends_with: vanityOptions.ends_with,
          };

          const vanityAddress: string = await walletApi.createVanityWallet(
            vanityOpts,
            newAddress.password
          );

          address = {
            address: vanityAddress,
            label: newAddress.label,
          };

          // Update the selectedKeystore state
          setSelectedKeystore((prevKeystore: Keystore | null) => {
            if (!prevKeystore) return null;
            return {
              ...prevKeystore,
              addresses: [...prevKeystore.addresses, address],
            };
          });
          break;
        case 'import':
          if (!newAddress.privateKey) {
            console.error('Private key is required for import');
            return;
          }

          const importedAddress: string = await walletApi.importPrivateKey(
            newAddress.privateKey,
            newAddress.label,
            newAddress.password
          );

          address = {
            address: importedAddress,
            label: newAddress.label,
          };

          // Update the selectedKeystore state
          setSelectedKeystore((prevKeystore: Keystore | null) => {
            if (!prevKeystore) return null;
            return {
              ...prevKeystore,
              addresses: [...prevKeystore.addresses, address],
            };
          });
          break;
        case 'import-keystore':
          // This is handled by handleImportKeystoreAddress
          return;
        default:
          console.error('Invalid add address step');
          return;
      }

      // Add the address to the keystore
      addAddress(selectedKeystore.name, address);

      // Reset the form
      setNewAddress({
        label: '',
        address: '',
        privateKey: undefined,
      });
      setVanityOptions({
        starts_with: undefined,
        ends_with: undefined,
        address_label: '',
      });
      setIsAddingAddress(false);
      setAddAddressStep('select');
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return {
    handleAddAddress,
  };
}
