import { Address, Keystore, VanityOpts } from '@/types/address';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';
import { walletApi } from '@/api/wallet-api';

/**
 * Hook for managing wallet addresses
 */
export function useWalletAddressManagement(
  states: WalletStates,
  setters: WalletSetters,
  actions: WalletActions
) {
  /**
   * Handles adding a new address to a keystore
   */
  const handleAddAddress = async () => {
    if (!states.selectedKeystore || !states.newAddress.label) {
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
            password: states.newAddress.password,
          };
          break;

        case 'vanity':
          const vanityOpts: VanityOpts = {
            address_label: states.newAddress.label,
            password: states.newAddress.password,
          };

          if (states.vanityOptions.starts_with) {
            vanityOpts.starts_with = states.vanityOptions.starts_with;
          }

          if (states.vanityOptions.ends_with) {
            vanityOpts.ends_with = states.vanityOptions.ends_with;
          }

          const createdVanityAddress: string =
            await walletApi.createVanityWallet(vanityOpts);

          address = {
            label: states.newAddress.label,
            address: createdVanityAddress,
            password: states.newAddress.password,
          };
          break;

        case 'import':
          const importedAddress: string = await walletApi.importPrivateKey(
            states.newAddress.privateKey!,
            states.newAddress.label,
            states.newAddress.password
          );

          address = {
            label: states.newAddress.label,
            address: importedAddress,
            password: states.newAddress.password,
          };
          break;

        default:
          return;
      }

      // Update the selectedKeystore state
      setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
        if (!prevKeystore) return null;
        return {
          ...prevKeystore,
          addresses: [...prevKeystore.addresses, address],
        };
      });

      actions.addAddress(states.selectedKeystore.name, address);
      setters.setNewAddress({
        label: '',
        address: '',
        password: '',
        privateKey: undefined,
      });
      setters.setVanityOptions({
        starts_with: undefined,
        ends_with: undefined,
        address_label: '',
        password: '',
      });
      setters.setIsAddingAddress(false);
      setters.setAddAddressStep('select');
    } catch (error) {
      console.error('Error adding address:', error);
    }
  };

  /**
   * Handles importing an address from an existing keystore
   */
  const handleImportKeystoreAddress = async () => {
    if (!states.selectedKeystore || !states.newAddress.label) {
      return;
    }

    try {
      // Get the address from the keystore using the password
      const walletAddress: string = await walletApi.getWalletAddress(
        states.newAddress.label,
        states.newAddress.password
      );

      const address: Address = {
        label: states.newAddress.label,
        address: walletAddress,
        password: states.newAddress.password,
      };

      // Update the selectedKeystore state
      setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
        if (!prevKeystore) return null;
        return {
          ...prevKeystore,
          addresses: [...prevKeystore.addresses, address],
        };
      });

      actions.addAddress(states.selectedKeystore.name, address);
      setters.setNewAddress({
        label: '',
        address: '',
        password: '',
        privateKey: undefined,
      });
      setters.setIsAddingAddress(false);
      setters.setAddAddressStep('select');
    } catch (error) {
      console.error('Error importing keystore address:', error);
    }
  };

  /**
   * Handles deleting an address
   */
  const handleDeleteAddress = async (address: Address) => {
    try {
      // Remove the keystore file
      await walletApi.removeKeystore(address.label);

      // Update the selectedKeystore state
      setters.setSelectedKeystore((prevKeystore: Keystore | null) => {
        if (!prevKeystore) return null;
        return {
          ...prevKeystore,
          addresses: prevKeystore.addresses.filter(
            (addr) => addr.label !== address.label
          ),
        };
      });

      // Update the global state
      actions.removeAddress(states.selectedKeystore!.name, address);
    } catch (error) {
      console.error('Error deleting address:', error);
    }
  };

  /**
   * Validates a keystore password
   */
  const validateKeystorePassword = async (
    keystoreName: string,
    password: string
  ): Promise<boolean> => {
    try {
      await walletApi.getWalletAddress(keystoreName, password);
      return true;
    } catch (err) {
      console.error('Error validating keystore:', err);
      return false;
    }
  };

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
  const handlePasswordSubmit = async (password: string) => {
    try {
      const privateKey: string = await walletApi.decryptKeystore(
        states.selectedAddressForPrivateKey!.label,
        password
      );

      setters.setPrivateKeyError('');
      setters.setPrivateKey(privateKey);
    } catch (error: unknown) {
      if (typeof error === 'string' && error.includes('Mac Mismatch')) {
        setters.setPrivateKeyError('Invalid password');
      } else {
        setters.setPrivateKeyError('Error decrypting keystore');
      }
      setters.setPrivateKey('');
    }
  };

  return {
    handleAddAddress,
    handleImportKeystoreAddress,
    handleDeleteAddress,
    validateKeystorePassword,
    handleViewPrivateKey,
    handlePasswordSubmit,
  };
}
