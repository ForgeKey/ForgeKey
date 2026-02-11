import { useNavigation, useRouteParams } from './use-navigation';
import { ROUTES, shouldHideFooterForRoute } from '@/router/types';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Hook providing route-related helper functions for keystore context,
 * address label collection, and footer visibility.
 */
export function useRouteHelpers() {
  const nav = useNavigation();
  const routeParams = useRouteParams<{ keystoreId: string }>();
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const keystores = useWalletStore((state) => state.keystores);
  const isGeneratingVanity = useWalletStore((state) => state.isGeneratingVanity);

  const getKeystoreId = (): string | null => {
    return routeParams?.keystoreId || selectedKeystore?.name || null;
  };

  const getAllAddressLabels = (): string[] => {
    return keystores.flatMap((keystore) =>
      keystore.addresses.map((address) => address.label)
    );
  };

  const shouldHideFooter = (): boolean => {
    if (isGeneratingVanity) return true;

    if (keystores.length === 0) {
      const route = nav.currentRoute.name;
      return route !== ROUTES.ONBOARDING_WELCOME && route !== ROUTES.GROUP_CREATE;
    }

    return shouldHideFooterForRoute(nav.currentRoute.name);
  };

  return {
    getKeystoreId,
    getAllAddressLabels,
    shouldHideFooter,
  };
}
