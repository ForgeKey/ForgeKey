import { ScrollArea } from '@/components/ui/scroll-area';
import { useEffect, Component, ReactNode } from 'react';

import { Header } from '@/components/core/header';
import { Footer } from '@/components/core/footer';
import { KeystoreList } from '@/components/core/keystore-list';
import { KeystoreView } from '@/components/core/keystore-view';
import { PasswordDialog } from '@/components/core/password-dialog';
import { NewAddressForm } from '@/components/core/address/new-address-form';
import { SelectAddressType } from '@/components/core/address/select-address-type';
import { VanityAddressForm } from '@/components/core/address/vanity-address-form';
import { ImportAddressForm } from '@/components/core/address/import-address-form';
import { ImportOptionsDialog } from '@/components/core/address/import-options-dialog';
import { KeystoreSelect } from '@/components/core/address/keystore-select';
import { ImportKeystoreForm } from '@/components/core/address/import-keystore-form';

import { useWalletState } from '@/hooks/wallet/use-wallet-state';
import { useWalletAddressManagement } from '@/hooks/wallet/use-wallet-address-management';
import { useWalletNavigation } from '@/hooks/wallet/use-wallet-navigation';
import { useWalletSync } from '@/hooks/wallet/use-wallet-sync';
import { useNavigation, useRouteParams } from '@/hooks/router/use-navigation';
import { useRouterSync } from '@/hooks/router/use-router-sync';
import { useRouteHelpers } from '@/hooks/router/use-route-helpers';
import { useAddressFormCleanup } from '@/hooks/router/use-address-form-cleanup';
import { useImportDialog } from '@/hooks/address/use-import-dialog';
import { useAddressNavigationHandlers } from '@/hooks/address/use-address-navigation-handlers';
import { ROUTES } from '@/router/types';

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
  const { states, setters, actions } = useWalletState();
  const nav = useNavigation();
  const routeParams = useRouteParams<{ keystoreId: string }>();

  // Router state synchronization
  useRouterSync(states, setters);

  // Form cleanup when leaving address routes
  useAddressFormCleanup(setters);

  // Domain-specific hooks
  const {
    handleAddAddress: handleAddAddressOriginal,
    handleImportKeystoreAddress: handleImportKeystoreAddressOriginal,
    handleDeleteAddress,
    validateKeystorePassword,
    handleViewPrivateKey,
    handlePasswordSubmit,
  } = useWalletAddressManagement(states, setters, actions);

  const { handleKeystoreClick, handleAddGroup } = useWalletNavigation(
    states,
    setters,
    actions
  );

  const { loadAvailableKeystores } = useWalletSync();

  // Route helper functions
  const { getKeystoreId, getAllAddressLabels, shouldHideFooter } =
    useRouteHelpers(states);

  // Navigation wrappers for address handlers
  const { handleAddAddress, handleImportKeystoreAddress } =
    useAddressNavigationHandlers(
      states,
      handleAddAddressOriginal,
      handleImportKeystoreAddressOriginal
    );

  // Import dialog management
  const {
    isImportOptionsOpen,
    setIsImportOptionsOpen,
    handleImportClick,
    handleImportPrivateKey,
    handleShowKeystoreSelect,
    handleKeystoreSelect,
  } = useImportDialog(states, setters, getKeystoreId);

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
  const renderAddressRoute = (
    content: React.ReactNode,
    addAddressStep:
      | 'new'
      | 'vanity'
      | 'import'
      | 'select'
      | 'select-keystore'
      | 'import-keystore'
  ) => {
    if (!states.selectedKeystore) return null;

    return (
      <KeystoreView
        selectedKeystore={states.selectedKeystore}
        isAddingAddress={true}
        handleBackClick={nav.goBack}
        renderAddAddressContent={() => content}
        handleViewPrivateKey={handleViewPrivateKey}
        handleDeleteAddress={handleDeleteAddress}
        addAddressStep={addAddressStep}
      />
    );
  };

  // New router-based rendering
  const renderRouterView = () => {
    const route = nav.currentRoute;

    switch (route.name) {
      case ROUTES.KEYSTORE_LIST:
        return (
          <KeystoreList
            keystores={states.keystores}
            handleKeystoreClick={handleKeystoreClick}
            isAddingGroup={states.isAddingGroup}
            newGroupName={states.newGroupName}
            setNewGroupName={setters.setNewGroupName}
            handleAddGroup={handleAddGroup}
            handleBackClick={nav.goBack}
          />
        );

      case ROUTES.GROUP_CREATE:
        return (
          <KeystoreList
            keystores={states.keystores}
            handleKeystoreClick={handleKeystoreClick}
            isAddingGroup={true}
            newGroupName={states.newGroupName}
            setNewGroupName={setters.setNewGroupName}
            handleAddGroup={handleAddGroup}
            handleBackClick={() => {
              // Reset state and navigate to list
              setters.setIsAddingGroup(false);
              setters.setNewGroupName('');
              nav.toKeystoreList();
            }}
          />
        );

      case ROUTES.KEYSTORE_VIEW:
        if (!states.selectedKeystore) return null;
        return (
          <KeystoreView
            selectedKeystore={states.selectedKeystore}
            isAddingAddress={false}
            handleBackClick={nav.goBack}
            renderAddAddressContent={() => null}
            handleViewPrivateKey={handleViewPrivateKey}
            handleDeleteAddress={handleDeleteAddress}
            addAddressStep={states.addAddressStep}
          />
        );

      case ROUTES.ADDRESS_SELECT_TYPE:
        return renderAddressRoute(
          <SelectAddressType
            setAddAddressStep={(step) => {
              const keystoreId =
                routeParams?.keystoreId || states.selectedKeystore?.name;
              if (!keystoreId) {
                console.error('No keystoreId available for navigation');
                return;
              }
              if (step === 'new') nav.toAddressNew(keystoreId);
              else if (step === 'vanity') nav.toAddressVanity(keystoreId);
              else if (step === 'import') nav.toAddressImport(keystoreId);
            }}
            onImportClick={handleImportClick}
            handleBackClick={nav.goBack}
          />,
          'select'
        );

      case ROUTES.ADDRESS_NEW:
        return renderAddressRoute(
          <NewAddressForm
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handleAddAddress}
            handleBackClick={nav.goBack}
          />,
          'new'
        );

      case ROUTES.ADDRESS_VANITY:
        return renderAddressRoute(
          <VanityAddressForm
            vanityOptions={states.vanityOptions}
            setVanityOptions={setters.setVanityOptions}
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handleAddAddress}
            handleBackClick={nav.goBack}
          />,
          'vanity'
        );

      case ROUTES.ADDRESS_IMPORT:
        return renderAddressRoute(
          <ImportAddressForm
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handleAddAddress}
            handleBackClick={nav.goBack}
          />,
          'import'
        );

      case ROUTES.ADDRESS_SELECT_KEYSTORE:
        return renderAddressRoute(
          <KeystoreSelect
            onKeystoreSelect={handleKeystoreSelect}
            existingAddresses={getAllAddressLabels()}
            loadAvailableKeystores={loadAvailableKeystores}
            handleBackClick={nav.goBack}
          />,
          'select-keystore'
        );

      case ROUTES.ADDRESS_IMPORT_KEYSTORE:
        return renderAddressRoute(
          <ImportKeystoreForm
            newAddress={states.newAddress}
            setNewAddress={setters.setNewAddress}
            handleAddAddress={handleImportKeystoreAddress}
            validateKeystorePassword={validateKeystorePassword}
            handleBackClick={nav.goBack}
          />,
          'import-keystore'
        );

      default:
        return null;
    }
  };

  return (
    <main className="bg-[rgba(18,18,18,0.7)] backdrop-blur-md backdrop-filter bg-gradient-to-br from-purple-900/20 to-pink-900/20 text-foreground shadow-lg rounded-lg overflow-hidden flex flex-col w-[450px] h-[450px] border border-white/5">
      <Header />
      <ScrollArea className="flex-grow">
        <RouteErrorBoundary>{renderRouterView()}</RouteErrorBoundary>
      </ScrollArea>
      {!shouldHideFooter() && (
        <Footer
          isAddingGroup={states.isAddingGroup}
          selectedKeystore={states.selectedKeystore}
          setIsAddingGroup={setters.setIsAddingGroup}
        />
      )}
      <PasswordDialog
        isOpen={states.isPasswordDialogOpen}
        setIsOpen={setters.setIsPasswordDialogOpen}
        handlePasswordSubmit={handlePasswordSubmit}
        privateKey={states.privateKey}
        privateKeyError={states.privateKeyError}
        password={states.password}
        setPassword={setters.setPassword}
      />
      <ImportOptionsDialog
        isOpen={isImportOptionsOpen}
        setIsOpen={setIsImportOptionsOpen}
        onImportPrivateKey={handleImportPrivateKey}
        onImportKeystore={handleShowKeystoreSelect}
      />
    </main>
  );
}
