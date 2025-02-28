import { Address, Keystore, VanityOpts } from '@/types/address';
import { Dispatch, SetStateAction } from 'react';
import { ZeroizedString } from '@/lib/zeroized-string';

export interface WalletStates {
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
  keystores: Keystore[];
  privateKey: ZeroizedString | null;
  privateKeyError: string;
  password: ZeroizedString | null;
}

export interface WalletSetters {
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
  setNewAddress: Dispatch<SetStateAction<Address>>;
  setVanityOptions: Dispatch<SetStateAction<VanityOpts>>;
  setIsAddingGroup: (value: boolean) => void;
  setNewGroupName: (value: string) => void;
  setIsPasswordDialogOpen: (value: boolean) => void;
  setSelectedAddressForPrivateKey: Dispatch<SetStateAction<Address | null>>;
  setPrivateKey: (value: ZeroizedString | null) => void;
  setPrivateKeyError: (value: string) => void;
  setPassword: (value: string | null) => void;
}

export interface WalletActions {
  addGroup: (name: string) => void;
  addAddress: (groupName: string, address: Address) => void;
  removeAddress: (groupName: string, address: Address) => void;
}
