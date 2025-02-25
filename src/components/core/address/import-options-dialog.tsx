import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Key, FolderOpen } from 'lucide-react';

interface ImportOptionsDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onImportPrivateKey: () => void;
  onImportKeystore: () => void;
}

export function ImportOptionsDialog({
  isOpen,
  setIsOpen,
  onImportPrivateKey,
  onImportKeystore,
}: ImportOptionsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-lg text-left font-semibold leading-none tracking-tight my-2 dark:text-secondary">
            Import Options
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2 dark:text-secondary"
            onClick={() => {
              setIsOpen(false);
              onImportPrivateKey();
            }}
          >
            <Key className="h-6 w-6 dark:text-secondary" />
            <span>Private Key</span>
          </Button>
          <Button
            variant="outline"
            className="flex flex-col items-center justify-center h-24 space-y-2 dark:text-secondary"
            onClick={() => {
              setIsOpen(false);
              onImportKeystore();
            }}
          >
            <FolderOpen className="h-6 w-6 dark:text-secondary" />
            <span>Existing Keystore</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
