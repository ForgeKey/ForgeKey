import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { Address, Keystore, VanityOpts } from '@/types/address';
import { ZeroizedString } from '@/lib/zeroized-string';

/**
 * Wallet store state interface
 */
export interface WalletStore {
  // State
  isInitialized: boolean;
  keystores: Keystore[];
  selectedKeystore: Keystore | null;
  isAddingAddress: boolean;
  addAddressStep:
    | 'select'
    | 'new'
    | 'vanity'
    | 'import'
    | 'select-keystore'
    | 'import-keystore';
  newAddress: Address;
  vanityOptions: VanityOpts;
  isAddingGroup: boolean;
  newGroupName: string;
  isPasswordDialogOpen: boolean;
  selectedAddressForPrivateKey: Address | null;
  privateKey: ZeroizedString | null;
  privateKeyError: string;
  password: ZeroizedString | null;

  // Simple setters
  setIsInitialized: (value: boolean) => void;
  setKeystores: (keystores: Keystore[]) => void;
  setSelectedKeystore: (
    value: Keystore | null | ((prev: Keystore | null) => Keystore | null)
  ) => void;
  setIsAddingAddress: (value: boolean) => void;
  setAddAddressStep: (
    value:
      | 'select'
      | 'new'
      | 'vanity'
      | 'import'
      | 'select-keystore'
      | 'import-keystore'
  ) => void;
  setNewAddress: (value: Address | ((prev: Address) => Address)) => void;
  setVanityOptions: (
    value: VanityOpts | ((prev: VanityOpts) => VanityOpts)
  ) => void;
  setIsAddingGroup: (value: boolean) => void;
  setNewGroupName: (value: string) => void;
  setSelectedAddressForPrivateKey: (
    value: Address | null | ((prev: Address | null) => Address | null)
  ) => void;
  setPrivateKey: (value: ZeroizedString | null) => void;
  setPrivateKeyError: (value: string) => void;

  // Complex setters with side effects
  setIsPasswordDialogOpen: (value: boolean) => void;
  setPassword: (value: string | null) => void;

  // Domain actions
  addGroup: (name: string) => void;
  addAddress: (groupName: string, address: Address) => void;
  removeAddress: (groupName: string, address: Address) => void;

  // Utility actions
  resetAddressForm: () => void;
}

/**
 * Initial state values
 */
const initialState = {
  isInitialized: false,
  keystores: [],
  selectedKeystore: null,
  isAddingAddress: false,
  addAddressStep: 'select' as const,
  newAddress: { label: '', address: '', privateKey: undefined },
  vanityOptions: {
    starts_with: undefined,
    ends_with: undefined,
    address_label: '',
  },
  isAddingGroup: false,
  newGroupName: '',
  isPasswordDialogOpen: false,
  selectedAddressForPrivateKey: null,
  privateKey: null,
  privateKeyError: '',
  password: null,
};

/**
 * Wallet store with Zustand
 * Manages all wallet state including keystores, addresses, and UI state
 */
