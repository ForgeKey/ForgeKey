import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DialogIconBadge } from '@/components/ui/dialog-icon-badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormField, FormLabel, FormError } from '@/components/ui/form-field';
import { useState, useMemo } from 'react';
import { Check, Copy, KeyRound, LockIcon, AlertTriangle } from 'lucide-react';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';

interface PasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handlePasswordSubmit: (password: ZeroizedString | null) => void;
  privateKey: ZeroizedString | null;
  privateKeyError: string;
}

export const PasswordDialog = ({
  isOpen,
  setIsOpen,
  handlePasswordSubmit,
  privateKey,
  privateKeyError,
}: PasswordDialogProps) => {
  const { createZeroizedString } = useZeroize();

  // Local state for password input - not a ZeroizedString until submission
  const [passwordInput, setPasswordInput] = useState('');
  const [hasSubmitted, setHasSubmitted] = useState(false);

  const isPrivateKeyRevealed = privateKey !== null && hasSubmitted;
  const showPrivateKeyError = privateKeyError.length > 0;

  const [showCopySuccess, setShowCopySuccess] = useState(false);

  // Derive masked private key from privateKey prop
  const maskedPrivateKey = useMemo(() => {
    if (privateKey) {
      return privateKey.use((rawPrivateKey) =>
        `${rawPrivateKey.slice(0, 12)}...${rawPrivateKey.slice(-12)}`
      );
    }
    return '';
  }, [privateKey]);

  // Reset state when dialog closes
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setShowCopySuccess(false);
      setPasswordInput('');
      setHasSubmitted(false);
    }
    setIsOpen(open);
  };

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
    setPasswordInput('');
    setHasSubmitted(false);
    privateKey?.zeroize();
  };

  const handleSubmit = () => {
    if (!passwordInput) return;

    // Create ZeroizedString only at submission time
    const securePassword = createZeroizedString(passwordInput);
    // Clear the plain text password from local state immediately
    setPasswordInput('');
    setHasSubmitted(true);
    // Pass to handler - it will be zeroized after API call
    handlePasswordSubmit(securePassword);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordInput(e.target.value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-xs">
        <>
          <DialogHeader className="space-y-2">
            <DialogIconBadge>
              {isPrivateKeyRevealed ? (
                <KeyRound className="h-4 w-4" />
              ) : (
                <LockIcon className="h-4 w-4" />
              )}
            </DialogIconBadge>
            <DialogTitle className="text-center text-base">
              {isPrivateKeyRevealed ? 'Private key' : 'Reveal Private Key'}
            </DialogTitle>
          </DialogHeader>

          {!isPrivateKeyRevealed && (
            <FormField className="py-2">
              <FormLabel>Enter your password</FormLabel>
              <Input
                type="password"
                placeholder=""
                value={passwordInput}
                onChange={handlePasswordChange}
                variant="dark"
              />
              {showPrivateKeyError && (
                <FormError>{privateKeyError}</FormError>
              )}
            </FormField>
          )}

          {isPrivateKeyRevealed && (
            <div className="space-y-3">
              {/* Private key display with copy button */}
              <div className="flex items-center gap-2 bg-white/5 p-3 rounded-lg border border-white/10">
                <p className="flex-1 text-xs text-white/90 font-mono break-all">
                  {maskedPrivateKey}
                </p>
                <button
                  onClick={handleCopy}
                  className="p-1.5 rounded-md hover:bg-white/10 transition-colors flex-shrink-0"
                  title="Copy full key to clipboard"
                >
                  {showCopySuccess ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4 text-white/50 hover:text-white" />
                  )}
                </button>
              </div>

              {/* Security warning */}
              <div className="flex items-start gap-2 text-[10px] text-amber-400/80">
                <AlertTriangle className="w-3 h-3 mt-0.5 flex-shrink-0" />
                <span>Never share your private key. Anyone with it has full control of your wallet.</span>
              </div>
            </div>
          )}

          <DialogFooter className="mt-1">
            <Button
              className="w-full h-9"
              onClick={() =>
                isPrivateKeyRevealed
                  ? handleClose()
                  : handleSubmit()
              }
              disabled={!isPrivateKeyRevealed && !passwordInput}
            >
              {isPrivateKeyRevealed ? 'Close' : 'View Private Key'}
            </Button>
          </DialogFooter>
        </>
      </DialogContent>
    </Dialog>
  );
};
