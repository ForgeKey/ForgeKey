import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { Address, VanityOpts } from '@/types/address';
import { ZeroizedString } from '@/utils/zeroize';
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
      <Input
        placeholder="Password"
        type="password"
        value={newAddress.password?.getValue()}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setNewAddress({
            ...newAddress,
            password: new ZeroizedString(e.target.value),
          })
        }
      />
      <Button
        className="w-full"
        variant="secondary"
        onClick={handleAddAddress}
        disabled={
          !newAddress.label ||
          !newAddress.password ||
          (!vanityOptions.starts_with && !vanityOptions.ends_with)
        }
      >
        Generate Vanity Address
      </Button>
    </div>
  );
}
