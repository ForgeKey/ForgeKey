import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormPage } from '@/components/layout/form-page';
import { FormField, FormLabel, FormError } from '@/components/ui/form-field';
import { Address } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';
import { PASSWORD_VALIDATION_ERROR } from '@/lib/constants';

type NewAddressFormProps = {
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  handleBackClick?: () => void;
};

export function NewAddressForm({
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleBackClick,
}: NewAddressFormProps) {
  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newAddress.label && newAddress.password && isPasswordValid) {
      handleAddAddress();
    }
  };

  return (
    <FormPage
      title="Generate New Address"
      description="Create a new Ethereum address with a secure password"
      onBack={handleBackClick}
      onSubmit={handleSubmit}
      formId="new-address-form"
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
