import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NewAddressFormProps = {
  newAddress: { label: string; address: string; privateKey: string };
  setNewAddress: React.Dispatch<
    React.SetStateAction<{ label: string; address: string; privateKey: string }>
  >;
  handleAddAddress: () => void;
};

export function NewAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
}: NewAddressFormProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Address Label"
        value={newAddress.label}
        onChange={(e) =>
          setNewAddress({ ...newAddress, label: e.target.value })
        }
      />
      <Button
        variant="secondary"
        className="w-full dark:text-secondary"
        onClick={handleAddAddress}
        disabled={!newAddress.label}
      >
        Generate New Address
      </Button>
    </div>
  );
}
