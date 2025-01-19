import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

type VanityAddressFormProps = {
  vanityOptions: { startsWith: string; endsWith: string };
  setVanityOptions: React.Dispatch<
    React.SetStateAction<{ startsWith: string; endsWith: string }>
  >;
  newAddress: {
    label: string;
    address: string;
    privateKey: string;
    password?: string;
  };
  setNewAddress: React.Dispatch<
    React.SetStateAction<{
      label: string;
      address: string;
      privateKey: string;
      password?: string;
    }>
  >;
  handleAddAddress: () => void;
};

export function VanityAddressForm({
  vanityOptions,
  setVanityOptions,
  newAddress,
  setNewAddress,
  handleAddAddress,
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
        placeholder="Start with (e.g., 0xdead)"
        value={vanityOptions.startsWith}
        onChange={(e) =>
          setVanityOptions({ ...vanityOptions, startsWith: e.target.value })
        }
      />
      <Input
        placeholder="End with (e.g., 420)"
        value={vanityOptions.endsWith}
        onChange={(e) =>
          setVanityOptions({ ...vanityOptions, endsWith: e.target.value })
        }
      />
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleAddAddress}
        disabled={
          !newAddress.label ||
          (!vanityOptions.startsWith && !vanityOptions.endsWith)
        }
      >
        Generate Vanity Address
      </Button>
    </div>
  );
}
