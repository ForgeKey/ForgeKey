import { Check, Copy, KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Address } from '@/types/address';

import { copyToClipboard } from '@/utils/copy-to-clipboard';
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
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Address | null>(null);

  const handleCopy = (address: string) => {
    copyToClipboard(address);
    setCopiedAddress(address);

    setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };

  const handleDeleteClick = (address: Address) => {
    setAddressToDelete(address);
    setIsDeleteDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4 py-2">
        {addresses.map((address, index) => (
          <div
            key={index}
            className="p-3 rounded-lg bg-white/5 backdrop-blur-sm"
          >
            <div className="flex justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <div className="text-sm font-bold text-white mb-1">
                  {address.label}
                </div>
                <div className="text-xs text-gray-400 tracking-wide font-mono break-all">
                  {address.address}
                </div>
              </div>
              <div className="flex space-x-2 flex-shrink-0 self-center">
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleCopy(address.address)}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors p-1.5"
                >
                  {copiedAddress === address.address ? (
                    <Check className="h-3.5 w-3.5 text-green-400" />
                  ) : (
                    <Copy className="h-3.5 w-3.5 text-white" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleViewPrivateKey(address)}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors p-1.5"
                >
                  <KeyRound className="h-3.5 w-3.5 text-white" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  onClick={() => handleDeleteClick(address)}
                  className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors p-1.5"
                >
                  <Trash2 className="h-3.5 w-3.5 text-white" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <DeleteAddressDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        addressToDelete={addressToDelete}
        onConfirmDelete={handleDeleteAddress}
      />
    </>
  );
};
