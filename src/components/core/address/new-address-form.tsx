import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';
import { ArrowLeft } from 'lucide-react';

type NewAddressFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  handleBackClick?: () => void;
};

export function NewAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleBackClick,
}: NewAddressFormProps) {
  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.label && newAddress.password && isPasswordValid) {
      handleAddAddress();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-3 flex flex-col h-full min-h-[340px]">
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
        <h2 className="text-base font-semibold text-white mb-1">Generate New Address</h2>
        <p className="text-xs text-white/50">
          Create a new Ethereum address with a secure password
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-3 flex-1">
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Address Label
          </label>
          <Input
            placeholder=""
            value={newAddress.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAddress({ ...newAddress, label: e.target.value })
            }
            className="bg-white/90 text-gray-900 placeholder:text-gray-400 border-0 h-9 rounded-md text-sm"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Secure Password
          </label>
          <PasswordInput
            value={newAddress.password || null}
            onChange={(password) =>
              setNewAddress({ ...newAddress, password: password || undefined })
            }
            placeholder=""
            className="bg-white/90 text-gray-900 placeholder:text-gray-400 border-0 h-9 rounded-md text-sm"
          />
          {newAddress.password && !isPasswordValid && (
            <p className="text-xs text-red-400 mt-1">
              Password must be at least 8 characters with mixed characters
            </p>
          )}
        </div>
      </div>

      {/* Submit Button - fixed at bottom */}
      <div className="pt-3">
        <Button
          type="submit"
          className="w-full h-9 text-sm font-medium rounded-md"
          disabled={!newAddress.label || !newAddress.password || !isPasswordValid}
        >
          Generate Address
        </Button>
      </div>
    </form>
  );
}
