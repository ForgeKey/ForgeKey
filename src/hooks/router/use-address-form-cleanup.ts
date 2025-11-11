import { useEffect } from 'react';
import { useNavigation } from './use-navigation';
import { isAddressRoute } from '@/router/types';
import { WalletSetters } from '@/types/wallet';

/**
 * Hook to automatically clear form state when navigating away from address routes
 *
 * This hook prevents form data from persisting when users navigate away from
 * address creation/import flows. Without this cleanup:
 * - Old address labels would appear when creating new addresses
 * - Vanity options would carry over between sessions
 * - Private key data could leak between operations
 *
 * Behavior:
 * - Detects when current route is NOT an address-related route
 * - Clears newAddress state (label, address, privateKey)
 * - Clears vanityOptions state (starts_with, ends_with, address_label)
 *
 * @param setters - Wallet state setters
 */
export function useAddressFormCleanup(setters: WalletSetters) {
  const nav = useNavigation();

  /**
   * Clear form state when navigating away from address routes
   *
   * Triggers on: Any route change (monitors nav.currentRoute.name)
   * Address routes: ADDRESS_NEW, ADDRESS_VANITY, ADDRESS_IMPORT,
   *                 ADDRESS_SELECT_TYPE, ADDRESS_SELECT_KEYSTORE,
   *                 ADDRESS_IMPORT_KEYSTORE
   */
  useEffect(() => {
    const route = nav.currentRoute.name;

    if (!isAddressRoute(route)) {
      // Clear form data when not on address routes
      setters.setNewAddress({
        label: '',
        address: '',
        privateKey: undefined,
      });
      setters.setVanityOptions({
        starts_with: undefined,
        ends_with: undefined,
        address_label: '',
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nav.currentRoute.name]);
}
