import { Address, Keystore, VanityOpts } from '@/types/address';
import { Dispatch, SetStateAction } from 'react';

export interface WalletStates {
  keystoreFolder: string;
  selectedKeystore: Keystore | null;
  isAddingAddress: boolean;
  addAddressStep: 'select' | 'new' | 'vanity' | 'import';
  newAddress: Address;
  vanityOptions: VanityOpts;
  isAddingGroup: boolean;
  newGroupName: string;
  isPasswordDialogOpen: boolean;
  selectedAddressForPrivateKey: Address | null;
  isSettingsOpen: boolean;
  keystores: Keystore[];
  privateKey: string;
  privateKeyError: string;
  password: string;
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
  setIsAddingGroup: (value: boolean) => void;
  setNewGroupName: (value: string) => void;
  setIsPasswordDialogOpen: (value: boolean) => void;
  setSelectedAddressForPrivateKey: Dispatch<SetStateAction<Address | null>>;
  setIsSettingsOpen: (value: boolean) => void;
  setPrivateKey: (value: string) => void;
  setPrivateKeyError: (value: string) => void;
  setPassword: (value: string) => void;
}

export interface WalletActions {
  addGroup: (name: string) => void;
  addAddress: (groupName: string, address: Address) => void;
}
