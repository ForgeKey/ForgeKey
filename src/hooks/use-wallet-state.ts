import { useState, useEffect } from 'react';
import { Address, VanityOpts, Keystore } from '@/types/address';
import { useKeystore } from '@/contexts/keystore-context';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';
import { ZeroizedString } from '@/utils/zeroize';

export function useWalletState() {
  const { keystores, addGroup, addAddress, removeAddress } = useKeystore();

  const [selectedKeystore, setSelectedKeystore] = useState<Keystore | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressStep, setAddAddressStep] = useState<
    | 'select'
    | 'new'
    | 'vanity'
    | 'import'
    | 'select-keystore'
    | 'import-keystore'
  >('select');
  const [newAddress, setNewAddress] = useState<Address>({
    label: '',
    address: '',
    privateKey: undefined,
  });
  const [vanityOptions, setVanityOptions] = useState<VanityOpts>({
    starts_with: undefined,
    ends_with: undefined,
    address_label: '',
  });
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isPasswordDialogOpen, _setIsPasswordDialogOpen] = useState(false);
  const [selectedAddressForPrivateKey, setSelectedAddressForPrivateKey] =
    useState<Address | null>(null);
  const [privateKey, setPrivateKey] = useState<ZeroizedString | null>(null);
  const [privateKeyError, setPrivateKeyError] = useState('');
  const [password, _setPassword] = useState<ZeroizedString | null>(null);

  useEffect(() => {
    if (isPasswordDialogOpen) {
      setPrivateKey(null);
      handlePasswordChange(null);
      setPrivateKeyError('');
    }
  }, [isPasswordDialogOpen]);

  const setIsPasswordDialogOpen = (open: boolean) => {
    _setIsPasswordDialogOpen(open);

    if (!open) {
      if (privateKey) {
        privateKey.zeroize();
      }
      if (password) {
        password.zeroize();
      }
      setPrivateKey(null);
      handlePasswordChange(null);
    }
  };

  const handlePasswordChange = (value: string | null) => {
    // Clean up previous password if it exists
    if (password) {
      password.zeroize();
    }

    if (!value) {
      _setPassword(null);
    } else {
      _setPassword(new ZeroizedString(value));
    }
  };

  const states: WalletStates = {
    selectedKeystore,
    isAddingAddress,
    addAddressStep,
    newAddress,
    vanityOptions,
    isAddingGroup,
    newGroupName,
    isPasswordDialogOpen,
    selectedAddressForPrivateKey,
    keystores,
    privateKey,
    privateKeyError,
    password,
  };

  const setters: WalletSetters = {
    setSelectedKeystore,
    setIsAddingAddress,
    setAddAddressStep,
    setNewAddress,
    setVanityOptions,
    setIsAddingGroup,
    setNewGroupName,
    setIsPasswordDialogOpen,
    setSelectedAddressForPrivateKey,
    setPrivateKey,
    setPrivateKeyError,
    setPassword: handlePasswordChange,
  };

  const actions: WalletActions = {
    addGroup,
    addAddress,
    removeAddress,
  };

  return { states, setters, actions };
}
