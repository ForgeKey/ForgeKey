import { useNavigation, useRouteParams } from './use-navigation';
import { shouldHideFooterForRoute } from '@/router/types';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook providing route-related helper functions
 *
 * Provides utilities for accessing route-derived data and state:
 * - Getting keystoreId from route params or selected keystore
 * - Getting all address labels for validation
 * - Determining footer visibility based on route
 *
 * @returns Object with helper functions
 */
export function useRouteHelpers() {
  const nav = useNavigation();
  const routeParams = useRouteParams<{ keystoreId: string }>();
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const keystores = useWalletStore((state) => state.keystores);

  /**
   * Get keystoreId from route params or selected keystore
   * Provides a single source of truth for accessing the current keystoreId
   * across different route contexts.
   *
   * @returns The keystoreId from route params, or selected keystore name, or null
   */
  const getKeystoreId = (): string | null => {
    return routeParams?.keystoreId || selectedKeystore?.name || null;
  };

  /**
   * Get all existing address labels from all keystores
   * Used for filtering/validation when importing addresses to avoid duplicates.
   *
   * @returns Array of all address labels across all keystores
   */
  const getAllAddressLabels = (): string[] => {
    const labels: string[] = [];
    keystores.forEach((keystore) => {
      keystore.addresses.forEach((address) => {
        labels.push(address.label);
      });
    });
    return labels;
  };

  /**
   * Determine if footer should be hidden for current route
   * Footer is hidden during multi-step flows (group creation, address creation)
   * and when there are no keystores (showing empty state)
   *
   * @returns true if footer should be hidden, false otherwise
   */
  const shouldHideFooter = (): boolean => {
    // Hide footer when showing empty keystore screen
    if (keystores.length === 0) {
      return true;
    }
    return shouldHideFooterForRoute(nav.currentRoute.name);
  };

  return {
    getKeystoreId,
    getAllAddressLabels,
    shouldHideFooter,
  };
}
