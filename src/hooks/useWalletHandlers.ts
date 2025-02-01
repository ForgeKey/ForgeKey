import { invoke } from '@tauri-apps/api/core';
import { Address, Keystore, VanityOpts } from '@/types/address';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';

export function useWalletHandlers(
  states: WalletStates,
  setters: WalletSetters,
  actions: WalletActions
) {
  const handleKeystoreClick = (keystore: Keystore) => {
    setters.setSelectedKeystore(keystore);
  };

  const handleBackClick = () => {
    if (states.isAddingAddress) {
      if (states.addAddressStep === 'select') {
        setters.setIsAddingAddress(false);
      } else {
        setters.setAddAddressStep('select');
      }
    } else if (states.isAddingKeystore) {
      setters.setIsAddingKeystore(false);
      setters.setNewKeystoreName('');
    } else {
      setters.setSelectedKeystore(null);
    }
  };

  const handleAddAddress = async () => {
    if (!states.selectedKeystore || !states.newAddress.label) {
      return;
    }

    let address: Address;
    try {
      switch (states.addAddressStep) {
        case 'new':
          const createdAddress: string = await invoke('create_new_wallet', {
            address_label: states.newAddress.label,
            password: states.newAddress.password,
          });

          address = {
            address: createdAddress,
            label: states.newAddress.label,
            password: states.newAddress.password,
          };
          break;

        case 'vanity':
          const vanityOpts: VanityOpts = {
            address_label: states.newAddress.label,
            password: states.newAddress.password!,
          };

          if (states.vanityOptions.starts_with) {
            vanityOpts.starts_with = states.vanityOptions.starts_with;
          }

          if (states.vanityOptions.ends_with) {
            vanityOpts.ends_with = states.vanityOptions.ends_with;
          }

          const createdVanityAddress: string = await invoke(
            'create_vanity_wallet',
            vanityOpts
          );

          address = {
            label: states.newAddress.label,
            address: createdVanityAddress,
            password: states.newAddress.password,
          };
          break;

        case 'import':
          const importedAddress: string = await invoke('import_private_key', {
            private_key: states.newAddress.privateKey,
            address_label: states.newAddress.label,
            password: states.newAddress.password,
          });

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

  const handleAddKeystore = () => {
    if (states.newKeystoreName) {
      actions.addKeystore(states.newKeystoreName);
      setters.setNewKeystoreName('');
      setters.setIsAddingKeystore(false);
    }
  };

  const handleViewPrivateKey = (address: Address) => {
    setters.setSelectedAddressForPrivateKey(address);
    setters.setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (states.password === 'password') {
      setters.setIsPasswordDialogOpen(false);
      setters.setPassword('');
    } else {
      alert('Incorrect password');
    }
  };

  return {
    handleKeystoreClick,
    handleBackClick,
    handleAddAddress,
    handleAddKeystore,
    handleViewPrivateKey,
    handlePasswordSubmit,
  };
}
