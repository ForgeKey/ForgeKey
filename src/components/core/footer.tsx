import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';

interface FooterProps {
  isAddingAddress: boolean;
  isAddingGroup: boolean;
  selectedKeystore: Keystore | null;
  setIsAddingAddress: (isAddingAddress: boolean) => void;
  setIsAddingGroup: (isAddingGroup: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAddingAddress,
  isAddingGroup,
  selectedKeystore,
  setIsAddingAddress,
  setIsAddingGroup,
}) => {
  return (
    <div className="p-4 dark:border-zinc-800">
      {!!selectedKeystore &&
        !isAddingAddress &&
        selectedKeystore.addresses.length > 0 && (
          <Button
            className="w-full text-sm dark:text-secondary dark:bg-zinc-800 dark:hover:bg-zinc-700"
            onClick={() => setIsAddingAddress(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Address
          </Button>
        )}
      {!selectedKeystore && !isAddingGroup && (
        <Button
          className="w-full text-sm dark:text-secondary dark:bg-zinc-800 dark:hover:bg-zinc-700"
          onClick={() => setIsAddingGroup(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      )}
    </div>
  );
};
