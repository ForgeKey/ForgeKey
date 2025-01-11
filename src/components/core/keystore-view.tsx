import { ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddressList } from './address-list';

type Address = {
  label: string;
  address: string;
  privateKey: string;
};

type Keystore = {
  name: string;
  addresses: Address[];
};

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
          {isAddingAddress ? 'Add New Address' : selectedKeystore.name}
        </span>
      </div>
      {isAddingAddress ? (
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
