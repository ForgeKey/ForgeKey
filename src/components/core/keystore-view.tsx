import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressList } from './address-list';
import { Address, Keystore } from '@/types/address';

interface KeystoreViewProps {
  selectedKeystore: Keystore;
  isAddingAddress: boolean;
  handleBackClick: () => void;
  renderAddAddressContent: () => React.ReactNode;
  handleViewPrivateKey: (address: Address) => void;
}

export const KeystoreView: React.FC<KeystoreViewProps> = ({
  selectedKeystore,
  isAddingAddress,
  handleBackClick,
  renderAddAddressContent,
  handleViewPrivateKey,
}) => {
  const showAddAddressComponent =
    isAddingAddress || selectedKeystore.addresses.length === 0;

  return (
    <div className="p-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="p-2 dark:text-secondary"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
        </Button>
        <span className="text-md ml-1 dark:text-secondary flex items-center">
          {showAddAddressComponent ? 'Add New Address' : selectedKeystore.name}
        </span>
      </div>
      {showAddAddressComponent ? (
        renderAddAddressContent()
      ) : (
        <AddressList
          addresses={selectedKeystore.addresses}
          handleViewPrivateKey={handleViewPrivateKey}
        />
      )}
    </div>
  );
};
