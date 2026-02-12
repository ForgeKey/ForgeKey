import { Input } from '@/components/ui/input';
import { FormPage } from '@/components/layout/form-page';
import { FormField, FormLabel } from '@/components/ui/form-field';

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
      formId="group-create-form"
    >
      <FormField>
        <FormLabel>Workspace Name</FormLabel>
        <Input
          placeholder="e.g. Development"
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          autoFocus
        />
      </FormField>
    </FormPage>
  );
};
