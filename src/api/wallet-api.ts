import { invoke } from '@tauri-apps/api/core';
import { VanityOpts } from '@/types/address';
import { ZeroizedString } from '@/lib/zeroized-string';

/**
 * Wallet API - Centralizes all Tauri invoke calls related to wallet functionality.
 * All methods that accept ZeroizedString will zeroize them in their finally blocks.
 */
export const walletApi = {
  createNewWallet: async (
    addressLabel: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use((securePassword) =>
        invoke<string>('create_new_wallet', {
          address_label: addressLabel,
          password: securePassword,
        })
      );
    } finally {
      password.zeroize();
    }
  },

  createVanityWallet: async (
    vanityOpts: Omit<VanityOpts, 'password'>,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use((securePassword) =>
        invoke<string>('create_vanity_wallet', {
          ...vanityOpts,
          password: securePassword,
        })
      );
    } finally {
      password.zeroize();
    }
  },

  cancelVanityWallet: async (): Promise<void> => {
    await invoke('cancel_vanity_wallet');
  },

  importPrivateKey: async (
    privateKey: ZeroizedString,
    addressLabel: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await privateKey.use((securePrivateKey) =>
        password.use((securePassword) =>
          invoke<string>('import_private_key', {
            private_key: securePrivateKey,
            address_label: addressLabel,
            password: securePassword,
          })
        )
      );
    } finally {
      privateKey.zeroize();
      password.zeroize();
    }
  },

  getWalletAddress: async (
    keystoreName: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use((securePassword) =>
        invoke<string>('get_wallet_address', {
          keystore_name: keystoreName,
          password: securePassword,
        })
      );
    } finally {
      password.zeroize();
    }
  },

  removeKeystore: async (keystoreName: string): Promise<void> => {
    await invoke('remove_keystore', { keystore_name: keystoreName });
  },

  decryptKeystore: async (
    keystoreName: string,
    password: ZeroizedString
  ): Promise<string> => {
    try {
      return await password.use((securePassword) =>
        invoke<string>('decrypt_keystore', {
          keystore_name: keystoreName,
          password: securePassword,
        })
      );
    } finally {
      password.zeroize();
    }
  },

  listWallets: async (): Promise<string[]> => {
    return invoke<string[]>('list_wallets');
  },
};
