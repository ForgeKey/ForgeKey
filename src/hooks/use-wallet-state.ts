import { useState, useEffect } from 'react';
import { Address, VanityOpts, Keystore } from '@/types/address';
import { useKeystore } from '@/contexts/keystore-context';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';

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
    password: '',
    privateKey: undefined,
  });
  const [vanityOptions, setVanityOptions] = useState<VanityOpts>({
    starts_with: undefined,
    ends_with: undefined,
    address_label: '',
    password: '',
  });
  const [isAddingGroup, setIsAddingGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [isPasswordDialogOpen, _setIsPasswordDialogOpen] = useState(false);
  const [selectedAddressForPrivateKey, setSelectedAddressForPrivateKey] =
    useState<Address | null>(null);
  const [privateKey, setPrivateKey] = useState('');
  const [privateKeyError, setPrivateKeyError] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isPasswordDialogOpen) {
      setPrivateKey('');
      setPassword('');
      setPrivateKeyError('');
    }
  }, [isPasswordDialogOpen]);

  const setIsPasswordDialogOpen = (open: boolean) => {
    _setIsPasswordDialogOpen(open);

    if (!open) {
      setPrivateKey('');
      setPassword('');
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
    setPassword,
  };

  const actions: WalletActions = {
    addGroup,
    addAddress,
    removeAddress,
  };

  return { states, setters, actions };
}
