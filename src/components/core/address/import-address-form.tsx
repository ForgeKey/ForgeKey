import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Address } from '@/types/address';
import { useZeroize } from '@/contexts/zeroize-context';
import { validatePassword } from '@/lib/password-validation';

type ImportAddressFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
};

export function ImportAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
}: ImportAddressFormProps) {
  const { createZeroizedString } = useZeroize();
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
        placeholder="Private Key"
        value={newAddress.privateKey?.getValue()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({
            ...newAddress,
            privateKey: createZeroizedString(e.target.value),
          })
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
          !newAddress.privateKey ||
          !newAddress.password ||
          !isPasswordValid
        }
      >
        Import Address
      </Button>
    </div>
  );
}
