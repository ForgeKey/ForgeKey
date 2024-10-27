import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PasswordDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  password: string;
  setPassword: (password: string) => void;
  handlePasswordSubmit: () => void;
}

export const PasswordDialog = ({
  isOpen,
  setIsOpen,
  password,
  setPassword,
  handlePasswordSubmit,
}: PasswordDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enter Password</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <Input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handlePasswordSubmit}>View Private Key</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
