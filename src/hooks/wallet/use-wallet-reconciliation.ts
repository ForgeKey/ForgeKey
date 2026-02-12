import { useEffect, useRef } from 'react';
import { Keystore } from '@/types/address';
import { useWalletSync } from './use-wallet-sync';
import { useWalletStore } from '@/stores/wallet-store';
import { useNavigation } from '@/hooks/router/use-navigation';
import { ROUTES } from '@/router/types';

/**
 * Hook for reconciling wallet data with the backend
 * Now uses Zustand store directly
 */
export function useWalletReconciliation() {
  const { reconcileWallets } = useWalletSync();
  const keystores = useWalletStore((state) => state.keystores);
  const setKeystores = useWalletStore((state) => state.setKeystores);
  const setIsInitialized = useWalletStore((state) => state.setIsInitialized);
  const nav = useNavigation();
  const hasReconciled = useRef(false);

  useEffect(() => {
    const reconcileWalletsFromStorage = async () => {
      try {
        const storedKeystores: Keystore[] = JSON.parse(
          localStorage.getItem('wallet-storage') || '{"state":{"keystores":[]}}'
        ).state?.keystores || [];

        const reconciledKeystores = await reconcileWallets(storedKeystores);
        setKeystores(reconciledKeystores);

        // Auto-navigate to onboarding if no keystores exist
        // Only on initial reconciliation and when on keystore list route
        if (
          !hasReconciled.current &&
          reconciledKeystores.length === 0 &&
          nav.currentRoute.name === ROUTES.KEYSTORE_LIST
        ) {
          nav.navigate({ name: ROUTES.ONBOARDING_WELCOME });
        }

        hasReconciled.current = true;
      } catch (error) {
        console.error('Failed to reconcile wallets:', error);
      } finally {
        setIsInitialized(true);
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
