import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { FormPage } from '@/components/layout/form-page';
import { Address } from '@/types/address';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';

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

export function ImportKeystoreForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  validateKeystorePassword,
  handleBackClick,
}: ImportKeystoreFormProps) {
  const { createZeroizedString } = useZeroize();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [passwordInput, setPasswordInput] = useState('');

  async function validateKeystore(): Promise<boolean> {
    if (!newAddress.label || !passwordInput) {
      setError('Please provide a password');
      return false;
    }

    setLoading(true);
    setError(null);

    const securePasswordForValidation = createZeroizedString(passwordInput);
    const securePasswordForImport = createZeroizedString(passwordInput);
    setPasswordInput('');

    try {
      const isValid = await validateKeystorePassword(
        newAddress.label,
        securePasswordForValidation
      );

      if (!isValid) {
        securePasswordForImport.zeroize();
        setError('Invalid password or keystore');
        return false;
      }

      setNewAddress({ ...newAddress, password: securePasswordForImport });
      return true;
    } catch (err) {
      console.error('Error validating keystore:', err);
      securePasswordForImport.zeroize();
      setError('Invalid password or keystore');
      return false;
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    const isValid = await validateKeystore();
    if (isValid) {
      handleAddAddress();
    }
  }

  return (
    <FormPage
      title="Import your keystore file"
      description="Enter your password"
      onBack={handleBackClick}
      onSubmit={handleImport}
      submitLabel={loading ? 'Importing...' : 'Import Keystore'}
      submitDisabled={!newAddress.label || !passwordInput || loading}
    >
      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Keystore Password
        </label>
        <Input
          type="password"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          placeholder=""
        />
      </div>

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </FormPage>
  );
}
