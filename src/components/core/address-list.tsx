import { Check, Copy, KeyRound, Trash2 } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
      {addresses.map((address, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-center">
            <div className="flex-1 min-w-0 mr-2">
              <div className="text-sm dark:text-secondary">{address.label}</div>
              <div className="text-xs text-muted-foreground tracking-wide">
                <span className="font-bold">{address.address}</span>
              </div>
            </div>
            <div className="flex space-x-1 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleCopy(address.address)}
              >
                {copiedAddress === address.address ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4 dark:text-secondary" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleViewPrivateKey(address)}
              >
                <KeyRound className="h-4 w-4 dark:text-secondary" />
              </Button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => handleDeleteClick(address)}
              >
                <Trash2 className="h-4 w-4 dark:text-secondary" />
              </Button>
            </div>
          </div>
          {index < addresses.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
      <DeleteAddressDialog
        isOpen={isDeleteDialogOpen}
        setIsOpen={setIsDeleteDialogOpen}
        addressToDelete={addressToDelete}
        onConfirmDelete={handleDeleteAddress}
      />
    </>
  );
};
