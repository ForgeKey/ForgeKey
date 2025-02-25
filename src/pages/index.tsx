import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

import { Header } from '@/components/core/header';
import { Footer } from '@/components/core/footer';
import { KeystoreList } from '@/components/core/keystore-list';
import { KeystoreView } from '@/components/core/keystore-view';
import { PasswordDialog } from '@/components/core/password-dialog';
import { NewAddressForm } from '@/components/core/address/new-address-form';
import { SelectAddressType } from '@/components/core/address/select-address-type';
import { VanityAddressForm } from '@/components/core/address/vanity-address-form';
import { ImportAddressForm } from '@/components/core/address/import-address-form';
import { ImportOptionsDialog } from '@/components/core/address/import-options-dialog';
import { KeystoreSelect } from '@/components/core/address/keystore-select';
import { ImportKeystoreForm } from '@/components/core/address/import-keystore-form';

import { useWalletState } from '@/hooks/use-wallet-state';
import { useWalletHandlers } from '@/hooks/use-wallet-handlers';

export default function CastWallet() {
  const { states, setters, actions } = useWalletState();
  const handlers = useWalletHandlers(states, setters, actions);
  const [isImportOptionsOpen, setIsImportOptionsOpen] = useState(false);

  const handleImportClick = () => {
    setIsImportOptionsOpen(true);
  };

  const handleImportPrivateKey = () => {
    setIsImportOptionsOpen(false);
    setters.setAddAddressStep('import');
  };

  const handleShowKeystoreSelect = () => {
    setIsImportOptionsOpen(false);
    setters.setAddAddressStep('select-keystore');
  };

  const handleKeystoreSelect = (keystoreName: string) => {
    setters.setIsAddingAddress(true);
    setters.setAddAddressStep('import-keystore');

    // Pre-fill the label with the keystore name
    setters.setNewAddress({
      ...states.newAddress,
      label: keystoreName,
    });
  };

  const renderAddAddressContent = () => {
    switch (states.addAddressStep) {
      case 'select':
        return (
          <SelectAddressType
            setAddAddressStep={setters.setAddAddressStep}
            onImportClick={handleImportClick}
          />
        );
      case 'new':
        return (
          <NewAddressForm
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handlers.handleAddAddress}
          />
        );
      case 'vanity':
        return (
          <VanityAddressForm
            vanityOptions={states.vanityOptions}
            setVanityOptions={setters.setVanityOptions}
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handlers.handleAddAddress}
          />
        );
      case 'import':
        return (
          <ImportAddressForm
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handlers.handleAddAddress}
          />
        );
      case 'select-keystore':
        return (
          <KeystoreSelect
            onKeystoreSelect={handleKeystoreSelect}
            existingAddresses={getAllAddressLabels()}
          />
        );
      case 'import-keystore':
        return (
          <ImportKeystoreForm
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handlers.handleImportKeystoreAddress}
          />
        );
    }
  };

  const renderRoute = () => {
    // Keystore View Route
    if (states.selectedKeystore) {
      return (
        <KeystoreView
          selectedKeystore={states.selectedKeystore}
          isAddingAddress={states.isAddingAddress}
          handleBackClick={handlers.handleBackClick}
          renderAddAddressContent={renderAddAddressContent}
          handleViewPrivateKey={handlers.handleViewPrivateKey}
          handleDeleteAddress={handlers.handleDeleteAddress}
          addAddressStep={states.addAddressStep}
        />
      );
    }

    // Default Route (Keystore List)
    return (
      <KeystoreList
        keystores={states.keystores}
        handleKeystoreClick={handlers.handleKeystoreClick}
        isAddingGroup={states.isAddingGroup}
        newGroupName={states.newGroupName}
        setNewGroupName={setters.setNewGroupName}
        handleAddGroup={handlers.handleAddGroup}
        handleBackClick={handlers.handleBackClick}
      />
    );
  };

  // Get all existing address labels for filtering
  const getAllAddressLabels = () => {
    const labels: string[] = [];
    states.keystores.forEach((keystore) => {
      keystore.addresses.forEach((address) => {
        labels.push(address.label);
      });
    });
    return labels;
  };

  return (
    <main className="bg-background dark:bg-zinc-900 text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[450px] h-[450px]">
      <Header />
      <ScrollArea className="flex-grow">{renderRoute()}</ScrollArea>
      <Footer
        isAddingAddress={states.isAddingAddress}
        isAddingGroup={states.isAddingGroup}
        selectedKeystore={states.selectedKeystore}
        setIsAddingAddress={setters.setIsAddingAddress}
        setIsAddingGroup={setters.setIsAddingGroup}
      />
      <PasswordDialog
        isOpen={states.isPasswordDialogOpen}
        setIsOpen={setters.setIsPasswordDialogOpen}
        handlePasswordSubmit={handlers.handlePasswordSubmit}
        privateKey={states.privateKey}
        privateKeyError={states.privateKeyError}
        password={states.password}
        setPassword={setters.setPassword}
      />
      <ImportOptionsDialog
        isOpen={isImportOptionsOpen}
        setIsOpen={setIsImportOptionsOpen}
        onImportPrivateKey={handleImportPrivateKey}
        onImportKeystore={handleShowKeystoreSelect}
      />
    </main>
  );
}
