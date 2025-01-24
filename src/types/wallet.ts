import { Address, Keystore, VanityOpts } from '@/types/address';
import { Dispatch, SetStateAction } from 'react';

export interface WalletStates {
  keystoreFolder: string;
  selectedKeystore: Keystore | null;
  isAddingAddress: boolean;
  addAddressStep: 'select' | 'new' | 'vanity' | 'import';
  newAddress: Address;
  vanityOptions: VanityOpts;
  isAddingKeystore: boolean;
  newKeystoreName: string;
  password: string;
  isPasswordDialogOpen: boolean;
  selectedAddressForPrivateKey: Address | null;
  isSettingsOpen: boolean;
  keystores: Keystore[];
}

export interface WalletSetters {
  setKeystoreFolder: (value: string) => void;
  setSelectedKeystore: (
    value: Keystore | null | ((prev: Keystore | null) => Keystore | null)
  ) => void;
  setIsAddingAddress: (value: boolean) => void;
  setAddAddressStep: (value: 'select' | 'new' | 'vanity' | 'import') => void;
  setNewAddress: Dispatch<SetStateAction<Address>>;
  setVanityOptions: Dispatch<SetStateAction<VanityOpts>>;
  setIsAddingKeystore: (value: boolean) => void;
  setNewKeystoreName: (value: string) => void;
  setPassword: (value: string) => void;
  setIsPasswordDialogOpen: (value: boolean) => void;
  setSelectedAddressForPrivateKey: Dispatch<SetStateAction<Address | null>>;
  setIsSettingsOpen: (value: boolean) => void;
}

export interface WalletActions {
  addKeystore: (name: string) => void;
  addAddress: (keystoreName: string, address: Address) => void;
}
