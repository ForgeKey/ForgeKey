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
      <DialogContent className="max-w-xs" hideCloseButton>
        <DialogHeader className="space-y-1">
          <DialogTitle className="text-center text-base">Delete address</DialogTitle>
          <DialogDescription className="text-center text-xs">
            You are going to delete this keystore. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-row gap-2 mt-2">
          <Button
            variant="outline"
            className="flex-1 h-8 text-xs"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1 h-8 text-xs"
            onClick={() => {
              if (addressToDelete) {
                onConfirmDelete(addressToDelete);
              }
              setIsOpen(false);
            }}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
