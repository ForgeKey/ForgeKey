import { useState } from 'react';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Header } from '@/components/core/header';
import { Footer } from '@/components/core/footer';
import { KeystoreList } from '@/components/core/keystore-list';
import { KeystoreView } from '@/components/core/keystore-view';
import { PasswordDialog } from '@/components/core/password-dialog';
import { PrivateKeyDialog } from '@/components/core/private-key-dialog';
import { SelectAddressType } from '@/components/core/address/select-address-type';
import { NewAddressForm } from '@/components/core/address/new-address-form';
import { VanityAddressForm } from '@/components/core/address/vanity-address-form';
import { ImportAddressForm } from '@/components/core/address/import-address-form';

type Address = {
  label: string;
  address: string;
  privateKey: string;
};

type Keystore = {
  name: string;
  addresses: Address[];
};

export default function CastWallet() {
  const [keystores, setKeystores] = useState<Keystore[]>([
    {
      name: 'Main Keystore',
      addresses: [
        {
          label: 'Primary',
          address: '0x1234...7890',
          privateKey: 'abcdef1234567890',
        },
        {
          label: 'Savings',
          address: '0x2345...8901',
          privateKey: 'bcdef1234567890a',
        },
      ],
    },
    {
      name: 'DeFi Keystore',
      addresses: [
        {
          label: 'Trading',
          address: '0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5',
          privateKey: 'cdef1234567890ab',
        },
        {
          label: 'Yield Farming',
          address: '0x3456...9012',
          privateKey: 'def1234567890abc',
        },
        {
          label: 'Liquidity Pool',
          address: '0x4567...0123',
          privateKey: 'ef1234567890abcd',
        },
      ],
    },
  ]);

  const [selectedKeystore, setSelectedKeystore] = useState<Keystore | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressStep, setAddAddressStep] = useState<
    'select' | 'new' | 'vanity' | 'import'
  >('select');
  const [newAddress, setNewAddress] = useState({
    label: '',
    address: '',
    privateKey: '',
  });
  const [vanityOptions, setVanityOptions] = useState({
    startWith: '',
    endWith: '',
  });
  const [isAddingKeystore, setIsAddingKeystore] = useState(false);
  const [newKeystoreName, setNewKeystoreName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedAddressForPrivateKey, setSelectedAddressForPrivateKey] =
    useState<Address | null>(null);

  const handleKeystoreClick = (keystore: Keystore) => {
    setSelectedKeystore(keystore);
  };

  const handleBackClick = () => {
    if (isAddingAddress) {
      if (addAddressStep === 'select') {
        setIsAddingAddress(false);
      } else {
        setAddAddressStep('select');
      }
    } else {
      setSelectedKeystore(null);
    }
  };

  const handleAddAddress = () => {
    if (selectedKeystore && newAddress.label) {
      let address: Address;
      switch (addAddressStep) {
        case 'new':
          address = {
            label: newAddress.label,
            address:
              '0x' +
              Array(40)
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join(''),
            privateKey: Array(64)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join(''),
          };
          break;
        case 'vanity':
          address = {
            label: newAddress.label,
            address:
              '0x' +
              vanityOptions.startWith +
              Array(
                38 -
                  vanityOptions.startWith.length -
                  vanityOptions.endWith.length
              )
                .fill(0)
                .map(() => Math.floor(Math.random() * 16).toString(16))
                .join('') +
              vanityOptions.endWith,
            privateKey: Array(64)
              .fill(0)
              .map(() => Math.floor(Math.random() * 16).toString(16))
              .join(''),
          };
          break;
        case 'import':
          address = {
            label: newAddress.label,
            address: '0x' + newAddress.privateKey.slice(-40),
            privateKey: newAddress.privateKey,
          };
          break;
        default:
          return;
      }

      const updatedKeystores = keystores.map((keystore) =>
        keystore.name === selectedKeystore.name
          ? { ...keystore, addresses: [...keystore.addresses, address] }
          : keystore
      );
      setKeystores(updatedKeystores);
      setSelectedKeystore(
        updatedKeystores.find((k) => k.name === selectedKeystore.name) || null
      );
      setNewAddress({ label: '', address: '', privateKey: '' });
      setVanityOptions({ startWith: '', endWith: '' });
      setIsAddingAddress(false);
      setAddAddressStep('select');
    }
  };

  const handleAddKeystore = () => {
    if (newKeystoreName) {
      setKeystores([...keystores, { name: newKeystoreName, addresses: [] }]);
      setNewKeystoreName('');
      setIsAddingKeystore(false);
    }
  };

  const handleViewPrivateKey = (address: Address) => {
    setSelectedAddressForPrivateKey(address);
    setIsPasswordDialogOpen(true);
  };

  const handlePasswordSubmit = () => {
    // In a real app, you would verify the password here
    if (password === 'password') {
      setIsPasswordDialogOpen(false);
      setPassword('');
    } else {
      // Show an error message
      alert('Incorrect password');
    }
  };

  const renderAddAddressContent = () => {
    switch (addAddressStep) {
      case 'select':
        return (
          <SelectAddressType
            setAddAddressStep={setAddAddressStep}
            setIsAddingAddress={setIsAddingAddress}
          />
        );
      case 'new':
        return (
          <NewAddressForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
            setAddAddressStep={setAddAddressStep}
          />
        );
      case 'vanity':
        return (
          <VanityAddressForm
            vanityOptions={vanityOptions}
            setVanityOptions={setVanityOptions}
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
            setAddAddressStep={setAddAddressStep}
          />
        );
      case 'import':
        return (
          <ImportAddressForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
            setAddAddressStep={setAddAddressStep}
          />
        );
    }
  };

  return (
    <div className="bg-background text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[400px] h-[400px]">
      <Header />
      <ScrollArea className="flex-grow">
        {selectedKeystore ? (
          <KeystoreView
            selectedKeystore={selectedKeystore}
            isAddingAddress={isAddingAddress}
            handleBackClick={handleBackClick}
            renderAddAddressContent={renderAddAddressContent}
            handleViewPrivateKey={handleViewPrivateKey}
          />
        ) : (
          <KeystoreList
            keystores={keystores}
            handleKeystoreClick={handleKeystoreClick}
            isAddingKeystore={isAddingKeystore}
            newKeystoreName={newKeystoreName}
            setNewKeystoreName={setNewKeystoreName}
            handleAddKeystore={handleAddKeystore}
            setIsAddingKeystore={setIsAddingKeystore}
          />
        )}
      </ScrollArea>
      <Footer
        selectedKeystore={selectedKeystore}
        setIsAddingAddress={setIsAddingAddress}
        setIsAddingKeystore={setIsAddingKeystore}
      />
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        password={password}
        setPassword={setPassword}
        handlePasswordSubmit={handlePasswordSubmit}
      />
      <PrivateKeyDialog
        selectedAddress={selectedAddressForPrivateKey}
        setSelectedAddress={setSelectedAddressForPrivateKey}
      />
    </div>
  );
}
