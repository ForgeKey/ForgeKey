import { Button } from '@/components/ui/button';
import { Keystore } from '@/types/address';
import { useNavigation, useIsRoute } from '@/hooks/router/use-navigation';
import { useWalletStore } from '@/stores/wallet-store';
import { validatePassword } from '@/lib/password-validation';
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
  const isWelcome = useIsRoute(ROUTES.ONBOARDING_WELCOME);
  const isKeystoreView = useIsRoute(ROUTES.KEYSTORE_VIEW);
  const isKeystoreList = useIsRoute(ROUTES.KEYSTORE_LIST);
  const isGroupCreate = useIsRoute(ROUTES.GROUP_CREATE);
  const isAddressNew = useIsRoute(ROUTES.ADDRESS_NEW);
  const isAddressVanity = useIsRoute(ROUTES.ADDRESS_VANITY);
  const isAddressImport = useIsRoute(ROUTES.ADDRESS_IMPORT);
  const isAddressImportKeystore = useIsRoute(ROUTES.ADDRESS_IMPORT_KEYSTORE);

  const newGroupName = useWalletStore((state) => state.newGroupName);
  const newAddress = useWalletStore((state) => state.newAddress);
  const vanityOptions = useWalletStore((state) => state.vanityOptions);

  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const handleAddAddressClick = () => {
    if (selectedKeystore) {
      nav.toAddressSelectType(selectedKeystore.name);
    }
  };

  const handleAddGroupClick = () => {
    nav.toGroupCreate();
    setIsAddingGroup(true);
  };

  // Determine footer button config based on current route
  const getFormButton = () => {
    if (isGroupCreate) {
      return {
        formId: 'group-create-form',
        label: 'Create a New Workspace',
        disabled: !newGroupName.trim(),
      };
    }
    if (isAddressNew) {
      return {
        formId: 'new-address-form',
        label: 'Generate Address',
        disabled: !newAddress.label || !newAddress.password || !isPasswordValid,
      };
    }
    if (isAddressVanity) {
      return {
        formId: 'vanity-address-form',
        label: 'Create Vanity Address',
        disabled:
          !newAddress.label ||
          !newAddress.password ||
          !isPasswordValid ||
          (!vanityOptions.starts_with && !vanityOptions.ends_with),
      };
    }
    if (isAddressImport) {
      return {
        formId: 'import-address-form',
        label: 'Import Address',
        disabled:
          !newAddress.label ||
          !newAddress.privateKey ||
          !newAddress.password ||
          !isPasswordValid,
      };
    }
    if (isAddressImportKeystore) {
      return {
        formId: 'import-keystore-form',
        label: 'Import Keystore',
        disabled: false,
      };
    }
    return null;
  };

  const formButton = getFormButton();

  return (
    <div className="p-3 relative flex-shrink-0 flex items-center justify-center gap-2">
      {isWelcome && (
        <div className="w-full">
          <Button
            onClick={() => nav.navigate({ name: ROUTES.GROUP_CREATE })}
            className="w-full h-9 rounded-md text-sm"
          >
            Get Into
          </Button>
        </div>
      )}
      {isKeystoreView && selectedKeystore && selectedKeystore.addresses.length > 0 && (
        <div className="w-full">
          <Button
            onClick={handleAddAddressClick}
            className="w-full h-9 rounded-md text-sm"
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
      {formButton && (
        <div className="w-full">
          <Button
            type="submit"
            form={formButton.formId}
            disabled={formButton.disabled}
            className="w-full h-9 rounded-md text-sm"
          >
            {formButton.label}
          </Button>
        </div>
      )}
    </div>
  );
};
