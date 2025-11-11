import { useEffect } from 'react';
import { useNavigation } from './use-navigation';
import { ROUTES } from '@/router/types';
import { WalletStates, WalletSetters } from '@/types/wallet';

/**
 * Hook to sync component state with router state
 *
 * This hook ensures that component state stays in sync with the router's
 * parameters and route changes. It handles:
 * - Syncing selectedKeystore with keystoreId route param
 * - Clearing selectedKeystore when returning to list
 * - Syncing isAddingGroup flag for GROUP_CREATE route
 *
 * @param states - Wallet state object
 * @param setters - Wallet state setters
 */
export function useRouterSync(states: WalletStates, setters: WalletSetters) {
  const nav = useNavigation();

  /**
   * Sync component state with router state
   *
   * This effect ensures that the selectedKeystore state stays in sync with the router's
   * keystoreId parameter. This is critical for maintaining consistent UI state when:
   * - User navigates via back button
   * - Route changes programmatically
   * - Direct route changes occur
   *
   * Behavior:
   * 1. Routes with keystoreId param: Sets selectedKeystore to matching keystore object
   *    - If keystore not found, redirects to KEYSTORE_LIST
   * 2. KEYSTORE_LIST route: Clears selectedKeystore
   * 3. GROUP_CREATE route: Sets isAddingGroup flag
   *
   * Dependencies deliberately omit setters/nav to avoid infinite loops.
   */
  useEffect(() => {
    const route = nav.currentRoute;

    // Sync selectedKeystore with router params for keystore-based routes
    if ('params' in route && route.params && 'keystoreId' in route.params) {
      const keystoreId = route.params.keystoreId as string;
      if (keystoreId && keystoreId !== states.selectedKeystore?.name) {
        const keystore = states.keystores.find((k) => k.name === keystoreId);
        if (keystore) {
          setters.setSelectedKeystore(keystore);
        } else {
          // Keystore not found, redirect to list
          console.warn(`Keystore ${keystoreId} not found, redirecting to list`);
          nav.toKeystoreList();
        }
      }
    } else if (route.name === ROUTES.KEYSTORE_LIST) {
      // Clear selected keystore when on list view
      if (states.selectedKeystore !== null) {
        setters.setSelectedKeystore(null);
      }
    } else if (route.name === ROUTES.GROUP_CREATE) {
      // Sync group creation state
      if (!states.isAddingGroup) {
        setters.setIsAddingGroup(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    nav.currentRoute,
    states.keystores,
    states.selectedKeystore?.name,
    states.isAddingGroup,
  ]);
}
