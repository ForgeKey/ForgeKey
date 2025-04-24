import { ChevronLeft, FolderPlus } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-6 p-2">
      <div className="relative text-center mb-6 pt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={handleBackClick}
          className="absolute left-0 top-4 p-2 text-white bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <FolderPlus className="h-8 w-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Create New Group</h2>
        <p className="text-sm text-gray-300 mt-1">
          A keystore group helps you organize your wallet addresses
        </p>
      </div>

      <div className="bg-white/5 backdrop-blur-sm p-4 rounded-lg border border-white/5">
        <label className="block text-sm text-gray-300 mb-2">Group Name</label>
        <Input
          placeholder="Enter group name"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity"
        disabled={!newGroupName.trim()}
      >
        Create Group
      </Button>
    </form>
  );
};
