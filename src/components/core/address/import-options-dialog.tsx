import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Key, FolderOpen, Download } from 'lucide-react';

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
      <DialogContent className="max-w-xs">
        <DialogHeader className="space-y-2">
          <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full w-9 h-9 flex items-center justify-center mb-1">
            <Download className="h-4 w-4" />
          </div>
          <DialogTitle className="text-center text-base">Import Options</DialogTitle>
          <DialogDescription className="text-center text-xs">
            Choose how you want to import your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2 py-3">
          <div className="flex flex-col space-y-1.5">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20 space-y-2 text-white rounded-lg"
              onClick={() => {
                setIsOpen(false);
                onImportPrivateKey();
              }}
            >
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Key className="h-4 w-4 text-purple-400" />
              </div>
              <span className="font-medium text-sm">Private Key</span>
            </Button>
            <p className="text-[10px] text-gray-400 text-center px-1">
              Import with a raw private key
            </p>
          </div>

          <div className="flex flex-col space-y-1.5">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-20 space-y-2 text-white rounded-lg"
              onClick={() => {
                setIsOpen(false);
                onImportKeystore();
              }}
            >
              <div className="bg-pink-500/20 p-2 rounded-full">
                <FolderOpen className="h-4 w-4 text-pink-400" />
              </div>
              <span className="font-medium text-sm">Keystore File</span>
            </Button>
            <p className="text-[10px] text-gray-400 text-center px-1">
              Import from an encrypted keystore file
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
