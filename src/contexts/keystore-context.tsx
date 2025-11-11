import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { Address, Keystore } from '@/types/address';
import { useWalletReconciliation } from '@/hooks/wallet/use-wallet-reconciliation';

type KeystoreContextType = {
  keystores: Keystore[];
  addGroup: (name: string) => void;
  addAddress: (groupName: string, address: Address) => void;
  removeAddress: (groupName: string, address: Address) => void;
};

const KeystoreContext = createContext<KeystoreContextType | undefined>(
  undefined
);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [keystores, setKeystores] = useState<Keystore[]>([]);

  // Use the reconciliation hook
  useWalletReconciliation(setKeystores);

  useEffect(() => {
    localStorage.setItem('keystores', JSON.stringify(keystores));
  }, [keystores]);

  const addGroup = (name: string) => {
    setKeystores([...keystores, { name, addresses: [] }]);
  };

  const addAddress = (groupName: string, address: Address) => {
    setKeystores(
      keystores.map((keystore) =>
        keystore.name === groupName
          ? { ...keystore, addresses: [...keystore.addresses, address] }
          : keystore
      )
    );
  };

  const removeAddress = (groupName: string, address: Address) => {
    setKeystores(
      keystores.map((keystore) =>
        keystore.name === groupName
          ? {
              ...keystore,
              addresses: keystore.addresses.filter(
                (a: Address) =>
                  a.address.toLowerCase() !== address.address.toLowerCase()
              ),
            }
          : keystore
      )
    );
  };

  return (
    <KeystoreContext.Provider
      value={{ keystores, addGroup, addAddress, removeAddress }}
    >
      {children}
    </KeystoreContext.Provider>
  );
}

export function useKeystore() {
  const context = useContext(KeystoreContext);
  if (context === undefined) {
    throw new Error('useKeystore must be used within a KeystoreProvider');
  }
  return context;
}
