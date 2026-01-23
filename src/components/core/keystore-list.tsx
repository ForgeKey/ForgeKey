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
    <div className="p-3 flex flex-col">
      {!isAddingGroup && (
        <div className="flex flex-col flex-1">
          {/* Header Section */}
          <div className="text-center mb-4">
            <h2 className="text-base font-semibold text-white mb-1">
              Your Keystore Workspace
            </h2>
            <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
              Create a Workspace to organize your keystores for each project or environment.
            </p>
          </div>

          {/* Keystore List */}
          {keystores.length > 0 && (
            <div className="space-y-2 flex-1">
              {keystores.map((keystore, index) => (
                <div
                  key={index}
                  className="bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] overflow-hidden hover:bg-white/[0.05] transition-all"
                >
                  <Button
                    variant="ghost"
                    className="w-full h-auto justify-between text-left font-normal py-2 px-3 hover:bg-transparent transition-colors rounded-lg"
                    onClick={() => handleKeystoreClick(keystore)}
                  >
                    <div className="flex items-center gap-2">
                      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-1.5 rounded-full flex-shrink-0">
                        <Folder className="h-4 w-4 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white truncate">
                          {keystore.name}
                        </p>
                        <p className="text-[10px] text-white/50">
                          {keystore.addresses.length}{' '}
                          {keystore.addresses.length === 1
                            ? 'address'
                            : 'addresses'}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/40 ml-2 flex-shrink-0" />
                  </Button>
                </div>
              ))}
            </div>
          )}
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
