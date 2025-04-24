import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';
import { Check, KeyRound, LockIcon } from 'lucide-react';
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
      <DialogContent className="max-w-sm">
        <>
          <DialogHeader className="space-y-3">
            <div className="mx-auto bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
              {isPrivateKeyRevealed ? (
                <KeyRound className="h-6 w-6" />
              ) : (
                <LockIcon className="h-6 w-6" />
              )}
            </div>
            <DialogTitle className="text-center">
              {isPrivateKeyRevealed ? 'Private Key' : 'Reveal Private Key'}
            </DialogTitle>
            {!isPrivateKeyRevealed && (
              <DialogDescription className="text-center">
                Enter your password to view the private key
              </DialogDescription>
            )}
          </DialogHeader>

          {!isPrivateKeyRevealed && (
            <div className="py-4">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/5">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password?.getValue() || ''}
                  onChange={handlePasswordChange}
                  className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                />
                {showPrivateKeyError && (
                  <p className="text-red-400 text-sm mt-2">{privateKeyError}</p>
                )}
              </div>
            </div>
          )}

          {isPrivateKeyRevealed && (
            <div className="py-4">
              <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/5">
                <p className="text-sm text-gray-300 mb-2">Private Key:</p>
                <div className="flex flex-col gap-3">
                  <p className="text-sm text-white bg-white/10 p-3 rounded-md font-mono break-all">
                    {maskedPrivateKey}
                  </p>
                  <Button
                    variant="outline"
                    onClick={handleCopy}
                    className="w-full relative flex justify-center items-center bg-white/10 hover:bg-white/20 text-white border-white/10"
                  >
                    {showCopySuccess ? (
                      <>
                        <Check className="w-4 h-4 text-green-400 mr-2" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      'Copy Private Key'
                    )}
                  </Button>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-2">
            <Button
              className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
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
