import { ChevronLeft } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface GroupFormProps {
  newGroupName: string;
  setNewGroupName: (groupName: string) => void;
  handleAddGroup: () => void;
  handleBackClick: () => void;
}

export const GroupForm = ({
  newGroupName,
  setNewGroupName,
  handleAddGroup,
  handleBackClick,
}: GroupFormProps) => {
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
        placeholder="New Group Name"
        value={newGroupName}
        onChange={(e) => setNewGroupName(e.target.value)}
      />
      <Button variant="secondary" onClick={handleAddGroup} className="w-full">
        Add Group
      </Button>
    </div>
  );
};
