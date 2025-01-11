import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  isAddingAddress: boolean;
  isAddingKeystore: boolean;
  selectedKeystore: boolean;
  setIsAddingAddress: (isAddingAddress: boolean) => void;
  setIsAddingKeystore: (isAddingKeystore: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAddingAddress,
  isAddingKeystore,
  selectedKeystore,
  setIsAddingAddress,
  setIsAddingKeystore,
}) => {
  return (
    <div className="p-4 dark:border-zinc-800">
      {selectedKeystore && !isAddingAddress && (
        <Button
          className="w-full text-sm dark:text-secondary dark:bg-zinc-800 dark:hover:bg-zinc-700"
          onClick={() => setIsAddingAddress(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      )}
      {!selectedKeystore && !isAddingKeystore && (
        <Button
          className="w-full text-sm dark:text-secondary dark:bg-zinc-800 dark:hover:bg-zinc-700"
          onClick={() => setIsAddingKeystore(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      )}
    </div>
  );
};
