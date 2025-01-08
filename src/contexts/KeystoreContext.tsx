import { createContext, useContext, useState, ReactNode } from 'react';

type Address = {
  label: string;
  address: string;
  privateKey: string;
};

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
  const [keystores, setKeystores] = useState<Keystore[]>([
    {
      name: 'Main Keystore',
      addresses: [
        {
          label: 'Main 1',
          address: '0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5',
          privateKey: 'abcdef1234567890',
        },
        {
          label: 'Main 2',
          address: '0x1234567890abcdef1234567890abcdef12345678',
          privateKey: '1234567890abcdef',
        },
      ],
    },
    {
      name: 'Development Keystore',
      addresses: [
        {
          label: 'Development 1',
          address: '0xabcdef1234567890abcdef1234567890abcdef12',
          privateKey: 'fedcba0987654321',
        },
        {
          label: 'Development 2',
          address: '0x7890abcdef1234567890abcdef1234567890abcd',
          privateKey: '0987654321fedcba',
        },
      ],
    },
    {
      name: 'Test Keystore',
      addresses: [
        {
          label: 'Test 1',
          address: '0x4567890abcdef1234567890abcdef1234567890a',
          privateKey: 'abcdefabcdefabcd',
        },
        {
          label: 'Test 2',
          address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
          privateKey: '1234561234561234',
        },
      ],
    },
  ]);

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
