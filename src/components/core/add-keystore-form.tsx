import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AddKeystoreFormProps {
  newGroupName: string;
  setNewGroupName: (name: string) => void;
  handleAddGroup: () => void;
  setIsAddingGroup: (isAdding: boolean) => void;
}

const AddKeystoreForm: React.FC<AddKeystoreFormProps> = ({
  newGroupName,
  setNewGroupName,
  handleAddGroup,
  setIsAddingGroup,
}) => {
  return (
    <div className="space-y-4 mt-4">
      <Input
        placeholder="New Group Name"
        value={newGroupName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewGroupName(e.target.value)
        }
      />
      <Button onClick={handleAddGroup} className="w-full">
        Add Group
      </Button>
      <Button
        variant="outline"
        onClick={() => setIsAddingGroup(false)}
        className="w-full"
      >
        Cancel
      </Button>
    </div>
  );
};

export default AddKeystoreForm;
