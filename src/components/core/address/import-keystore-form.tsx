import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address } from '@/types/address';
import { ZeroizedString } from '@/lib/zeroized-string';
import { ChevronLeft, FolderOpen } from 'lucide-react';

type ImportKeystoreFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  validateKeystorePassword: (
    keystoreName: string,
    securePassword: ZeroizedString
  ) => Promise<boolean>;
  handleBackClick?: () => void;
};

/**
 * Form for importing an existing keystore
 */
export function ImportKeystoreForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  validateKeystorePassword,
  handleBackClick,
}: ImportKeystoreFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateKeystore = async () => {
    if (!newAddress.label || !newAddress.password) {
      setError('Please provide a password');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      // Try to get the address from the keystore to validate the password
      const isValid = await validateKeystorePassword(
        newAddress.label,
        newAddress.password
      );

      if (!isValid) {
        setError('Invalid password or keystore');
        return false;
      }

      return true;
    } catch (err) {
      console.error('Error validating keystore:', err);
      setError('Invalid password or keystore');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = await validateKeystore();
    if (isValid) {
      handleAddAddress();
    }
  };

  return (
    <form onSubmit={handleImport} className="px-1 py-1">
      {handleBackClick && (
        <div className="relative mb-2">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackClick}
            className="absolute left-0 top-0 p-2 text-white bg-white/5 backdrop-blur-sm rounded-full hover:bg-white/10 hover:text-white transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        </div>
      )}

      <div className="text-center mb-3">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-1">
          <FolderOpen className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Import Keystore File</h2>
        <p className="text-sm text-gray-300 mt-0.5 mb-1">
          Import an existing encrypted keystore file
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">
            Keystore File
          </label>
          <Input
            placeholder="Keystore file path"
            value={newAddress.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAddress({ ...newAddress, label: e.target.value })
            }
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-9 text-sm"
            disabled={loading}
          />
          <p className="text-xs text-gray-400 mt-1">
            Path to the JSON keystore file
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">
            Keystore Password
          </label>
          <PasswordInput
            value={newAddress.password || null}
            onChange={(password) =>
              setNewAddress({ ...newAddress, password: password || undefined })
            }
            placeholder="Enter keystore password"
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-9 text-sm"
            showRequirements={false}
          />
        </div>

        {error && (
          <div className="text-red-400 text-sm bg-red-500/10 p-2 rounded-md">
            {error}
          </div>
        )}
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-sm h-9"
        disabled={!newAddress.label || !newAddress.password || loading}
      >
        {loading ? 'Importing...' : 'Import Keystore'}
      </Button>
    </form>
  );
}
