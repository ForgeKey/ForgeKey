import { ScrollArea } from '@/components/ui/scroll-area';

import { Header } from '@/components/core/header';
import { Footer } from '@/components/core/footer';
import { Settings } from '@/components/core/settings';
import { KeystoreList } from '@/components/core/keystore-list';
import { KeystoreView } from '@/components/core/keystore-view';
import { PasswordDialog } from '@/components/core/password-dialog';
import { NewAddressForm } from '@/components/core/address/new-address-form';
import { SelectAddressType } from '@/components/core/address/select-address-type';
import { VanityAddressForm } from '@/components/core/address/vanity-address-form';
import { ImportAddressForm } from '@/components/core/address/import-address-form';

import { useWalletState } from '@/hooks/use-wallet-state';
import { useWalletHandlers } from '@/hooks/use-wallet-handlers';

export default function CastWallet() {
  const { states, setters, actions } = useWalletState();
  const handlers = useWalletHandlers(states, setters, actions);

  const renderAddAddressContent = () => {
    switch (states.addAddressStep) {
      case 'select':
        return (
          <SelectAddressType setAddAddressStep={setters.setAddAddressStep} />
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
    }
  };

  const renderRoute = () => {
    // Settings Route
    if (states.isSettingsOpen) {
      return (
        <Settings
          setIsSettingsOpen={setters.setIsSettingsOpen}
          keystoreFolder={states.keystoreFolder}
          setKeystoreFolder={setters.setKeystoreFolder}
        />
      );
    }

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

  return (
    <main className="bg-background dark:bg-zinc-900 text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[450px] h-[450px]">
      <Header
        setIsSettingsOpen={setters.setIsSettingsOpen}
        isSettingsOpen={states.isSettingsOpen}
      />
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
    </main>
  );
}
