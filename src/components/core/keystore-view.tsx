import { BackButton } from '@/components/ui/back-button';
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

  if (showAddAddressComponent) {
    return <>{renderAddAddressContent()}</>;
  }

  return (
    <div className="flex flex-col h-full p-3">
      {/* Back button and workspace title */}
      <div className="flex items-center mb-1">
        <BackButton onClick={handleBackClick} />
      </div>
      <h1 className="text-base font-bold text-white mb-2">
        {selectedKeystore.name}
      </h1>

      <div className="flex-1">
        <AddressList
          addresses={selectedKeystore.addresses}
          handleViewPrivateKey={handleViewPrivateKey}
          handleDeleteAddress={handleDeleteAddress}
        />
      </div>
    </div>
  );
};
