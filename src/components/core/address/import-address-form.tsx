import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormPage } from '@/components/layout/form-page';
import { Address } from '@/types/address';
import { useZeroize } from '@/contexts/zeroize-context';
import { validatePassword } from '@/lib/password-validation';

type ImportAddressFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  handleBackClick?: () => void;
};

export function ImportAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleBackClick,
}: ImportAddressFormProps) {
  const { createZeroizedString } = useZeroize();
  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newAddress.label &&
      newAddress.privateKey &&
      newAddress.password &&
      isPasswordValid
    ) {
      handleAddAddress();
    }
  };

  const handlePrivateKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Zeroize the old private key before creating a new one
    newAddress.privateKey?.zeroize();

    setNewAddress({
      ...newAddress,
      privateKey: e.target.value
        ? createZeroizedString(e.target.value)
        : undefined,
    });
  };

  return (
    <FormPage
      title="Private Key"
      description="Import an address using your private key"
      onBack={handleBackClick}
      onSubmit={handleSubmit}
      submitLabel="Import Address"
      submitDisabled={
        !newAddress.label ||
        !newAddress.privateKey ||
        !newAddress.password ||
        !isPasswordValid
      }
    >
      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Address Label
        </label>
        <Input
          placeholder="e.g. My Wallet"
          value={newAddress.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAddress({ ...newAddress, label: e.target.value })
          }
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Private Key
        </label>
        <Input
          placeholder="0x..."
          value={newAddress.privateKey?.getValue() ?? ''}
          onChange={handlePrivateKeyChange}
        />
        <p className="text-xs text-white/50 mt-1">
          Your private key will be encrypted with your password
        </p>
      </div>

      <div>
        <label className="block text-xs font-medium text-white mb-1.5">
          Secure Password
        </label>
        <PasswordInput
          value={newAddress.password || null}
          onChange={(password) =>
            setNewAddress({ ...newAddress, password: password || undefined })
          }
          placeholder=""
        />
        {newAddress.password && !isPasswordValid && (
          <p className="text-xs text-red-400 mt-1">
            Password must be at least 8 characters with mixed characters
          </p>
        )}
      </div>
    </FormPage>
  );
}
