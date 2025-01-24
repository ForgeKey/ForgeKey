import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { Address, Keystore } from '@/types/address';
import { useWalletReconciliation } from '@/hooks/useWalletReconciliation';

type KeystoreContextType = {
  keystores: Keystore[];
  addKeystore: (name: string) => void;
  addAddress: (keystoreName: string, address: Address) => void;
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

  const addKeystore = (name: string) => {
    setKeystores([...keystores, { name, addresses: [] }]);
  };

  const addAddress = (keystoreName: string, address: Address) => {
    setKeystores(
      keystores.map((keystore) =>
        keystore.name === keystoreName
          ? { ...keystore, addresses: [...keystore.addresses, address] }
          : keystore
      )
    );
  };

  return (
    <KeystoreContext.Provider value={{ keystores, addKeystore, addAddress }}>
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
