import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';

interface FooterProps {
  isAddingAddress: boolean;
  isAddingGroup: boolean;
  selectedKeystore: Keystore | null;
  setIsAddingAddress: (isAddingAddress: boolean) => void;
  setIsAddingGroup: (isAddingGroup: boolean) => void;
  setAddAddressStep?: (
    step:
      | 'select'
      | 'new'
      | 'vanity'
      | 'import'
      | 'select-keystore'
      | 'import-keystore'
  ) => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAddingAddress,
  isAddingGroup,
  selectedKeystore,
  setIsAddingAddress,
  setIsAddingGroup,
  setAddAddressStep,
}) => {
  const handleAddAddressClick = () => {
    setIsAddingAddress(true);
    if (setAddAddressStep) {
      setAddAddressStep('select');
    }
  };

  return (
    <div className="p-4 relative h-16 flex items-center justify-center">
      {!!selectedKeystore &&
        !isAddingAddress &&
        selectedKeystore.addresses.length > 0 && (
          <div className="absolute bottom-6 right-6">
            <Button
              onClick={handleAddAddressClick}
              className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 p-0 flex items-center justify-center text-white hover:shadow-xl transition-shadow"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        )}
      {!selectedKeystore && !isAddingGroup && (
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={() => setIsAddingGroup(true)}
            className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 p-0 flex items-center justify-center text-white hover:shadow-xl transition-shadow"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
