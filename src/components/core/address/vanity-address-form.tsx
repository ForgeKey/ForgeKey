import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type VanityAddressFormProps = {
  vanityOptions: { startWith: string; endWith: string };
  setVanityOptions: React.Dispatch<
    React.SetStateAction<{ startWith: string; endWith: string }>
  >;
  newAddress: { label: string; address: string; privateKey: string };
  setNewAddress: React.Dispatch<
    React.SetStateAction<{ label: string; address: string; privateKey: string }>
  >;
  handleAddAddress: () => void;
  setAddAddressStep: (step: 'select' | 'new' | 'vanity' | 'import') => void;
};

export function VanityAddressForm({
  vanityOptions,
  setVanityOptions,
  newAddress,
  setNewAddress,
  handleAddAddress,
  setAddAddressStep,
}: VanityAddressFormProps) {
  return (
    <div className="space-y-4">
      <Input
        placeholder="Address Label"
        value={newAddress.label}
        onChange={(e) =>
          setNewAddress({ ...newAddress, label: e.target.value })
        }
      />
      <Input
        placeholder="Start with (e.g., 1a2b)"
        value={vanityOptions.startWith}
        onChange={(e) =>
          setVanityOptions({ ...vanityOptions, startWith: e.target.value })
        }
      />
      <Input
        placeholder="End with (e.g., 9z8y)"
        value={vanityOptions.endWith}
        onChange={(e) =>
          setVanityOptions({ ...vanityOptions, endWith: e.target.value })
        }
      />
      <Button
        className="w-full"
        onClick={handleAddAddress}
        disabled={
          !newAddress.label ||
          (!vanityOptions.startWith && !vanityOptions.endWith)
        }
      >
        Generate Vanity Address
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
