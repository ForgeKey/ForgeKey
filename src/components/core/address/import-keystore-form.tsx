import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Address } from '@/types/address';
import { ZeroizedString } from '@/lib/zeroized-string';
import { useZeroize } from '@/contexts/zeroize-context';
import { ArrowLeft } from 'lucide-react';

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
  const { createZeroizedString } = useZeroize();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Local state for password input - not a ZeroizedString until submission
  const [passwordInput, setPasswordInput] = useState('');

  const validateKeystore = async () => {
    if (!newAddress.label || !passwordInput) {
      setError('Please provide a password');
      return false;
    }

    setLoading(true);
    setError(null);

    // Create two ZeroizedStrings - one for validation (will be zeroized by API),
    // one to save for the actual import if validation succeeds
    const securePasswordForValidation = createZeroizedString(passwordInput);
    const securePasswordForImport = createZeroizedString(passwordInput);
    // Clear the plain text password from local state immediately
    setPasswordInput('');

    try {
      // Try to get the address from the keystore to validate the password
      const isValid = await validateKeystorePassword(
        newAddress.label,
        securePasswordForValidation
      );

      if (!isValid) {
        // Clean up the import password since we won't use it
        securePasswordForImport.zeroize();
        setError('Invalid password or keystore');
        return false;
      }

      // Store the password in newAddress for the actual import
      setNewAddress({ ...newAddress, password: securePasswordForImport });
      return true;
    } catch (err) {
      console.error('Error validating keystore:', err);
      // Clean up the import password since we won't use it
      securePasswordForImport.zeroize();
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
    <form onSubmit={handleImport} className="p-3 flex flex-col h-full">
      {/* Back Button */}
      {handleBackClick && (
        <div className="mb-1">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackClick}
            className="h-8 w-8 p-0 text-white bg-transparent hover:bg-white/10 rounded-full transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Header */}
      <div className="mb-3">
        <h2 className="text-base font-semibold text-white mb-1">Import your keystore file</h2>
        <p className="text-xs text-white/50">
          Enter your password
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-2">
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Keystore Password
          </label>
          <Input
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            placeholder=""
            className="bg-white/10 text-white placeholder:text-white/40 border border-white/10 h-9 rounded-md text-sm"
          />
        </div>

        {error && (
          <p className="text-xs text-red-400 mt-1">
            {error}
          </p>
        )}
      </div>

      {/* Spacer to push button to bottom */}
      <div className="flex-1" />

      {/* Submit Button - fixed at bottom */}
      <div className="pt-3 pb-1">
        <Button
          type="submit"
          className="w-full h-9 text-sm font-medium rounded-md"
          disabled={!newAddress.label || !passwordInput || loading}
        >
          {loading ? 'Importing...' : 'Import Keystore'}
        </Button>
      </div>
    </form>
  );
}
