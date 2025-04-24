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
      <DialogContent className="max-w-md">
        <DialogHeader className="space-y-3">
          <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <Download className="h-6 w-6" />
          </div>
          <DialogTitle className="text-center">Import Options</DialogTitle>
          <DialogDescription className="text-center">
            Choose how you want to import your wallet
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-6">
          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-28 space-y-3 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/10 transition-colors rounded-lg"
              onClick={() => {
                setIsOpen(false);
                onImportPrivateKey();
              }}
            >
              <div className="bg-purple-500/20 p-2 rounded-full">
                <Key className="h-6 w-6 text-purple-400" />
              </div>
              <span className="font-medium">Private Key</span>
            </Button>
            <p className="text-xs text-gray-400 text-center px-2">
              Import with a raw private key
            </p>
          </div>

          <div className="flex flex-col space-y-2">
            <Button
              variant="outline"
              className="flex flex-col items-center justify-center h-28 space-y-3 text-white bg-white/5 backdrop-blur-sm hover:bg-white/10 border-white/10 transition-colors rounded-lg"
              onClick={() => {
                setIsOpen(false);
                onImportKeystore();
              }}
            >
              <div className="bg-pink-500/20 p-2 rounded-full">
                <FolderOpen className="h-6 w-6 text-pink-400" />
              </div>
              <span className="font-medium">Keystore File</span>
            </Button>
            <p className="text-xs text-gray-400 text-center px-2">
              Import from an encrypted keystore file
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
