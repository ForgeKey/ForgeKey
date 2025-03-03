import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';

type NewAddressFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
};

export function NewAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
}: NewAddressFormProps) {
  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  return (
    <div className="space-y-4">
      <Input
        placeholder="Address Label"
        value={newAddress.label}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({ ...newAddress, label: e.target.value })
        }
      />
      <PasswordInput
        value={newAddress.password || null}
        onChange={(password) =>
          setNewAddress({ ...newAddress, password: password || undefined })
        }
        placeholder="Password"
      />
      <Button
        variant="secondary"
        className="w-full dark:text-secondary"
        onClick={handleAddAddress}
        disabled={!newAddress.label || !newAddress.password || !isPasswordValid}
      >
        Generate New Address
      </Button>
    </div>
  );
}
