import { Keystore } from '@/types/address';
import { walletApi } from '@/api/wallet-api';

/**
 * Hook for synchronizing wallet data with the backend
 */
export function useWalletSync() {
  /**
   * Loads available keystores from the backend
   */
  const loadAvailableKeystores = async (): Promise<string[]> => {
    try {
      return await walletApi.listWallets();
    } catch (err) {
      console.error('Failed to load keystores:', err);
      return [];
    }
  };

  /**
   * Reconciles wallet data with available keystores
   */
  const reconcileWallets = async (
    keystores: Keystore[]
  ): Promise<Keystore[]> => {
    try {
      const availableWallets: string[] = await walletApi.listWallets();

      return keystores.reduce<Keystore[]>((acc, keystore) => {
        const filteredAddresses = keystore.addresses.filter((addr) =>
          availableWallets.includes(addr.label)
        );

        if (filteredAddresses.length > 0) {
          acc.push({ ...keystore, addresses: filteredAddresses });
        }

        return acc;
      }, []);
    } catch (error) {
      console.error('Failed to reconcile wallets:', error);
      return keystores;
    }
  };

  return {
    loadAvailableKeystores,
    reconcileWallets,
  };
}
