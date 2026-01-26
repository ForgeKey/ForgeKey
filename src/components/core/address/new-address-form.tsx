import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormPage } from '@/components/layout/form-page';
import { Address } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';

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
    <FormPage
      title="Generate New Address"
      description="Create a new Ethereum address with a secure password"
      onBack={handleBackClick}
      onSubmit={handleSubmit}
      submitLabel="Generate Address"
      submitDisabled={!newAddress.label || !newAddress.password || !isPasswordValid}
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
