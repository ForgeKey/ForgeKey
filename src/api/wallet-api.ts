import { invoke } from '@tauri-apps/api/core';
import { VanityOpts } from '@/types/address';

/**
 * Wallet API - Centralizes all Tauri invoke calls related to wallet functionality
 */
export const walletApi = {
  /**
   * Creates a new wallet with the given label and password
   */
  createNewWallet: async (
    addressLabel: string,
    password: string
  ): Promise<string> => {
    return await invoke('create_new_wallet', {
      address_label: addressLabel,
      password: password,
    });
  },

  /**
   * Creates a vanity wallet with the given options
   */
  createVanityWallet: async (vanityOpts: VanityOpts): Promise<string> => {
    return await invoke('create_vanity_wallet', vanityOpts);
  },

  /**
   * Imports a wallet from a private key
   */
  importPrivateKey: async (
    privateKey: string,
    addressLabel: string,
    password: string
  ): Promise<string> => {
    return await invoke('import_private_key', {
      private_key: privateKey,
      address_label: addressLabel,
      password: password,
    });
  },

  /**
   * Gets a wallet address from a keystore using the password
   */
  getWalletAddress: async (
    keystoreName: string,
    password: string
  ): Promise<string> => {
    return await invoke('get_wallet_address', {
      keystore_name: keystoreName,
      password: password,
    });
  },

  /**
   * Removes a keystore file
   */
  removeKeystore: async (keystoreName: string): Promise<void> => {
    await invoke('remove_keystore', {
      keystore_name: keystoreName,
    });
  },

  /**
   * Decrypts a keystore to get the private key
   */
  decryptKeystore: async (
    keystoreName: string,
    password: string
  ): Promise<string> => {
    return await invoke('decrypt_keystore', {
      keystore_name: keystoreName,
      password: password,
    });
  },

  /**
   * Lists all available wallets
   */
  listWallets: async (): Promise<string[]> => {
    return await invoke('list_wallets');
  },
};
