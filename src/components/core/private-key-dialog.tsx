import { Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { copyToClipboard } from '@/utils/copy-to-clipboard';
import { Address } from '@/types/address';

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
                TODO: ASK TO CAST FOR THE PK
              </p>
              <Button
                size="icon"
                onClick={() => copyToClipboard('TODO: ASK TO CAST FOR THE PK')}
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
