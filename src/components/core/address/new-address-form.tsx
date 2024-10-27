import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type NewAddressFormProps = {
  newAddress: { label: string; address: string; privateKey: string };
  setNewAddress: React.Dispatch<
    React.SetStateAction<{ label: string; address: string; privateKey: string }>
  >;
  handleAddAddress: () => void;
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import') => void;
};

export function NewAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  setAddAddressStep,
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
        className="w-full"
        onClick={handleAddAddress}
        disabled={!newAddress.label}
      >
        Generate New Address
      </Button>
      <Button
        variant="outline"
        className="w-full"
        onClick={() => setAddAddressStep('select')}
      >
        Back
      </Button>
    </div>
  );
}
