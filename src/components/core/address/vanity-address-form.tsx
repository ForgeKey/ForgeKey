import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address, VanityOpts } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';
import { ChevronLeft, Sparkles } from 'lucide-react';

type VanityAddressFormProps = {
  vanityOptions: VanityOpts;
  setVanityOptions: React.Dispatch<React.SetStateAction<VanityOpts>>;
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  handleBackClick?: () => void;
};

export function VanityAddressForm({
  vanityOptions,
  setVanityOptions,
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleBackClick,
}: VanityAddressFormProps) {
  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newAddress.label &&
      newAddress.password &&
      isPasswordValid &&
      (vanityOptions.starts_with || vanityOptions.ends_with)
    ) {
      handleAddAddress();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="px-1 py-2">
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
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="text-lg font-bold text-white">Create Vanity Address</h2>
        <p className="text-sm text-gray-300 mt-0.5 mb-1">
          Generate an address with custom patterns
        </p>
      </div>

      <div className="space-y-3">
        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">
            Address Label
          </label>
          <Input
            placeholder="Enter a memorable name"
            value={newAddress.label}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setNewAddress({ ...newAddress, label: e.target.value })
            }
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-9 text-sm"
          />
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">Start With</label>
          <Input
            placeholder="e.g., 0xdead"
            value={vanityOptions.starts_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({
                ...vanityOptions,
                starts_with: e.target.value,
              })
            }
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-9 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Pattern for the beginning of your address
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">End With</label>
          <Input
            placeholder="e.g., 420"
            value={vanityOptions.ends_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({ ...vanityOptions, ends_with: e.target.value })
            }
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-9 text-sm"
          />
          <p className="text-xs text-gray-400 mt-1">
            Pattern for the end of your address
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm p-2 rounded-lg border border-white/5">
          <label className="block text-sm text-gray-300 mb-1">
            Secure Password
          </label>
          <PasswordInput
            value={newAddress.password || null}
            onChange={(password) =>
              setNewAddress({ ...newAddress, password: password || undefined })
            }
            placeholder="Create a strong password"
            className="bg-white/10 border-white/10 text-white placeholder:text-gray-400 focus-visible:ring-purple-500 h-9 text-sm"
          />
          {newAddress.password && !isPasswordValid && (
            <p className="text-xs text-red-400 mt-1 leading-tight">
              Password must be at least 8 characters with mixed characters
            </p>
          )}
        </div>
      </div>

      <Button
        type="submit"
        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 transition-opacity text-sm h-9 mt-2"
        disabled={
          !newAddress.label ||
          !newAddress.password ||
          !isPasswordValid ||
          (!vanityOptions.starts_with && !vanityOptions.ends_with)
        }
      >
        Generate Vanity Address
      </Button>
    </form>
  );
}
