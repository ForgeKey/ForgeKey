import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address, VanityOpts } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';

type VanityAddressFormProps = {
  vanityOptions: VanityOpts;
  setVanityOptions: React.Dispatch<React.SetStateAction<VanityOpts>>;
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
};

export function VanityAddressForm({
  vanityOptions,
  setVanityOptions,
  newAddress,
  setNewAddress,
  handleAddAddress,
}: VanityAddressFormProps) {
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
      <Input
        placeholder="Start with (e.g., 0xdead)"
        value={vanityOptions.starts_with}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setVanityOptions({ ...vanityOptions, starts_with: e.target.value })
        }
      />
      <Input
        placeholder="End with (e.g., 420)"
        value={vanityOptions.ends_with}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setVanityOptions({ ...vanityOptions, ends_with: e.target.value })
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
        className="w-full"
        variant="secondary"
        onClick={handleAddAddress}
        disabled={
          !newAddress.label ||
          !newAddress.password ||
          !isPasswordValid ||
          (!vanityOptions.starts_with && !vanityOptions.ends_with)
        }
      >
        Generate Vanity Address
      </Button>
    </div>
  );
}
