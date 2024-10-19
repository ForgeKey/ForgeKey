import { Copy, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

import { copyToClipboard } from '@/utils/copy-to-clipboard';

interface AddressListProps {
  addresses: any[];
  handleViewPrivateKey: (address: any) => void;
}

export const AddressList: React.FC<AddressListProps> = ({
  addresses,
  handleViewPrivateKey,
}) => {
  return (
    <>
      {addresses.map((address, index) => (
        <div key={index} className="mb-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-medium text-sm">{address.label}</div>
              <div className="text-xs text-muted-foreground">
                {address.address}
              </div>
            </div>
            <div className="flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(address.address)}
              >
                <Copy className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleViewPrivateKey(address)}
              >
                <Eye className="h-4 w-4" />
              </Button>
            </div>
          </div>
          {index < addresses.length - 1 && <Separator className="my-2" />}
        </div>
      ))}
    </>
  );
};
