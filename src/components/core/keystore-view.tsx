import { AddressList } from './address-list';
import { AnimatedPage } from '@/components/layout/animated-page';
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
    <AnimatedPage
      title={selectedKeystore.name}
      onBack={handleBackClick}
    >
      <AddressList
        addresses={selectedKeystore.addresses}
        handleViewPrivateKey={handleViewPrivateKey}
        handleDeleteAddress={handleDeleteAddress}
      />
    </AnimatedPage>
  );
};
