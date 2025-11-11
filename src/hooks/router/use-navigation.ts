import { useRouter } from '@/router/store';
import { ROUTES } from '@/router/types';

/**
 * Convenience hook for navigation
 * Provides both low-level navigate/goBack and high-level route-specific methods
 */
export function useNavigation() {
  const navigate = useRouter((s) => s.navigate);
  const goBack = useRouter((s) => s.goBack);
  const currentRoute = useRouter((s) => s.currentRoute);
  const canGoBack = useRouter((s) => s.canGoBack());
  const reset = useRouter((s) => s.reset);

  return {
    // Core navigation
    navigate,
    goBack,
    reset,
    currentRoute,
    canGoBack,

    // Convenience navigation methods
    toKeystoreList: () => navigate({ name: ROUTES.KEYSTORE_LIST }),

    toKeystoreView: (keystoreId: string) =>
      navigate({ name: ROUTES.KEYSTORE_VIEW, params: { keystoreId } }),

    toAddressSelectType: (keystoreId: string) =>
      navigate({ name: ROUTES.ADDRESS_SELECT_TYPE, params: { keystoreId } }),

    toAddressNew: (keystoreId: string) =>
      navigate({ name: ROUTES.ADDRESS_NEW, params: { keystoreId } }),

    toAddressVanity: (keystoreId: string) =>
      navigate({ name: ROUTES.ADDRESS_VANITY, params: { keystoreId } }),

    toAddressImport: (keystoreId: string) =>
      navigate({ name: ROUTES.ADDRESS_IMPORT, params: { keystoreId } }),

    toAddressSelectKeystore: (keystoreId: string) =>
      navigate({
        name: ROUTES.ADDRESS_SELECT_KEYSTORE,
        params: { keystoreId },
      }),

    toAddressImportKeystore: (keystoreId: string) =>
      navigate({
        name: ROUTES.ADDRESS_IMPORT_KEYSTORE,
        params: { keystoreId },
      }),

    toGroupCreate: () => navigate({ name: ROUTES.GROUP_CREATE }),
  };
}

/**
 * Hook to check if currently on a specific route
 */
export function useIsRoute(routeName: string): boolean {
  return useRouter((s) => s.currentRoute.name === routeName);
}

/**
 * Hook to get current route parameters (type-safe)
 */
export function useRouteParams<T = Record<string, string>>(): T | undefined {
  return useRouter((s) => {
    const route = s.currentRoute as { params?: T };
    return route.params;
  });
}
