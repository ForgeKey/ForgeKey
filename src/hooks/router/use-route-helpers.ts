import { useNavigation, useRouteParams } from './use-navigation';
import { shouldHideFooterForRoute } from '@/router/types';
import { WalletStates } from '@/types/wallet';

/**
 * Hook providing route-related helper functions
 *
 * Provides utilities for accessing route-derived data and state:
 * - Getting keystoreId from route params or selected keystore
 * - Getting all address labels for validation
 * - Determining footer visibility based on route
 *
 * @param states - Wallet state object
 * @returns Object with helper functions
 */
export function useRouteHelpers(states: WalletStates) {
  const nav = useNavigation();
  const routeParams = useRouteParams<{ keystoreId: string }>();

  /**
   * Get keystoreId from route params or selected keystore
   * Provides a single source of truth for accessing the current keystoreId
   * across different route contexts.
   *
   * @returns The keystoreId from route params, or selected keystore name, or null
   */
  const getKeystoreId = (): string | null => {
    return routeParams?.keystoreId || states.selectedKeystore?.name || null;
  };

  /**
   * Get all existing address labels from all keystores
   * Used for filtering/validation when importing addresses to avoid duplicates.
   *
   * @returns Array of all address labels across all keystores
   */
  const getAllAddressLabels = (): string[] => {
    const labels: string[] = [];
    states.keystores.forEach((keystore) => {
      keystore.addresses.forEach((address) => {
        labels.push(address.label);
      });
    });
    return labels;
  };

  /**
   * Determine if footer should be hidden for current route
   * Footer is hidden during multi-step flows (group creation, address creation)
   *
   * @returns true if footer should be hidden, false otherwise
   */
  const shouldHideFooter = (): boolean => {
    return shouldHideFooterForRoute(nav.currentRoute.name);
  };

  return {
    getKeystoreId,
    getAllAddressLabels,
    shouldHideFooter,
  };
}
