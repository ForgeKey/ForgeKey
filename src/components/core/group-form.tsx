import { ArrowLeft } from 'lucide-react';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newGroupName.trim()) {
      handleAddGroup();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex flex-col h-full min-h-[340px]">
      {/* Back Button */}
      <div className="mb-2">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBackClick}
          className="h-8 w-8 p-0 text-white bg-transparent hover:bg-white/10 rounded-full transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
      </div>

      {/* Header */}
      <div className="mb-3">
        <h2 className="text-base font-semibold text-white mb-1">
          Create a New Workspace
        </h2>
        <p className="text-xs text-white/50">
          A Workspace helps you organize your keystores by project or environment.
        </p>
      </div>

      {/* Form Field */}
      <div className="flex-1">
        <label className="block text-xs font-medium text-white mb-1.5">
          Workspace Name
        </label>
        <Input
          placeholder=""
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="bg-white/90 text-gray-900 placeholder:text-gray-400 border-0 h-9 rounded-md text-sm"
          autoFocus
        />
      </div>

      {/* Submit Button - fixed at bottom */}
      <div className="pt-3">
        <Button
          type="submit"
          disabled={!newGroupName.trim()}
          className="w-full h-9 text-sm font-medium rounded-md"
        >
          Create a New Workspace
        </Button>
      </div>
    </form>
  );
};
