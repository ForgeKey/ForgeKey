import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

import { Address } from '@/types/address';

type Keystore = {
  name: string;
  addresses: Address[];
};

type KeystoreContextType = {
  keystores: Keystore[];
  addKeystore: (name: string) => void;
  addAddress: (keystoreName: string, address: Address) => void;
  // Add other methods as needed
};

const KeystoreContext = createContext<KeystoreContextType | undefined>(
  undefined
);

export function KeystoreProvider({ children }: { children: ReactNode }) {
  const [keystores, setKeystores] = useState<Keystore[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('keystores');
    if (saved) {
      setKeystores(JSON.parse(saved));
    }
  }, []);

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
