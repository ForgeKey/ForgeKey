import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';
import { useNavigation, useIsRoute } from '@/hooks/router/use-navigation';
import { ROUTES } from '@/router/types';

interface FooterProps {
  isAddingGroup: boolean;
  selectedKeystore: Keystore | null;
  setIsAddingGroup: (isAddingGroup: boolean) => void;
}

export const Footer: React.FC<FooterProps> = ({
  isAddingGroup,
  selectedKeystore,
  setIsAddingGroup,
}) => {
  const nav = useNavigation();
  const isKeystoreView = useIsRoute(ROUTES.KEYSTORE_VIEW);
  const isKeystoreList = useIsRoute(ROUTES.KEYSTORE_LIST);

  const handleAddAddressClick = () => {
    if (selectedKeystore) {
      nav.toAddressSelectType(selectedKeystore.name);
    }
  };

  const handleAddGroupClick = () => {
    nav.toGroupCreate();
    setIsAddingGroup(true);
  };

  const handleDeleteWorkspace = () => {
    // TODO: Implement delete workspace functionality
    console.log('Delete workspace clicked');
  };

  return (
    <div className="p-3 relative flex items-center justify-center gap-2">
      {isKeystoreView && selectedKeystore && selectedKeystore.addresses.length > 0 && (
        <div className="w-full flex gap-2">
          <Button
            onClick={handleDeleteWorkspace}
            variant="outline"
            className="flex-1 h-9 rounded-md border border-purple-500/50 bg-transparent text-purple-300 hover:bg-purple-500/10 hover:border-purple-500 transition-all text-sm"
          >
            Delete Workspace
          </Button>
          <Button
            onClick={handleAddAddressClick}
            className="flex-1 h-9 rounded-md text-sm"
          >
            Add a Keystore
          </Button>
        </div>
      )}
      {isKeystoreList && !isAddingGroup && (
        <div className="w-full">
          <Button
            onClick={handleAddGroupClick}
            className="w-full h-9 rounded-md text-sm"
          >
            Create a New Workspace
          </Button>
        </div>
      )}
    </div>
  );
};
