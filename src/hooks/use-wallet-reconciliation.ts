import { useEffect } from 'react';
import { Keystore } from '@/types/address';
import { useWalletSync } from './use-wallet-sync';

/**
 * Hook for reconciling wallet data with the backend
 */
export function useWalletReconciliation(
  setKeystores: (keystores: Keystore[]) => void
) {
  const { reconcileWallets } = useWalletSync();

  useEffect(() => {
    const reconcileWalletsFromStorage = async () => {
      try {
        const keystores: Keystore[] = JSON.parse(
          localStorage.getItem('keystores') || '[]'
        );

        const reconciledKeystores = await reconcileWallets(keystores);
        setKeystores(reconciledKeystores);
      } catch (error) {
        console.error('Failed to reconcile wallets:', error);
      }
    };

    reconcileWalletsFromStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
