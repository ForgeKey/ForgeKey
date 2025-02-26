import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address } from '@/types/address';
import { ZeroizedString } from '@/utils/zeroize';

type ImportKeystoreFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  validateKeystorePassword: (
    keystoreName: string,
    securePassword: ZeroizedString
  ) => Promise<boolean>;
};

/**
 * Form for importing an existing keystore
 */
export function ImportKeystoreForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  validateKeystorePassword,
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

  const handleImport = async () => {
    const isValid = await validateKeystore();
    if (isValid) {
      handleAddAddress();
    }
  };

  return (
    <div className="space-y-4">
      <Input
        placeholder="Address Label"
        value={newAddress.label}
        disabled
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({ ...newAddress, label: e.target.value })
        }
      />
      <Input
        placeholder="Password"
        type="password"
        value={newAddress.password?.getValue()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setNewAddress({
            ...newAddress,
            password: new ZeroizedString(e.target.value),
          });
          setError(null); // Clear error when password changes
        }}
      />
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleImport}
        disabled={!newAddress.label || !newAddress.password || loading}
      >
        {loading ? 'Importing...' : 'Import Keystore'}
      </Button>
    </div>
  );
}
