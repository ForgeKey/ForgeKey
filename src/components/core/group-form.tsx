import { Input } from '@/components/ui/input';
import { FormPage } from '@/components/layout/form-page';

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
    <FormPage
      title="Create a New Workspace"
      description="A Workspace helps you organize your keystores by project or environment."
      onBack={handleBackClick}
      onSubmit={handleSubmit}
      submitLabel="Create a New Workspace"
      submitDisabled={!newGroupName.trim()}
    >
      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Workspace Name
        </label>
        <Input
          placeholder="e.g. Development"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          autoFocus
        />
      </div>
    </FormPage>
  );
};
