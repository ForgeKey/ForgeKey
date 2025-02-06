import { Check, Copy, KeyRound } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Address } from '@/types/address';

import { copyToClipboard } from '@/utils/copy-to-clipboard';

interface AddressListProps {
  addresses: Address[];
  handleViewPrivateKey: (address: Address) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  handleViewPrivateKey,
}) => {
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopy = (address: string) => {
    copyToClipboard(address);
    setCopiedAddress(address);

    setTimeout(() => {
      setCopiedAddress(null);
    }, 2000);
  };

  return (
    <>
      {addresses.map((address, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm dark:text-secondary">{address.label}</div>
              <div className="text-xs text-muted-foreground tracking-wide">
                <span className="font-bold">{address.address}</span>
              </div>
            </div>
            <div className="flex space-x-1">
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
            </div>
          </div>
          {index < addresses.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </>
  );
};
