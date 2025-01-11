import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KeystoreFormProps {
  newKeystoreName: string;
  setNewKeystoreName: (keystoreName: string) => void;
  handleAddKeystore: () => void;
  handleBackClick: () => void;
}

export const KeystoreForm = ({
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  handleBackClick,
}: KeystoreFormProps) => {
  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center mb-4">
        <Button
          variant="ghost"
          onClick={handleBackClick}
          className="p-2 dark:text-secondary"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
        </Button>
        <span className="text-md ml-1 dark:text-secondary flex items-center">
          New Group
        </span>
      </div>
      <Input
        placeholder="New Keystore Name"
        value={newKeystoreName}
        onChange={(e) => setNewKeystoreName(e.target.value)}
      />
      <Button
        variant="secondary"
        onClick={handleAddKeystore}
        className="w-full"
      >
        Add Keystore
      </Button>
    </div>
  );
};
