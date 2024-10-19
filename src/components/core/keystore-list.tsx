import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';

import { KeystoreForm } from './keystore-form';

type Address = {
  label: string;
  address: string;
  privateKey: string;
};

type Keystore = {
  name: string;
  addresses: Address[];
};

interface KeystoreListProps {
  keystores: Keystore[];
  handleKeystoreClick: (keystore: Keystore) => void;
  isAddingKeystore: boolean;
  newKeystoreName: string;
  setNewKeystoreName: (newKeystoreName: string) => void;
  handleAddKeystore: () => void;
  setIsAddingKeystore: (isAddingKeystore: boolean) => void;
}

export const KeystoreList = ({
  keystores,
  handleKeystoreClick,
  isAddingKeystore,
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  setIsAddingKeystore,
}: KeystoreListProps) => {
  return (
    <div className="p-4">
      {keystores.map((keystore, index) => (
        <div key={index} className="mb-4 last:mb-0">
          <Button
            variant="ghost"
            className="w-full justify-between text-left font-normal"
            onClick={() => handleKeystoreClick(keystore)}
          >
            <span className="text-sm">{keystore.name}</span>
            <span className="text-xs text-muted-foreground">
              {keystore.addresses.length} addresses
            </span>
          </Button>
          <Separator className="my-2" />
        </div>
      ))}
      {isAddingKeystore && (
        <KeystoreForm
          newKeystoreName={newKeystoreName}
          setNewKeystoreName={setNewKeystoreName}
          handleAddKeystore={handleAddKeystore}
          setIsAddingKeystore={setIsAddingKeystore}
        />
      )}
    </div>
  );
};
