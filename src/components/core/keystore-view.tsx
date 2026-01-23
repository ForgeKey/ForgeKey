import { ArrowLeft } from 'lucide-react';
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
}

export const KeystoreView: React.FC<KeystoreViewProps> = ({
  selectedKeystore,
  isAddingAddress,
  handleBackClick,
  renderAddAddressContent,
  handleViewPrivateKey,
  handleDeleteAddress,
}) => {
  const showAddAddressComponent =
    isAddingAddress || selectedKeystore.addresses.length === 0;

  return (
    <div className="flex flex-col h-full">
      {/* Back button and workspace title */}
      {!showAddAddressComponent && (
        <>
          <div className="flex items-center mb-2 px-3 pt-2">
            <Button
              variant="ghost"
              onClick={handleBackClick}
              className="h-8 w-8 p-0 text-white bg-transparent hover:bg-white/10 rounded-full transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </div>
          <h1 className="text-base font-bold text-white mb-2 px-3">
            {selectedKeystore.name}
          </h1>
        </>
      )}


      <div className="flex-1">
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
