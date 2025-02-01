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
import { useWalletState } from '@/hooks/useWalletState';
import { useWalletHandlers } from '@/hooks/useWalletHandlers';

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

  return (
    <div className="bg-background dark:bg-zinc-900 text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[400px] h-[400px]">
      <Header
        setIsSettingsOpen={setters.setIsSettingsOpen}
        isSettingsOpen={states.isSettingsOpen}
      />
      <ScrollArea className="flex-grow">
        {states.isSettingsOpen ? (
          <Settings
            setIsSettingsOpen={setters.setIsSettingsOpen}
            keystoreFolder={states.keystoreFolder}
            setKeystoreFolder={setters.setKeystoreFolder}
          />
        ) : states.selectedKeystore ? (
          <KeystoreView
            selectedKeystore={states.selectedKeystore}
            isAddingAddress={states.isAddingAddress}
            handleBackClick={handlers.handleBackClick}
            renderAddAddressContent={renderAddAddressContent}
            handleViewPrivateKey={handlers.handleViewPrivateKey}
          />
        ) : (
          <KeystoreList
            keystores={states.keystores}
            handleKeystoreClick={handlers.handleKeystoreClick}
            isAddingKeystore={states.isAddingKeystore}
            newKeystoreName={states.newKeystoreName}
            setNewKeystoreName={setters.setNewKeystoreName}
            handleAddKeystore={handlers.handleAddKeystore}
            setIsAddingKeystore={setters.setIsAddingKeystore}
            handleBackClick={handlers.handleBackClick}
          />
        )}
      </ScrollArea>
      <Footer
        isAddingAddress={states.isAddingAddress}
        isAddingKeystore={states.isAddingKeystore}
        selectedKeystore={states.selectedKeystore}
        setIsAddingAddress={setters.setIsAddingAddress}
        setIsAddingKeystore={setters.setIsAddingKeystore}
      />
      <PasswordDialog
        isOpen={states.isPasswordDialogOpen}
        setIsOpen={setters.setIsPasswordDialogOpen}
        password={states.password}
        setPassword={setters.setPassword}
        handlePasswordSubmit={handlers.handlePasswordSubmit}
      />
      <PrivateKeyDialog
        selectedAddress={states.selectedAddressForPrivateKey}
        setSelectedAddress={setters.setSelectedAddressForPrivateKey}
      />
    </div>
  );
}
