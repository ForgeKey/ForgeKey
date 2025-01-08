import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { copyToClipboard } from '@/utils/copy-to-clipboard';

type Address = {
  label: string;
  address: string;
  privateKey: string;
};

interface PrivateKeyDialogProps {
  selectedAddress: Address | null;
  setSelectedAddress: React.Dispatch<React.SetStateAction<Address | null>>;
}

export function PrivateKeyDialog({
  selectedAddress,
  setSelectedAddress,
}: PrivateKeyDialogProps) {
  return (
    selectedAddress && (
      <Dialog open={true} onOpenChange={() => setSelectedAddress(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Private Key</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-mono break-all">
                {selectedAddress.privateKey}
              </p>
              <Button
                size="icon"
                onClick={() => copyToClipboard(selectedAddress.privateKey)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  );
}
