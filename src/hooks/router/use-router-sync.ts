import { useEffect } from 'react';
import { useNavigation } from './use-navigation';
import { ROUTES } from '@/router/types';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook to sync component state with router state
 *
 * This hook ensures that component state stays in sync with the router's
 * parameters and route changes. It handles:
 * - Syncing selectedKeystore with keystoreId route param
 * - Clearing selectedKeystore when returning to list
 * - Syncing isAddingGroup flag for GROUP_CREATE route
 */
export function useRouterSync() {
  const nav = useNavigation();
  const keystores = useWalletStore((state) => state.keystores);
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const isAddingGroup = useWalletStore((state) => state.isAddingGroup);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const setIsAddingGroup = useWalletStore((state) => state.setIsAddingGroup);

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
      if (keystoreId && keystoreId !== selectedKeystore?.name) {
        const keystore = keystores.find((k) => k.name === keystoreId);
        if (keystore) {
          setSelectedKeystore(keystore);
        } else {
          // Keystore not found, redirect to list
          console.warn(`Keystore ${keystoreId} not found, redirecting to list`);
          nav.toKeystoreList();
        }
      }
    } else if (route.name === ROUTES.KEYSTORE_LIST) {
      // Clear selected keystore when on list view
      if (selectedKeystore !== null) {
        setSelectedKeystore(null);
      }
    } else if (route.name === ROUTES.GROUP_CREATE) {
      // Sync group creation state
      if (!isAddingGroup) {
        setIsAddingGroup(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.currentRoute, keystores, selectedKeystore?.name, isAddingGroup]);
}
