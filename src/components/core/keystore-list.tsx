import { motion } from 'motion/react';
import { Button } from '@/components/ui/button';
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list';
import { AnimatedPage } from '@/components/layout/animated-page';
import { Keystore } from '@/types/address';
import { Folder, ChevronRight } from 'lucide-react';
import { cardVariants } from '@/lib/animations';
import { LIST_ITEM_GAP } from '@/lib/constants';

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
  if (isAddingGroup) {
    return (
      <GroupForm
        newGroupName={newGroupName}
        setNewGroupName={setNewGroupName}
        handleAddGroup={handleAddGroup}
        handleBackClick={handleBackClick}
      />
    );
  }

  return (
    <AnimatedPage>
      <div className="flex flex-col flex-1">
        <div className="text-center mb-3">
          <h2 className="text-base font-semibold text-white mb-1">
            Your Keystore Workspace
          </h2>
          <p className="text-xs text-white/50 max-w-xs mx-auto leading-relaxed">
            Create a Workspace to organize your keystores for each project or environment.
          </p>
        </div>

        {keystores.length > 0 && (
          <AnimatedList className={`${LIST_ITEM_GAP} flex-1`}>
            {keystores.map((keystore, index) => (
              <AnimatedListItem key={index}>
                <motion.div
                  variants={cardVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="bg-white/[0.03] backdrop-blur-sm rounded-lg border border-white/[0.08] overflow-hidden"
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
                </motion.div>
              </AnimatedListItem>
            ))}
          </AnimatedList>
        )}
      </div>
    </AnimatedPage>
  );
};
