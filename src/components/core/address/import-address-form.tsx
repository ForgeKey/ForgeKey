import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Address } from '@/types/address';

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
        value={newAddress.privateKey}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({ ...newAddress, privateKey: e.target.value })
        }
      />
      <Input
        placeholder="Password"
        type="password"
        value={newAddress.password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({ ...newAddress, password: e.target.value })
        }
      />
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleAddAddress}
        disabled={
          !newAddress.label || !newAddress.privateKey || !newAddress.password
        }
      >
        Import Address
      </Button>
    </div>
  );
}
