import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Address } from '@/types/address';
import { AlertTriangle } from 'lucide-react';

interface DeleteAddressDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  addressToDelete: Address | null;
  onConfirmDelete: (address: Address) => void;
}

export const DeleteAddressDialog = ({
  isOpen,
  setIsOpen,
  addressToDelete,
  onConfirmDelete,
}: DeleteAddressDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-sm">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-red-500/20 text-red-400 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Delete Keystore</DialogTitle>
          <DialogDescription className="text-center">
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col space-y-2 sm:space-y-0">
          <Button
            variant="destructive"
            className="w-full bg-red-500/80 hover:bg-red-500 text-white"
            onClick={() => {
              if (addressToDelete) {
                onConfirmDelete(addressToDelete);
              }
              setIsOpen(false);
            }}
          >
            Delete
          </Button>
          <Button
            variant="outline"
            className="w-full text-white bg-white/5 hover:bg-white/10 border-white/10"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