export const useWalletStore = create<WalletStore>()(
  devtools(
    persist(
      immer((set, get) => ({
        ...initialState,

        // Simple setters
        setIsInitialized: (value) =>
          set({ isInitialized: value }, false, 'setIsInitialized'),

        setKeystores: (keystores) => set({ keystores }, false, 'setKeystores'),

        setSelectedKeystore: (value) =>
          set(
            (state) => {
              // Type casting needed due to Immer's WritableDraft wrapper
              const newValue =
                typeof value === 'function'
                  ? value(state.selectedKeystore as Keystore | null)
                  : value;
              state.selectedKeystore = newValue as Keystore | null;
            },
            false,
            'setSelectedKeystore'
          ),

        setIsAddingAddress: (value) =>
          set({ isAddingAddress: value }, false, 'setIsAddingAddress'),

        setAddAddressStep: (value) =>
          set({ addAddressStep: value }, false, 'setAddAddressStep'),

        setNewAddress: (value) => {
          const currentAddress = get().newAddress;
          const newValue =
            typeof value === 'function'
              ? value(currentAddress as Address)
              : value;

          // Zeroize when sensitive data is being cleared (set to undefined/null).
          // When replacing with a new value, the caller zeroizes the old value first.
          if (currentAddress.privateKey && !newValue.privateKey) {
            currentAddress.privateKey.zeroize();
          }
          if (currentAddress.password && !newValue.password) {
            currentAddress.password.zeroize();
          }

          set({ newAddress: newValue as Address }, false, 'setNewAddress');
        },

        setVanityOptions: (value) =>
          set(
            (state) => {
              const newValue =
                typeof value === 'function'
                  ? value(state.vanityOptions as VanityOpts)
                  : value;
              state.vanityOptions = newValue as VanityOpts;
            },
            false,
            'setVanityOptions'
          ),

        setIsAddingGroup: (value) =>
          set({ isAddingGroup: value }, false, 'setIsAddingGroup'),

        setNewGroupName: (value) =>
          set({ newGroupName: value }, false, 'setNewGroupName'),

        setSelectedAddressForPrivateKey: (value) =>
          set(
            (state) => {
              const newValue =
                typeof value === 'function'
                  ? value(state.selectedAddressForPrivateKey as Address | null)
                  : value;
              state.selectedAddressForPrivateKey = newValue as Address | null;
            },
            false,
            'setSelectedAddressForPrivateKey'
          ),

        setPrivateKey: (value) =>
          set({ privateKey: value }, false, 'setPrivateKey'),

        setPrivateKeyError: (value) =>
          set({ privateKeyError: value }, false, 'setPrivateKeyError'),

        // Complex setters with side effects
        setIsPasswordDialogOpen: (open) => {
          const state = get();
          if (!open) {
            // Cleanup sensitive data when closing dialog
            state.privateKey?.zeroize();
            state.password?.zeroize();
            set(
              {
                isPasswordDialogOpen: false,
                privateKey: null,
                password: null,
                privateKeyError: '',
              },
              false,
              'setIsPasswordDialogOpen:close'
            );
          } else {
            set(
              { isPasswordDialogOpen: true },
              false,
              'setIsPasswordDialogOpen:open'
            );
          }
        },

        setPassword: (value) => {
          const currentPassword = get().password;
          // Zeroize the current password before replacing it
          currentPassword?.zeroize();

          const newPassword = value ? new ZeroizedString(value) : null;
          set({ password: newPassword }, false, 'setPassword');
        },

        // Domain actions
        addGroup: (name) =>
          set(
            (state) => {
              state.keystores.push({ name, addresses: [] });
            },
            false,
            'addGroup'
          ),

        addAddress: (groupName, address) =>
          set(
            (state) => {
              const keystore = state.keystores.find(
                (k) => k.name === groupName
              );
              if (keystore) {
                // Immer allows direct mutation
                keystore.addresses.push(address);
              }
            },
            false,
            'addAddress'
          ),

        removeAddress: (groupName, address) =>
          set(
            (state) => {
              const keystore = state.keystores.find(
                (k) => k.name === groupName
              );
              if (keystore) {
                // Immer allows direct assignment
                keystore.addresses = keystore.addresses.filter(
                  (a) =>
                    a.address.toLowerCase() !== address.address.toLowerCase()
                );
              }
            },
            false,
            'removeAddress'
          ),

        // Utility actions
        resetAddressForm: () => {
          const currentAddress = get().newAddress;
          // Zeroize sensitive data before resetting
          currentAddress.privateKey?.zeroize();
          currentAddress.password?.zeroize();

          set(
            {
              newAddress: { label: '', address: '', privateKey: undefined },
              vanityOptions: {
                starts_with: undefined,
                ends_with: undefined,
                address_label: '',
              },
              isAddingAddress: false,
              addAddressStep: 'select',
            },
            false,
            'resetAddressForm'
          );
        },
      })),
      {
        name: 'wallet-storage',
        partialize: (state) => ({
          // Only persist keystores, not UI state or sensitive data
          keystores: state.keystores,
        }),
      }
    )
  )
);
