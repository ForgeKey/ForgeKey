import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';
import { Folder, ChevronRight } from 'lucide-react';

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
        <div className="text-center space-y-4 py-8 bg-white/5 backdrop-blur-sm rounded-lg p-6 border border-white/5">
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
            <Folder className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Welcome to ForgeKey</h3>
          <p className="text-sm text-gray-300 max-w-md mx-auto">
            A keystore is a secure container for managing wallet addresses.
            Create your first keystore group to start organizing your addresses.
          </p>
        </div>
      )}
      {!isAddingGroup && keystores.length > 0 && (
        <div>
          <div className="space-y-2.5">
            {keystores.map((keystore, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-lg border border-white/5 overflow-hidden hover:border-white/10 transition-colors"
              >
                <Button
                  variant="ghost"
                  className="w-full h-auto justify-between text-left font-normal py-3 px-4 hover:bg-white/10 transition-colors"
                  onClick={() => handleKeystoreClick(keystore)}
                >
                  <div className="flex items-center">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-2.5 rounded-full mr-3 flex-shrink-0">
                      <Folder className="h-5 w-5 text-purple-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white truncate">
                        {keystore.name}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {keystore.addresses.length}{' '}
                        {keystore.addresses.length === 1
                          ? 'address'
                          : 'addresses'}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 ml-2 flex-shrink-0" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
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
