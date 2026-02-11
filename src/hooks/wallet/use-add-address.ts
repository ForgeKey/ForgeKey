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
  const setSelectedKeystore = useWalletStore((state) => state.setSelectedKeystore);
  const setIsGeneratingVanity = useWalletStore((state) => state.setIsGeneratingVanity);
  const addAddress = useWalletStore((state) => state.addAddress);
  const resetAddressForm = useWalletStore((state) => state.resetAddressForm);

  const handleAddAddress = async (): Promise<boolean> => {
    if (!selectedKeystore || !newAddress.label || !newAddress.password) {
      return false;
    }

    let resolvedAddress: string;
    try {
      switch (addAddressStep) {
        case 'new':
          resolvedAddress = await walletApi.createNewWallet(
            newAddress.label,
            newAddress.password
          );
          break;

        case 'vanity': {
          const vanityOpts = {
            address_label: newAddress.label,
            starts_with: vanityOptions.starts_with,
            ends_with: vanityOptions.ends_with,
          };

          setIsGeneratingVanity(true);
          try {
            resolvedAddress = await walletApi.createVanityWallet(
              vanityOpts,
              newAddress.password
            );
          } catch (error) {
            const msg = error instanceof Error ? error.message : String(error);
            if (msg.includes('cancelled')) return false;
            throw error;
          } finally {
            setIsGeneratingVanity(false);
          }
          break;
        }

        case 'import':
          if (!newAddress.privateKey) {
            console.error('Private key is required for import');
            return false;
          }
          resolvedAddress = await walletApi.importPrivateKey(
            newAddress.privateKey,
            newAddress.label,
            newAddress.password
          );
          break;

        case 'import-keystore':
          return false;

        default:
          console.error('Invalid add address step');
          return false;
      }

      const address: Address = {
        address: resolvedAddress,
        label: newAddress.label,
      };

      setSelectedKeystore((prev: Keystore | null) => {
        if (!prev) return null;
        return { ...prev, addresses: [...prev.addresses, address] };
      });
      addAddress(selectedKeystore.name, address);
      resetAddressForm();
      return true;
    } catch (error) {
      console.error('Error adding address:', error);
      return false;
    }
  };

  return {
    handleAddAddress,
  };
}
