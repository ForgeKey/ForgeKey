import { useEffect } from 'react';
import { Keystore } from '@/types/address';
import { useWalletSync } from './use-wallet-sync';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook for reconciling wallet data with the backend
 * Now uses Zustand store directly
 */
export function useWalletReconciliation() {
  const { reconcileWallets } = useWalletSync();
  const keystores = useWalletStore((state) => state.keystores);
  const setKeystores = useWalletStore((state) => state.setKeystores);

  useEffect(() => {
    const reconcileWalletsFromStorage = async () => {
      try {
        const storedKeystores: Keystore[] = JSON.parse(
          localStorage.getItem('wallet-storage') || '{"state":{"keystores":[]}}'
        ).state?.keystores || [];

        const reconciledKeystores = await reconcileWallets(storedKeystores);
        setKeystores(reconciledKeystores);
      } catch (error) {
        console.error('Failed to reconcile wallets:', error);
      }
    };

    reconcileWalletsFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist keystores to localStorage whenever they change
  useEffect(() => {
    const currentStorage = JSON.parse(
      localStorage.getItem('wallet-storage') || '{"state":{},"version":0}'
    );
    localStorage.setItem(
      'wallet-storage',
      JSON.stringify({
        ...currentStorage,
        state: {
          ...currentStorage.state,
          keystores,
        },
      })
    );
  }, [keystores]);
}
