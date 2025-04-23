import { Keystore } from '@/types/address';
import { WalletStates, WalletSetters } from '@/types/wallet';

/**
 * Hook for managing wallet navigation and UI state
 */
export function useWalletNavigation(
  states: WalletStates,
  setters: WalletSetters,
  actions: { addGroup: (name: string) => void }
) {
  /**
   * Handles clicking on a keystore to select it
   */
  const handleKeystoreClick = (keystore: Keystore) => {
    setters.setSelectedKeystore(keystore);
  };

  /**
   * Handles back button clicks in the UI
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
    }
  };

  return {
    handleKeystoreClick,
    handleBackClick,
    handleAddGroup,
  };
}
