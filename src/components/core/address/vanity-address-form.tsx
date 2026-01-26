import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormPage } from '@/components/layout/form-page';
import { Address, VanityOpts } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';

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
    <FormPage
      title="Vanity Address"
      description="Generate an address with custom patterns"
      onBack={handleBackClick}
      onSubmit={handleSubmit}
      submitLabel="Create Vanity Address"
      submitDisabled={
        !newAddress.label ||
        !newAddress.password ||
        !isPasswordValid ||
        (!vanityOptions.starts_with && !vanityOptions.ends_with)
      }
    >
      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Address Label
        </label>
        <Input
          placeholder="e.g. My Wallet"
          value={newAddress.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAddress({ ...newAddress, label: e.target.value })
          }
        />
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            Start With
          </label>
          <Input
            placeholder="e.g. dead"
            value={vanityOptions.starts_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({
                ...vanityOptions,
                starts_with: e.target.value,
              })
            }
            />
        </div>

        <div>
          <label className="block text-xs font-medium text-white mb-1.5">
            End With
          </label>
          <Input
            placeholder="e.g. beef"
            value={vanityOptions.ends_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({ ...vanityOptions, ends_with: e.target.value })
            }
            />
        </div>
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
        />
        {newAddress.password && !isPasswordValid && (
          <p className="text-xs text-red-400 mt-1">
            Password must be at least 8 characters with mixed characters
          </p>
        )}
      </div>
    </FormPage>
  );
}
