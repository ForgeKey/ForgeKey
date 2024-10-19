import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FooterProps {
  selectedKeystore: boolean;
  setIsAddingAddress: (isAddingAddress: boolean) => void;
  setIsAddingKeystore: (isAddingKeystore: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({
  selectedKeystore,
  setIsAddingAddress,
  setIsAddingKeystore,
}) => {
  return (
    <div className="p-4 border-t">
      {selectedKeystore ? (
        <Button
          className="w-full text-sm"
          onClick={() => setIsAddingAddress(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Address
        </Button>
      ) : (
        <Button
          className="w-full text-sm"
          onClick={() => setIsAddingKeystore(true)}
        >
          <Plus className="mr-2 h-4 w-4" />
          New Group
        </Button>
      )}
    </div>
  );
};
