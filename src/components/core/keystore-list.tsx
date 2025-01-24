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
      {!isAddingKeystore &&
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
