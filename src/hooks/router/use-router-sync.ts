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
 * - Syncing addAddressStep with address-related routes
 */
export function useRouterSync() {
  const nav = useNavigation();
  const keystores = useWalletStore((state) => state.keystores);
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const isAddingGroup = useWalletStore((state) => state.isAddingGroup);
  const addAddressStep = useWalletStore((state) => state.addAddressStep);
  const setSelectedKeystore = useWalletStore(
    (state) => state.setSelectedKeystore
  );
  const setIsAddingGroup = useWalletStore((state) => state.setIsAddingGroup);
  const setAddAddressStep = useWalletStore((state) => state.setAddAddressStep);

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

    // Sync addAddressStep with address-related routes
    // This ensures the wallet store knows which type of address operation is active
    const routeToStepMap: Record<string, typeof addAddressStep> = {
      [ROUTES.ADDRESS_SELECT_TYPE]: 'select',
      [ROUTES.ADDRESS_NEW]: 'new',
      [ROUTES.ADDRESS_VANITY]: 'vanity',
      [ROUTES.ADDRESS_IMPORT_OPTIONS]: 'select', // import-options doesn't have its own step
      [ROUTES.ADDRESS_IMPORT]: 'import',
      [ROUTES.ADDRESS_SELECT_KEYSTORE]: 'select-keystore',
      [ROUTES.ADDRESS_IMPORT_KEYSTORE]: 'import-keystore',
    };

    const expectedStep = routeToStepMap[route.name];
    if (expectedStep && addAddressStep !== expectedStep) {
      setAddAddressStep(expectedStep);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.currentRoute, keystores, selectedKeystore?.name, isAddingGroup, addAddressStep]);
}
