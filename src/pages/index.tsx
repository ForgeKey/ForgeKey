import { useState } from 'react';
import { invoke } from '@tauri-apps/api/core';

import { useKeystore } from '@/contexts/keystore-context';

import { ScrollArea } from '@/components/ui/scroll-area';

import { Header } from '@/components/core/header';
import { Footer } from '@/components/core/footer';
import { Settings } from '@/components/core/settings';
import { KeystoreList } from '@/components/core/keystore-list';
import { KeystoreView } from '@/components/core/keystore-view';
import { PasswordDialog } from '@/components/core/password-dialog';
import { PrivateKeyDialog } from '@/components/core/private-key-dialog';
import { NewAddressForm } from '@/components/core/address/new-address-form';
import { SelectAddressType } from '@/components/core/address/select-address-type';
import { VanityAddressForm } from '@/components/core/address/vanity-address-form';
import { ImportAddressForm } from '@/components/core/address/import-address-form';

type Keypair = {
  address: string;
  privateKey: string;
  password?: string;
};

type Address = Keypair & {
  label: string;
};

type Keystore = {
  name: string;
  addresses: Address[];
};

type VanityOpts = {
  starts_with?: string;
  ends_with?: string;
};

export default function CastWallet() {
  const { keystores, addKeystore, addAddress } = useKeystore();

  const [keystoreFolder, setKeystoreFolder] = useState('');

  const [selectedKeystore, setSelectedKeystore] = useState<Keystore | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressStep, setAddAddressStep] = useState<
    'select' | 'new' | 'vanity' | 'import'
  >('select');
  const [newAddress, setNewAddress] = useState<Address>({
    label: '',
    address: '',
    privateKey: '',
    password: '',
  });
  const [vanityOptions, setVanityOptions] = useState({
    startsWith: '',
    endsWith: '',
  });
  const [isAddingKeystore, setIsAddingKeystore] = useState(false);
  const [newKeystoreName, setNewKeystoreName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedAddressForPrivateKey, setSelectedAddressForPrivateKey] =
    useState<Address | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

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
    } else if (isAddingKeystore) {
      setIsAddingKeystore(false);
      setNewKeystoreName('');
    } else {
      setSelectedKeystore(null);
    }
  };

  const handleAddAddress = async () => {
    if (selectedKeystore && newAddress.label) {
      let address: Address;
      switch (addAddressStep) {
        case 'new':
          const newKeypair: Keypair = await invoke('create_new_address');

          address = {
            label: newAddress.label,
            address: newKeypair.address,
            privateKey: newKeypair.privateKey,
          };
          break;
        case 'vanity':
          const vanityOpts: VanityOpts = {};

          if (vanityOptions.startsWith) {
            vanityOpts.starts_with = vanityOptions.startsWith;
          }

          if (vanityOptions.endsWith) {
            vanityOpts.ends_with = vanityOptions.endsWith;
          }

          const vanityKeypair: Keypair = await invoke(
            'create_vanity_address',
            vanityOpts
          );

          address = {
            label: newAddress.label,
            address: vanityKeypair.address,
            privateKey: vanityKeypair.privateKey,
          };

          break;
        case 'import':
          const returnedAddress: string = await invoke('import_private_key', {
            private_key: newAddress.privateKey,
            address_label: newAddress.label,
            password: newAddress.password,
          });

          address = {
            label: newAddress.label,
            address: returnedAddress,
            privateKey: newAddress.privateKey,
          };
          break;

        default:
          return;
      }

      addAddress(selectedKeystore.name, address);
      setNewAddress({ label: '', address: '', privateKey: '', password: '' });
      setVanityOptions({ startsWith: '', endsWith: '' });
      setIsAddingAddress(false);
      setAddAddressStep('select');
    }
  };

  const handleAddKeystore = () => {
    if (newKeystoreName) {
      addKeystore(newKeystoreName);
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
        return <SelectAddressType setAddAddressStep={setAddAddressStep} />;
      case 'new':
        return (
          <NewAddressForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
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
          />
        );
      case 'import':
        return (
          <ImportAddressForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
          />
        );
    }
  };

  return (
    <div className="bg-background dark:bg-zinc-900 text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[400px] h-[400px]">
      <Header
        setIsSettingsOpen={setIsSettingsOpen}
        isSettingsOpen={isSettingsOpen}
      />
      <ScrollArea className="flex-grow">
        {isSettingsOpen ? (
          <Settings
            setIsSettingsOpen={setIsSettingsOpen}
            keystoreFolder={keystoreFolder}
            setKeystoreFolder={setKeystoreFolder}
          />
        ) : selectedKeystore ? (
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
            handleBackClick={handleBackClick}
          />
        )}
      </ScrollArea>
      <Footer
        isAddingAddress={isAddingAddress}
        isAddingKeystore={isAddingKeystore}
        selectedKeystore={!!selectedKeystore}
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
