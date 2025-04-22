import { Address, Keystore, VanityOpts } from '@/types/address';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';
import { walletApi } from '@/api/wallet-api';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';

/**
 * Hook for managing wallet addresses
 */
export function useWalletAddressManagement(
  states: WalletStates,
  setters: WalletSetters,
  actions: WalletActions
) {
  const { createZeroizedString } = useZeroize();

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
          if (!states.vanityOptions.password) {
            console.error('Password is required for vanity address');
            return;
          }

          const vanityOpts: Omit<VanityOpts, 'password'> = {
            address_label: states.vanityOptions.address_label,
          };

          if (states.vanityOptions.starts_with) {
            vanityOpts.starts_with = states.vanityOptions.starts_with;
          }

          if (states.vanityOptions.ends_with) {
            vanityOpts.ends_with = states.vanityOptions.ends_with;
          }

          const vanityAddress: string = await walletApi.createVanityWallet(
            vanityOpts,
            states.vanityOptions.password
          );

          address = {
            address: vanityAddress,
            label: states.vanityOptions.address_label,
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
    } catch (error) {
      console.error('Error getting private key:', error);
      setters.setPrivateKeyError('Invalid password');
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
