import { Keystore } from '@/types/address';
import { useNavigation } from '@/hooks/router/use-navigation';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook for managing wallet navigation and UI state
 */
export function useWalletNavigation() {
  const nav = useNavigation();
  const isAddingAddress = useWalletStore((state) => state.isAddingAddress);
  const addAddressStep = useWalletStore((state) => state.addAddressStep);
  const isAddingGroup = useWalletStore((state) => state.isAddingGroup);
  const newGroupName = useWalletStore((state) => state.newGroupName);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const setIsAddingAddress = useWalletStore(
    (state) => state.setIsAddingAddress
  );
  const setAddAddressStep = useWalletStore((state) => state.setAddAddressStep);
  const setIsAddingGroup = useWalletStore((state) => state.setIsAddingGroup);
  const setNewGroupName = useWalletStore((state) => state.setNewGroupName);
  const addGroup = useWalletStore((state) => state.addGroup);

  /**
   * Handles clicking on a keystore to select it
   */
  const handleKeystoreClick = (keystore: Keystore) => {
    setSelectedKeystore(keystore);

    // If keystore is empty, go directly to address creation
    if (keystore.addresses.length === 0) {
      nav.toAddressSelectType(keystore.name);
    } else {
      nav.toKeystoreView(keystore.name);
    }
  };

  /**
   * Handles back button clicks in the UI
   *
   * @deprecated This function is deprecated in favor of using nav.goBack() directly
   * from the useNavigation hook. The router now handles navigation state automatically.
   *
   * This function remains for backward compatibility but should not be used in new code.
   * All back button handlers should now call nav.goBack() or explicitly navigate to
   * the desired route (e.g., nav.toKeystoreList() for GROUP_CREATE back button).
   *
   * Legacy behavior:
   * - Manages state-based navigation logic for isAddingAddress, addAddressStep, and isAddingGroup
   * - Manually resets state variables based on current UI state
   * - Does not integrate with router history
   *
   * Migration path:
   * - Replace calls to this function with nav.goBack() for standard back navigation
   * - For routes without history (e.g., GROUP_CREATE), explicitly navigate and reset state
   *
   * @see useNavigation for the current navigation API
   */
  const handleBackClick = () => {
    if (isAddingAddress) {
      if (addAddressStep === 'select') {
        setIsAddingAddress(false);
        setAddAddressStep('select');
      } else {
        setAddAddressStep('select');
      }
    } else if (isAddingGroup) {
      setIsAddingGroup(false);
      setNewGroupName('');
    } else {
      setSelectedKeystore(null);
      setAddAddressStep('select');
    }
  };

  /**
   * Handles adding a new group
   */
  const handleAddGroup = () => {
    if (newGroupName) {
      addGroup(newGroupName);
      setNewGroupName('');
      setIsAddingGroup(false);
      nav.toKeystoreList();
    }
  };

  return {
    handleKeystoreClick,
    handleBackClick,
    handleAddGroup,
  };
}
