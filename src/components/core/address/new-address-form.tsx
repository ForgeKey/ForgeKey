import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Address } from '@/types/address';
import { useZeroize } from '@/contexts/zeroize-context';

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
  const { createZeroizedString } = useZeroize();

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
        placeholder="Password"
        type="password"
        value={newAddress.password?.getValue()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({
            ...newAddress,
            password: createZeroizedString(e.target.value),
          })
        }
      />
      <Button
        variant="secondary"
        className="w-full dark:text-secondary"
        onClick={handleAddAddress}
        disabled={!newAddress.label || !newAddress.password}
      >
        Generate New Address
      </Button>
    </div>
  );
}
