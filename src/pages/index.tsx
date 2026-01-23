import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, Component, ReactNode } from 'react';

import { Header } from '@/components/core/header';
import { Footer } from '@/components/core/footer';
import { WelcomeScreen } from '@/components/core/welcome-screen';
import { EmptyKeystoreScreen } from '@/components/core/empty-keystore-screen';
import { KeystoreList } from '@/components/core/keystore-list';
import { KeystoreView } from '@/components/core/keystore-view';
import { PasswordDialog } from '@/components/core/password-dialog';
import { NewAddressForm } from '@/components/core/address/new-address-form';
import { SelectAddressType } from '@/components/core/address/select-address-type';
import { VanityAddressForm } from '@/components/core/address/vanity-address-form';
import { ImportOptions } from '@/components/core/address/import-options';
import { ImportAddressForm } from '@/components/core/address/import-address-form';
import { KeystoreSelect } from '@/components/core/address/keystore-select';
import { ImportKeystoreForm } from '@/components/core/address/import-keystore-form';

import { useAddAddress } from '@/hooks/wallet/use-add-address';
import { useImportKeystoreAddress } from '@/hooks/wallet/use-import-keystore-address';
import { useDeleteAddress } from '@/hooks/wallet/use-delete-address';
import { usePrivateKey } from '@/hooks/wallet/use-private-key';
import { useWalletNavigation } from '@/hooks/wallet/use-wallet-navigation';
import { useWalletSync } from '@/hooks/wallet/use-wallet-sync';
import { useWalletReconciliation } from '@/hooks/wallet/use-wallet-reconciliation';
import { useNavigation, useRouteParams } from '@/hooks/router/use-navigation';
import { useRouterSync } from '@/hooks/router/use-router-sync';
import { useRouteHelpers } from '@/hooks/router/use-route-helpers';
import { useAddressFormCleanup } from '@/hooks/router/use-address-form-cleanup';
import { useAddressNavigationHandlers } from '@/hooks/address/use-address-navigation-handlers';
import { ROUTES } from '@/router/types';
import { useWalletStore } from '@/stores/wallet-store';

/**
 * Error boundary for route rendering
 * Catches errors during route rendering and displays fallback UI
 */
class RouteErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Route rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-6 max-w-md">
            <h2 className="text-lg font-bold text-red-400 mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-gray-300 mb-4">
              An error occurred while rendering this page. Please try navigating
              back or restarting the app.
            </p>
            <p className="text-xs text-gray-400 font-mono">
              {this.state.error?.message}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function ForgeKeyWallet() {
  const nav = useNavigation();
  const routeParams = useRouteParams<{ keystoreId: string }>();

  // Zustand store selectors
  const keystores = useWalletStore((state) => state.keystores);
  const selectedKeystore = useWalletStore((state) => state.selectedKeystore);
  const addAddressStep = useWalletStore((state) => state.addAddressStep);
  const newAddress = useWalletStore((state) => state.newAddress);
  const vanityOptions = useWalletStore((state) => state.vanityOptions);
  const isAddingGroup = useWalletStore((state) => state.isAddingGroup);
  const newGroupName = useWalletStore((state) => state.newGroupName);
  const isPasswordDialogOpen = useWalletStore(
    (state) => state.isPasswordDialogOpen
  );
  const privateKey = useWalletStore((state) => state.privateKey);
  const privateKeyError = useWalletStore((state) => state.privateKeyError);
  const setNewAddress = useWalletStore((state) => state.setNewAddress);
  const setVanityOptions = useWalletStore((state) => state.setVanityOptions);
  const setNewGroupName = useWalletStore((state) => state.setNewGroupName);
  const setIsPasswordDialogOpen = useWalletStore(
    (state) => state.setIsPasswordDialogOpen
  );
  const setIsAddingGroup = useWalletStore((state) => state.setIsAddingGroup);

  // Reconciliation hook - initializes and syncs keystores
  useWalletReconciliation();

  // Router state synchronization
  useRouterSync();

  // Form cleanup when leaving address routes
  useAddressFormCleanup();

  // Domain-specific hooks
  const { handleAddAddress: handleAddAddressOriginal } = useAddAddress();
  const {
    handleImportKeystoreAddress: handleImportKeystoreAddressOriginal,
    validateKeystorePassword,
  } = useImportKeystoreAddress();
  const { handleDeleteAddress } = useDeleteAddress();
  const { handleViewPrivateKey, handlePasswordSubmit } = usePrivateKey();
  const { handleKeystoreClick, handleAddGroup } = useWalletNavigation();
  const { loadAvailableKeystores } = useWalletSync();

  // Route helper functions
  const { getAllAddressLabels, shouldHideFooter } = useRouteHelpers();

  // Navigation wrappers for address handlers
  const { handleAddAddress, handleImportKeystoreAddress } =
    useAddressNavigationHandlers(
      handleAddAddressOriginal,
      handleImportKeystoreAddressOriginal
    );

  /**
   * Debug route transitions (development only)
   * Logs route changes to console for debugging navigation flows
   */
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const route = nav.currentRoute;
      const timestamp = new Date().toISOString().split('T')[1].slice(0, -1);

      if ('params' in route && route.params) {
        console.log(
          `[${timestamp}] Route: ${route.name} | Params:`,
          route.params
        );
      } else {
        console.log(`[${timestamp}] Route: ${route.name}`);
      }
    }
  }, [nav.currentRoute]);

  /**
   * Helper to render address-related routes with KeystoreView wrapper
   * Reduces code duplication across ADDRESS_NEW, ADDRESS_VANITY, ADDRESS_IMPORT, etc.
   */
  const renderAddressRoute = (content: React.ReactNode) => {
    if (!selectedKeystore) return null;

    return (
      <KeystoreView
        selectedKeystore={selectedKeystore}
        isAddingAddress={true}
        handleBackClick={nav.goBack}
        renderAddAddressContent={() => content}
        handleViewPrivateKey={handleViewPrivateKey}
        handleDeleteAddress={handleDeleteAddress}
      />
    );
  };

  // New router-based rendering
  const renderRouterView = () => {
    const route = nav.currentRoute;

    switch (route.name) {
      case ROUTES.ONBOARDING_WELCOME:
        return <WelcomeScreen />;

      case ROUTES.KEYSTORE_LIST:
        // Show empty state if no keystores exist
        if (keystores.length === 0) {
          return (
            <EmptyKeystoreScreen
              onCreateWorkspace={() => nav.navigate({ name: ROUTES.GROUP_CREATE })}
            />
          );
        }
        return (
          <KeystoreList
            keystores={keystores}
            handleKeystoreClick={handleKeystoreClick}
            isAddingGroup={isAddingGroup}
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            handleAddGroup={handleAddGroup}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.GROUP_CREATE:
        return (
          <KeystoreList
            keystores={keystores}
            handleKeystoreClick={handleKeystoreClick}
            isAddingGroup={true}
            newGroupName={newGroupName}
            setNewGroupName={setNewGroupName}
            handleAddGroup={handleAddGroup}
            handleBackClick={() => {
              // Reset state and go back to previous route
              setIsAddingGroup(false);
              setNewGroupName('');
              nav.goBack();
            }}
          />
        );

      case ROUTES.KEYSTORE_VIEW:
        if (!selectedKeystore) return null;
        return (
          <KeystoreView
            selectedKeystore={selectedKeystore}
            isAddingAddress={false}
            handleBackClick={nav.goBack}
            renderAddAddressContent={() => null}
            handleViewPrivateKey={handleViewPrivateKey}
            handleDeleteAddress={handleDeleteAddress}
            addAddressStep={addAddressStep}
          />
        );

      case ROUTES.ADDRESS_SELECT_TYPE:
        return renderAddressRoute(
          <SelectAddressType
            setAddAddressStep={(step) => {
              const keystoreId =
                routeParams?.keystoreId || selectedKeystore?.name;
              if (!keystoreId) {
                console.error('No keystoreId available for navigation');
                return;
              }
              if (step === 'new') nav.toAddressNew(keystoreId);
              else if (step === 'vanity') nav.toAddressVanity(keystoreId);
              else if (step === 'import-options') nav.toAddressImportOptions(keystoreId);
            }}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.ADDRESS_NEW:
        return renderAddressRoute(
          <NewAddressForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.ADDRESS_VANITY:
        return renderAddressRoute(
          <VanityAddressForm
            vanityOptions={vanityOptions}
            setVanityOptions={setVanityOptions}
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.ADDRESS_IMPORT_OPTIONS:
        return renderAddressRoute(
          <ImportOptions
            onImportPrivateKey={() => {
              const keystoreId = routeParams?.keystoreId || selectedKeystore?.name;
              if (keystoreId) nav.toAddressImport(keystoreId);
            }}
            onImportKeystore={() => {
              const keystoreId = routeParams?.keystoreId || selectedKeystore?.name;
              if (keystoreId) nav.toAddressSelectKeystore(keystoreId);
            }}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.ADDRESS_IMPORT:
        return renderAddressRoute(
          <ImportAddressForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleAddAddress}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.ADDRESS_SELECT_KEYSTORE:
        return renderAddressRoute(
          <KeystoreSelect
            onKeystoreSelect={(keystoreName: string) => {
              setNewAddress((prev) => ({ ...prev, label: keystoreName }));
              const keystoreId = routeParams?.keystoreId || selectedKeystore?.name;
              if (keystoreId) nav.toAddressImportKeystore(keystoreId);
            }}
            existingAddresses={getAllAddressLabels()}
            loadAvailableKeystores={loadAvailableKeystores}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.ADDRESS_IMPORT_KEYSTORE:
        return renderAddressRoute(
          <ImportKeystoreForm
            newAddress={newAddress}
            setNewAddress={setNewAddress}
            handleAddAddress={handleImportKeystoreAddress}
            validateKeystorePassword={validateKeystorePassword}
            handleBackClick={nav.goBack}
          />
        );

      default:
        return null;
    }
  };

  return (
    <main className="bg-[#0d0f1a] text-foreground shadow-2xl rounded-md overflow-hidden flex flex-col w-[350px] h-[400px] border border-white/5">
      <Header />
      <ScrollArea className="flex-grow">
        <RouteErrorBoundary>{renderRouterView()}</RouteErrorBoundary>
      </ScrollArea>
      {!shouldHideFooter() && (
        <Footer
          isAddingGroup={isAddingGroup}
          selectedKeystore={selectedKeystore}
          setIsAddingGroup={setIsAddingGroup}
        />
      )}
      <PasswordDialog
        isOpen={isPasswordDialogOpen}
        setIsOpen={setIsPasswordDialogOpen}
        handlePasswordSubmit={handlePasswordSubmit}
        privateKey={privateKey}
        privateKeyError={privateKeyError}
      />
    </main>
  );
}
