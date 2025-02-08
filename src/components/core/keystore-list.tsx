import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';

import { KeystoreForm } from './keystore-form';

interface KeystoreListProps {
  keystores: Keystore[];
  handleKeystoreClick: (keystore: Keystore) => void;
  isAddingKeystore: boolean;
  newKeystoreName: string;
  setNewKeystoreName: (newKeystoreName: string) => void;
  handleAddKeystore: () => void;
  setIsAddingKeystore: (isAddingKeystore: boolean) => void;
  handleBackClick: () => void;
}

export const KeystoreList = ({
  keystores,
  handleKeystoreClick,
  isAddingKeystore,
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  handleBackClick,
}: KeystoreListProps) => {
  return (
    <div className="p-4">
      {!isAddingKeystore && keystores.length === 0 && (
        <div className="text-center space-y-3 py-8">
          <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-500">
            Welcome to Cast Wallet UI.
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            A keystore is a secure container for managing wallet addresses.
            Create your first keystore group to start organizing your addresses.
          </p>
        </div>
      )}
      {!isAddingKeystore &&
        keystores.length > 0 &&
        keystores.map((keystore, index) => (
          <div key={index} className="mb-2 last:mb-0">
            <Button
              variant="ghost"
              className="w-full justify-between text-left font-normal dark:text-zinc-50"
              onClick={() => handleKeystoreClick(keystore)}
            >
              <span className="text-sm">{keystore.name}</span>
              <span className="text-xs text-muted-foreground">
                {keystore.addresses.length} addresses
              </span>
            </Button>
            {index < keystores.length - 1 && <Separator className="my-2" />}
          </div>
        ))}
      {isAddingKeystore && (
        <KeystoreForm
          newKeystoreName={newKeystoreName}
          setNewKeystoreName={setNewKeystoreName}
          handleAddKeystore={handleAddKeystore}
          handleBackClick={handleBackClick}
        />
      )}
    </div>
  );
};
