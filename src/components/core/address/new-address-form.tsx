import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';
import { ChevronLeft, Key } from 'lucide-react';

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
    <form onSubmit={handleSubmit} className="space-y-4 px-1 py-2">
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

      <div className="text-center mb-3 pt-2">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-2">
          <Key className="h-6 w-6" />
        </div>
        <h2 className="text-base font-bold text-white">Generate New Address</h2>
        <p className="text-xs text-gray-300 mt-0.5 mb-2">
          Create a new Ethereum address with a secure password
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/5">
          <label className="block text-xs text-gray-300 mb-1">
            Address Label
          </label>
          <Input
            placeholder="Enter a memorable name"
            value={newAddress.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAddress({ ...newAddress, label: e.target.value })
            }
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-8 text-sm"
          />
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-3 rounded-lg border border-white/5">
          <label className="block text-xs text-gray-300 mb-1">
            Secure Password
          </label>
          <PasswordInput
            value={newAddress.password || null}
            onChange={(password) =>
              setNewAddress({ ...newAddress, password: password || undefined })
            }
            placeholder="Create a strong password"
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-8 text-sm"
          />
          {newAddress.password && !isPasswordValid && (
            <p className="text-xs text-red-400 mt-1 text-[10px] leading-tight">
              Password must be at least 8 characters with mixed characters
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-sm h-9"
        disabled={!newAddress.label || !newAddress.password || !isPasswordValid}
      >
        Generate Address
      </Button>
    </form>
  );
}
