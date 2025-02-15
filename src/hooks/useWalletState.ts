import { useState, useEffect } from 'react';
import { Address, VanityOpts, Keystore } from '@/types/address';
import { useKeystore } from '@/contexts/keystore-context';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';

export function useWalletState() {
  const { keystores, addGroup, addAddress } = useKeystore();

  const [keystoreFolder, setKeystoreFolder] = useState('');
  const [selectedKeystore, setSelectedKeystore] = useState<Keystore | null>(
    null
  );
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [addAddressStep, setAddAddressStep] = useState<
    'select' | 'new' | 'vanity' | 'import'
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
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
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
    keystoreFolder,
    selectedKeystore,
    isAddingAddress,
    addAddressStep,
    newAddress,
    vanityOptions,
    isAddingGroup,
    newGroupName,
    isPasswordDialogOpen,
    selectedAddressForPrivateKey,
    isSettingsOpen,
    keystores,
    privateKey,
    privateKeyError,
    password,
  };

  const setters: WalletSetters = {
    setKeystoreFolder,
    setSelectedKeystore,
    setIsAddingAddress,
    setAddAddressStep,
    setNewAddress,
    setVanityOptions,
    setIsAddingGroup,
    setNewGroupName,
    setIsPasswordDialogOpen,
    setSelectedAddressForPrivateKey,
    setIsSettingsOpen,
    setPrivateKey,
    setPrivateKeyError,
    setPassword,
  };

  const actions: WalletActions = {
    addGroup,
    addAddress,
  };

  return { states, setters, actions };
}
