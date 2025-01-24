import { useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import { Keystore } from '@/types/address';

export function useWalletReconciliation(
  setKeystores: (keystores: Keystore[]) => void
) {
  useEffect(() => {
    const reconcileWallets = async () => {
      try {
        const keystores: Keystore[] = JSON.parse(
          localStorage.getItem('keystores') || '[]'
        );

        const availableWallets: string[] = await invoke('list_addresses');

        const reconciledKeystores = keystores.reduce<Keystore[]>(
          (acc, keystore) => {
            const filteredAddresses = keystore.addresses.filter((addr) =>
              availableWallets.includes(addr.label)
            );

            if (filteredAddresses.length > 0) {
              acc.push({ ...keystore, addresses: filteredAddresses });
            }

            return acc;
          },
          []
        );

        setKeystores(reconciledKeystores);
      } catch (error) {
        console.error('Failed to reconcile wallets:', error);
      }
    };

    reconcileWallets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
