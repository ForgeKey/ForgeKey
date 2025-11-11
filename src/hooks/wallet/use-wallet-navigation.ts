import { Keystore } from '@/types/address';
import { WalletStates, WalletSetters } from '@/types/wallet';
import { useNavigation } from '@/hooks/router/use-navigation';

/**
 * Hook for managing wallet navigation and UI state
 */
export function useWalletNavigation(
  states: WalletStates,
  setters: WalletSetters,
  actions: { addGroup: (name: string) => void }
) {
  const nav = useNavigation();

  /**
   * Handles clicking on a keystore to select it
   */
  const handleKeystoreClick = (keystore: Keystore) => {
    setters.setSelectedKeystore(keystore);

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
    if (states.isAddingAddress) {
      if (states.addAddressStep === 'select') {
        setters.setIsAddingAddress(false);
        setters.setAddAddressStep('select');
      } else {
        setters.setAddAddressStep('select');
      }
    } else if (states.isAddingGroup) {
      setters.setIsAddingGroup(false);
      setters.setNewGroupName('');
    } else {
      setters.setSelectedKeystore(null);
      setters.setAddAddressStep('select');
    }
  };

  /**
   * Handles adding a new group
   */
  const handleAddGroup = () => {
    if (states.newGroupName) {
      actions.addGroup(states.newGroupName);
      setters.setNewGroupName('');
      setters.setIsAddingGroup(false);
      nav.toKeystoreList();
    }
  };

  return {
    handleKeystoreClick,
    handleBackClick,
    handleAddGroup,
  };
}
