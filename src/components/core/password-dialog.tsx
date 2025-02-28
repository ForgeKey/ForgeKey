import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import { ZeroizedString } from '@/lib/zeroized-string';

interface PasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handlePasswordSubmit: (password: ZeroizedString | null) => void;
  privateKey: ZeroizedString | null;
  privateKeyError: string;
  password: ZeroizedString | null;
  setPassword: (password: string | null) => void;
}

export const PasswordDialog = ({
  isOpen,
  setIsOpen,
  handlePasswordSubmit,
  privateKey,
  privateKeyError,
  password,
  setPassword,
}: PasswordDialogProps) => {
  const isPrivateKeyRevealed = privateKey !== null && password !== null;
  const showPrivateKeyError = privateKeyError.length > 0;

  const [showCopySuccess, setShowCopySuccess] = useState(false);
  const [maskedPrivateKey, setMaskedPrivateKey] = useState('');

  // When the private key changes, update the masked version
  useEffect(() => {
    if (privateKey) {
      // Use the secure private key wrapper to get a masked version
      privateKey.use((rawPrivateKey) => {
        setMaskedPrivateKey(
          `${rawPrivateKey.slice(0, 10)}...${rawPrivateKey.slice(-10)}`
        );
      });
    } else {
      setMaskedPrivateKey('');
    }
  }, [privateKey]);

  // Clean up when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setShowCopySuccess(false);
      setMaskedPrivateKey('');
    }
  }, [isOpen]);

  const handleCopy = async () => {
    if (privateKey) {
      // Use the secure private key wrapper to copy the private key
      privateKey.use(async (rawPrivateKey) => {
        await navigator.clipboard.writeText(rawPrivateKey);
      });

      setShowCopySuccess(true);
      setTimeout(() => setShowCopySuccess(false), 2000);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    // The private key and password will be zeroized by the hook that manages it
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setPassword(e.target.value);
    } else {
      setPassword(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <>
          <DialogHeader>
            <DialogTitle className="text-lg text-left font-semibold leading-none tracking-tight my-2 text-foreground dark:text-secondary">
              Reveal Private Key
            </DialogTitle>
          </DialogHeader>
          {!isPrivateKeyRevealed && (
            <div className="py-4">
              <Input
                type="password"
                placeholder="Enter your password"
                value={password?.getValue() || ''}
                onChange={handlePasswordChange}
              />
              {showPrivateKeyError && (
                <p className="text-red-500 text-sm">{privateKeyError}</p>
              )}
            </div>
          )}
          {isPrivateKeyRevealed && (
            <div className="py-4">
              <div className="flex flex-col gap-2">
                <p className="text-sm dark:text-gray-300">Private Key:</p>
                <div className="flex items-center gap-2">
                  <p className="text-sm dark:text-gray-300 flex-1 break-all">
                    {maskedPrivateKey}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopy}
                    className="shrink-0 relative w-[60px] flex justify-center items-center dark:text-secondary dark:border-gray-700"
                  >
                    {showCopySuccess ? (
                      <Check className="w-4 h-4 text-green-500" />
                    ) : (
                      'Copy'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              className="w-full text-sm dark:text-secondary dark:bg-zinc-800 dark:hover:bg-zinc-700"
              onClick={() =>
                isPrivateKeyRevealed
                  ? handleClose()
                  : handlePasswordSubmit(password)
              }
            >
              {isPrivateKeyRevealed ? 'Close' : 'View Private Key'}
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
};
