import { useState } from 'react';
import { Address, VanityOpts, Keystore } from '@/types/address';
import { useKeystore } from '@/contexts/keystore-context';
import { WalletStates, WalletSetters, WalletActions } from '@/types/wallet';

export function useWalletState() {
  const { keystores, addKeystore, addAddress } = useKeystore();

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
  const [isAddingKeystore, setIsAddingKeystore] = useState(false);
  const [newKeystoreName, setNewKeystoreName] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [selectedAddressForPrivateKey, setSelectedAddressForPrivateKey] =
    useState<Address | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const states: WalletStates = {
    keystoreFolder,
    selectedKeystore,
    isAddingAddress,
    addAddressStep,
    newAddress,
    vanityOptions,
    isAddingKeystore,
    newKeystoreName,
    password,
    isPasswordDialogOpen,
    selectedAddressForPrivateKey,
    isSettingsOpen,
    keystores,
  };

  const setters: WalletSetters = {
    setKeystoreFolder,
    setSelectedKeystore,
    setIsAddingAddress,
    setAddAddressStep,
    setNewAddress,
    setVanityOptions,
    setIsAddingKeystore,
    setNewKeystoreName,
    setPassword,
    setIsPasswordDialogOpen,
    setSelectedAddressForPrivateKey,
    setIsSettingsOpen,
  };

  const actions: WalletActions = {
    addKeystore,
    addAddress,
  };

  return { states, setters, actions };
}
