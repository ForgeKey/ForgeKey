import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormPage } from '@/components/layout/form-page';
import { FormField, FormLabel, FormHint, FormError } from '@/components/ui/form-field';
import { Address } from '@/types/address';
import { useZeroize } from '@/contexts/zeroize-context';
import { validatePassword } from '@/lib/password-validation';
import { PASSWORD_VALIDATION_ERROR } from '@/lib/constants';

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
      formId="import-address-form"
    >
      <FormField>
        <FormLabel>Address Label</FormLabel>
        <Input
          placeholder="e.g. My Wallet"
          value={newAddress.label}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewAddress({ ...newAddress, label: e.target.value })
          }
        />
      </FormField>

      <FormField>
        <FormLabel>Private Key</FormLabel>
        <Input
          placeholder="0x..."
          value={newAddress.privateKey?.getValue() ?? ''}
          onChange={handlePrivateKeyChange}
        />
        <FormHint>Your private key will be encrypted with your password</FormHint>
      </FormField>

      <FormField>
        <FormLabel>Password</FormLabel>
        <PasswordInput
          value={newAddress.password || null}
          onChange={(password) =>
            setNewAddress({ ...newAddress, password: password || undefined })
          }
          placeholder=""
        />
        {newAddress.password && !isPasswordValid && (
          <FormError>{PASSWORD_VALIDATION_ERROR}</FormError>
        )}
      </FormField>
    </FormPage>
  );
}
