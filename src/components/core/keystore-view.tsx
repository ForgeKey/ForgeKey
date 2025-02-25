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
  handleDeleteAddress: (address: Address) => void;
  addAddressStep?: string;
}

export const KeystoreView: React.FC<KeystoreViewProps> = ({
  selectedKeystore,
  isAddingAddress,
  handleBackClick,
  renderAddAddressContent,
  handleViewPrivateKey,
  handleDeleteAddress,
  addAddressStep,
}) => {
  const showAddAddressComponent =
    isAddingAddress || selectedKeystore.addresses.length === 0;

  const getTitle = () => {
    if (!showAddAddressComponent) {
      return selectedKeystore.name;
    }

    if (
      addAddressStep === 'select-keystore' ||
      addAddressStep === 'import-keystore'
    ) {
      return 'Select Keystore';
    }

    return 'Add New Address';
  };

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
          {getTitle()}
        </span>
      </div>
      {showAddAddressComponent ? (
        renderAddAddressContent()
      ) : (
        <AddressList
          addresses={selectedKeystore.addresses}
          handleViewPrivateKey={handleViewPrivateKey}
          handleDeleteAddress={handleDeleteAddress}
        />
      )}
    </div>
  );
};
