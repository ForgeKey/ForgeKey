import { useState } from 'react';
import { KeyRound, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { CopyButton } from '@/components/ui/copy-button';
import { AnimatedList, AnimatedListItem } from '@/components/ui/animated-list';
import { Address } from '@/types/address';
import { DeleteAddressDialog } from './delete-address-dialog';

interface AddressListProps {
  addresses: Address[];
  handleViewPrivateKey: (address: Address) => void;
  handleDeleteAddress: (address: Address) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  handleViewPrivateKey,
  handleDeleteAddress,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const handleDeleteClick = (address: Address) => {
    setAddressToDelete(address);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <AnimatedList className="space-y-2 px-3">
        {addresses.map((address, index) => (
          <AnimatedListItem key={index}>
            <div className="flex items-center justify-between py-2 border-b border-white/10">
              <div className="flex-1 min-w-0 mr-3">
                <div className="text-sm font-semibold text-white mb-0.5">
                  {address.label}
                </div>
                <div className="text-xs text-white/70 font-mono break-all">
                  <span className="font-bold text-white">{address.address.slice(0, 6)}</span>
                  {address.address.slice(6, -5)}
                  <span className="font-bold text-white">{address.address.slice(-5)}</span>
                </div>
              </div>
              <div className="flex space-x-1.5 flex-shrink-0">
                <CopyButton value={address.address} />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleViewPrivateKey(address)}
                  className="rounded-md bg-transparent hover:bg-white/5 transition-all p-1.5 h-8 w-8"
                >
                  <KeyRound className="h-4 w-4 text-white/70" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDeleteClick(address)}
                  className="rounded-md bg-transparent hover:bg-white/5 transition-all p-1.5 h-8 w-8"
                >
                  <Trash2 className="h-4 w-4 text-white/70" />
                </Button>
              </div>
            </div>
          </AnimatedListItem>
        ))}
      </AnimatedList>
      <DeleteAddressDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        addressToDelete={addressToDelete}
        onConfirmDelete={handleDeleteAddress}
      />
    </>
  );
};
