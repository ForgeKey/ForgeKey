import { Plus } from 'lucide-react';
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

  return (
    <div className="p-4 relative h-16 flex items-center justify-center">
      {isKeystoreView &&
        selectedKeystore &&
        selectedKeystore.addresses.length > 0 && (
          <div className="absolute bottom-6 right-6">
            <Button
              onClick={handleAddAddressClick}
              className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 p-0 flex items-center justify-center text-white hover:shadow-xl transition-shadow"
            >
              <Plus className="h-6 w-6" />
            </Button>
          </div>
        )}
      {isKeystoreList && !isAddingGroup && (
        <div className="absolute bottom-6 right-6">
          <Button
            onClick={handleAddGroupClick}
            className="w-12 h-12 rounded-full shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 p-0 flex items-center justify-center text-white hover:shadow-xl transition-shadow"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      )}
    </div>
  );
};
