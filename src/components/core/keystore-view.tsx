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

    return '';
  };

  return (
    <div className="p-4">
      {/* Only show header when viewing keystore or NOT at selection/creation screens */}
      {(!showAddAddressComponent ||
        (addAddressStep !== 'select' &&
          addAddressStep !== 'new' &&
          addAddressStep !== 'vanity' &&
          addAddressStep !== 'import' &&
          addAddressStep !== 'select-keystore' &&
          addAddressStep !== 'import-keystore' &&
          showAddAddressComponent)) && (
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={handleBackClick}
            className="p-2 text-white bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <span className="text-md ml-3 text-white font-medium flex items-center">
            {getTitle()}
          </span>
        </div>
      )}
      <div>
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
    </div>
  );
};
