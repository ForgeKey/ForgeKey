import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddKeystoreFormProps {
  newKeystoreName: string;
  setNewKeystoreName: (name: string) => void;
  handleAddKeystore: () => void;
  setIsAddingKeystore: (isAdding: boolean) => void;
}

const AddKeystoreForm: React.FC<AddKeystoreFormProps> = ({
  newKeystoreName,
  setNewKeystoreName,
  handleAddKeystore,
  setIsAddingKeystore,
}) => {
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

export default AddKeystoreForm;
