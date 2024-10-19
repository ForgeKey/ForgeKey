import { Button } from '@/components/ui/button';
import { ChevronLeft } from 'lucide-react';

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
  renderAddAddressContent: any;
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
      <Button variant="ghost" onClick={handleBackClick} className="mb-4 pl-0">
        <ChevronLeft className="h-5 w-5 mr-1" />
        <span className="text-sm">
          {isAddingAddress ? 'Add New Address' : selectedKeystore.name}
        </span>
      </Button>
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
