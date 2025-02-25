import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { Check } from 'lucide-react';

interface PasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handlePasswordSubmit: (password: string) => void;
  privateKey: string;
  privateKeyError: string;
  password: string;
  setPassword: (password: string) => void;
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
  const isPrivateKeyRevealed = privateKey.length > 0;
  const showPrivateKeyError = privateKeyError.length > 0 && password.length > 0;

  const [showCopySuccess, setShowCopySuccess] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(privateKey);
    setShowCopySuccess(true);
    setTimeout(() => setShowCopySuccess(false), 2000);
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                    {privateKey.slice(0, 10)}...
                    {privateKey.slice(-10)}
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
                  ? setIsOpen(false)
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
