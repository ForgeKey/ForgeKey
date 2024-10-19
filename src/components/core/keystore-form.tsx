import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface KeystoreFormProps {
  newKeystoreName: string;
  setNewKeystoreName: (keystoreName: string) => void;
  handleAddKeystore: () => void;
  setIsAddingKeystore: (isAddingKeystore: boolean) => void;
}

export const KeystoreForm = ({
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  setIsAddingKeystore,
}: KeystoreFormProps) => {
  return (
    <div className="space-y-4 mt-4">
      <Input
        placeholder="New Keystore Name"
        value={newKeystoreName}
        onChange={(e) => setNewKeystoreName(e.target.value)}
      />
      <Button onClick={handleAddKeystore} className="w-full">
        Add Keystore
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsAddingKeystore(false)}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
};
