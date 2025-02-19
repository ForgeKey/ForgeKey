import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';

import { GroupForm } from './group-form';

interface KeystoreListProps {
  keystores: Keystore[];
  handleKeystoreClick: (keystore: Keystore) => void;
  isAddingGroup: boolean;
  newGroupName: string;
  setNewGroupName: (newGroupName: string) => void;
  handleAddGroup: () => void;
  handleBackClick: () => void;
}

export const KeystoreList = ({
  keystores,
  handleKeystoreClick,
  isAddingGroup,
  newGroupName,
  setNewGroupName,
  handleAddGroup,
  handleBackClick,
}: KeystoreListProps) => {
  return (
    <div className="p-4">
      {!isAddingGroup && keystores.length === 0 && (
        <div className="text-center space-y-3 py-8">
          <h3 className="text-lg font-semibold text-yellow-600 dark:text-yellow-500">
            Welcome to ForgeKey.
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            A keystore is a secure container for managing wallet addresses.
            Create your first keystore group to start organizing your addresses.
          </p>
        </div>
      )}
      {!isAddingGroup &&
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
      {isAddingGroup && (
        <GroupForm
          newGroupName={newGroupName}
          setNewGroupName={setNewGroupName}
          handleAddGroup={handleAddGroup}
          handleBackClick={handleBackClick}
        />
      )}
    </div>
  );
};
