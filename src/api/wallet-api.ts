import { invoke } from '@tauri-apps/api/core';
import { VanityOpts } from '@/types/address';
import { ZeroizedString } from '@/utils/zeroize';

/**
 * Wallet API - Centralizes all Tauri invoke calls related to wallet functionality
 */
export const walletApi = {
  /**
   * Creates a new wallet with the given label and password
   * @param addressLabel The label for the new wallet address
   * @param password A ZeroizedString containing the password
   */
  createNewWallet: async (
    addressLabel: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use(async (securePassword) => {
        const result = await invoke<string>('create_new_wallet', {
          address_label: addressLabel,
          password: securePassword,
        });
        return result;
      });
    } finally {
      // Explicitly zeroize the password after use
      password.zeroize();
    }
  },

  /**
   * Creates a vanity wallet with the given options
   * @param vanityOpts Options for the vanity address
   * @param password A ZeroizedString containing the password
   */
  createVanityWallet: async (
    vanityOpts: Omit<VanityOpts, 'password'>,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use(async (securePassword) => {
        const result = await invoke<string>('create_vanity_wallet', {
          ...vanityOpts,
          password: securePassword,
        });
        return result;
      });
    } finally {
      // Explicitly zeroize the password after use
      password.zeroize();
    }
  },

  /**
   * Imports a wallet from a private key
   * @param privateKey The private key as a ZeroizedString
   * @param addressLabel The label for the imported wallet address
   * @param password A ZeroizedString containing the password
   */
  importPrivateKey: async (
    privateKey: ZeroizedString,
    addressLabel: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await privateKey.use(async (securePrivateKey) => {
        return await password.use(async (securePassword) => {
          const result = await invoke<string>('import_private_key', {
            private_key: securePrivateKey,
            address_label: addressLabel,
            password: securePassword,
          });
          return result;
        });
      });
    } finally {
      // Explicitly zeroize both the private key and password after use
      privateKey.zeroize();
      password.zeroize();
    }
  },

  /**
   * Gets a wallet address from a keystore using the password
   * @param keystoreName The name of the keystore file
   * @param password A ZeroizedString containing the password
   */
  getWalletAddress: async (
    keystoreName: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use(async (securePassword) => {
        const result = await invoke<string>('get_wallet_address', {
          keystore_name: keystoreName,
          password: securePassword,
        });
        return result;
      });
    } finally {
      // Explicitly zeroize the password after use
      password.zeroize();
    }
  },

  /**
   * Removes a keystore file
   * @param keystoreName The name of the keystore file to remove
   */
  removeKeystore: async (keystoreName: string): Promise<void> => {
    await invoke('remove_keystore', {
      keystore_name: keystoreName,
    });
  },

  /**
   * Decrypts a keystore to get the private key
   * @param keystoreName The name of the keystore file
   * @param password A ZeroizedString containing the password
   */
  decryptKeystore: async (
    keystoreName: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use(async (securePassword) => {
        const result = await invoke<string>('decrypt_keystore', {
          keystore_name: keystoreName,
          password: securePassword,
        });
        return result;
      });
    } finally {
      // Explicitly zeroize the password after use
      password.zeroize();
    }
  },

  /**
   * Lists all available wallets
   */
  listWallets: async (): Promise<string[]> => {
    return await invoke<string[]>('list_wallets');
  },
};
