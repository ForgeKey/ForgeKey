/**
 * Route names as constants for type-safe routing
 */
export const ROUTES = {
  ONBOARDING_WELCOME: 'onboarding-welcome',
  KEYSTORE_LIST: 'keystore-list',
  KEYSTORE_VIEW: 'keystore-view',
  ADDRESS_SELECT_TYPE: 'address-select-type',
  ADDRESS_NEW: 'address-new',
  ADDRESS_VANITY: 'address-vanity',
  ADDRESS_IMPORT_OPTIONS: 'address-import-options',
  ADDRESS_IMPORT: 'address-import',
  ADDRESS_SELECT_KEYSTORE: 'address-select-keystore',
  ADDRESS_IMPORT_KEYSTORE: 'address-import-keystore',
  GROUP_CREATE: 'group-create',
} as const;

export type RouteName = (typeof ROUTES)[keyof typeof ROUTES];

/**
 * Define parameters required for each route
 */
export type RouteParams = {
  'onboarding-welcome': undefined;
  'keystore-list': undefined;
  'keystore-view': { keystoreId: string };
  'address-select-type': { keystoreId: string };
  'address-new': { keystoreId: string };
  'address-vanity': { keystoreId: string };
  'address-import-options': { keystoreId: string };
  'address-import': { keystoreId: string };
  'address-select-keystore': { keystoreId: string };
  'address-import-keystore': { keystoreId: string };
  'group-create': undefined;
};

/**
 * Type-safe route definition
 * Routes with params require them, routes without params don't allow them
 */
export type Route = {
  [K in RouteName]: RouteParams[K] extends undefined
    ? { name: K }
    : { name: K; params: RouteParams[K] };
}[RouteName];

/**
 * Route configuration for metadata
 */
export interface RouteConfig {
  title?: string;
  parent?: RouteName;
  requiresKeystore?: boolean;
}

/**
 * Map of route configurations
 */
export const ROUTE_CONFIG: Record<RouteName, RouteConfig> = {
  'onboarding-welcome': {
    title: 'Welcome',
  },
  'keystore-list': {
    title: 'Keystores',
  },
  'keystore-view': {
    title: 'Keystore Details',
    parent: 'keystore-list',
    requiresKeystore: true,
  },
  'address-select-type': {
    title: 'Add New Keystore',
    parent: 'keystore-view',
    requiresKeystore: true,
  },
  'address-new': {
    title: 'Generate New',
    parent: 'address-select-type',
    requiresKeystore: true,
  },
  'address-vanity': {
    title: 'Vanity Address',
    parent: 'address-select-type',
    requiresKeystore: true,
  },
  'address-import-options': {
    title: 'Import Options',
    parent: 'address-select-type',
    requiresKeystore: true,
  },
  'address-import': {
    title: 'Import Private Key',
    parent: 'address-import-options',
    requiresKeystore: true,
  },
  'address-select-keystore': {
    title: 'Select Keystore',
    parent: 'address-select-type',
    requiresKeystore: true,
  },
  'address-import-keystore': {
    title: 'Import Keystore',
    parent: 'address-select-type',
    requiresKeystore: true,
  },
  'group-create': {
    title: 'Create Group',
    parent: 'keystore-list',
  },
};

/**
 * Type-safe route checking utilities
 */

/** Address-related routes that require form state */
export const ADDRESS_ROUTES = [
  ROUTES.ADDRESS_NEW,
  ROUTES.ADDRESS_VANITY,
  ROUTES.ADDRESS_IMPORT_OPTIONS,
  ROUTES.ADDRESS_IMPORT,
  ROUTES.ADDRESS_SELECT_TYPE,
  ROUTES.ADDRESS_SELECT_KEYSTORE,
  ROUTES.ADDRESS_IMPORT_KEYSTORE,
] as const;

/** Routes where footer should be hidden */
export const FOOTER_HIDDEN_ROUTES = [
  ROUTES.ADDRESS_IMPORT_OPTIONS,
  ROUTES.ADDRESS_SELECT_TYPE,
  ROUTES.ADDRESS_SELECT_KEYSTORE,
] as const;

/**
 * Type-safe helper to check if route is an address route
 */
export function isAddressRoute(routeName: RouteName): boolean {
  return (ADDRESS_ROUTES as readonly string[]).includes(routeName);
}

/**
 * Type-safe helper to check if footer should be hidden for route
 */
export function shouldHideFooterForRoute(routeName: RouteName): boolean {
  return (FOOTER_HIDDEN_ROUTES as readonly string[]).includes(routeName);
}
