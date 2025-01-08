import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type ImportAddressFormProps = {
  newAddress: { label: string; address: string; privateKey: string };
  setNewAddress: React.Dispatch<
    React.SetStateAction<{ label: string; address: string; privateKey: string }>
  >;
  handleAddAddress: () => void;
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import') => void;
};

export function ImportAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  setAddAddressStep,
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
        type="password"
        value={newAddress.privateKey}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({ ...newAddress, privateKey: e.target.value })
        }
      />
      <Button
        className="w-full"
        onClick={handleAddAddress}
        disabled={!newAddress.label || !newAddress.privateKey}
      >
        Import Address
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
