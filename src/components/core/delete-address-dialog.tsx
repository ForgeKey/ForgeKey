import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-lg text-left text-secondary font-semibold leading-none tracking-tight my-2">
            Delete Address
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-secondary">
            Are you sure you want to delete the address{' '}
            <span className="font-bold">{addressToDelete?.label}</span>?
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            This action cannot be undone.
          </p>
        </div>
        <DialogFooter>
          <div className="flex flex gap-2 w-full">
            <Button
              variant="destructive"
              className="w-full text-sm"
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
              className="w-full text-sm dark:text-secondary"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
