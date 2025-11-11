import { Address, Keystore, VanityOpts } from '@/types/address';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';
import { walletApi } from '@/api/wallet-api';

/**
 * Hook for adding new addresses to a keystore
 */
export function useAddAddress(
  states: WalletStates,
  setters: WalletSetters,
  actions: WalletActions
) {
  /**
   * Handles adding a new address to a keystore
   */
  const handleAddAddress = async () => {
    if (
      !states.selectedKeystore ||
      !states.newAddress.label ||
      !states.newAddress.password
    ) {
      return;
    }

    let address: Address;
    try {
      switch (states.addAddressStep) {
        case 'new':
          const createdAddress: string = await walletApi.createNewWallet(
            states.newAddress.label,
            states.newAddress.password
          );

          address = {
            address: createdAddress,
            label: states.newAddress.label,
          };

          // Update the selectedKeystore state
          setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
            if (!prevKeystore) return null;
            return {
              ...prevKeystore,
              addresses: [...prevKeystore.addresses, address],
            };
          });
          break;
        case 'vanity':
          if (!states.newAddress.password) {
            console.error('Password is required for vanity address');
            return;
          }

          const vanityOpts: Omit<VanityOpts, 'password'> = {
            address_label: states.newAddress.label,
          };

          if (states.vanityOptions.starts_with) {
            vanityOpts.starts_with = states.vanityOptions.starts_with;
          }

          if (states.vanityOptions.ends_with) {
            vanityOpts.ends_with = states.vanityOptions.ends_with;
          }

          const vanityAddress: string = await walletApi.createVanityWallet(
            vanityOpts,
            states.newAddress.password
          );

          address = {
            address: vanityAddress,
            label: states.newAddress.label,
          };

          // Update the selectedKeystore state
          setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
            if (!prevKeystore) return null;
            return {
              ...prevKeystore,
              addresses: [...prevKeystore.addresses, address],
            };
          });
          break;
        case 'import':
          if (!states.newAddress.privateKey) {
            console.error('Private key is required for import');
            return;
          }

          const importedAddress: string = await walletApi.importPrivateKey(
            states.newAddress.privateKey,
            states.newAddress.label,
            states.newAddress.password
          );

          address = {
            address: importedAddress,
            label: states.newAddress.label,
          };

          // Update the selectedKeystore state
          setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
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
      actions.addAddress(states.selectedKeystore.name, address);

      // Reset the form
      setters.setNewAddress({
        label: '',
        address: '',
        privateKey: undefined,
      });
      setters.setVanityOptions({
        starts_with: undefined,
        ends_with: undefined,
        address_label: '',
      });
      setters.setIsAddingAddress(false);
      setters.setAddAddressStep('select');
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  return {
    handleAddAddress,
  };
}
