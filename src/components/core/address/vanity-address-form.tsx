import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { FormPage } from '@/components/layout/form-page';
import { FormField, FormLabel, FormError } from '@/components/ui/form-field';
import { Address, VanityOpts } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';
import { PASSWORD_VALIDATION_ERROR } from '@/lib/constants';

type VanityAddressFormProps = {
  vanityOptions: VanityOpts;
  setVanityOptions: React.Dispatch<React.SetStateAction<VanityOpts>>;
  newAddress: Address;
  setNewAddress: React.Dispatch<React.SetStateAction<Address>>;
  handleAddAddress: () => void;
  handleBackClick?: () => void;
};

export function VanityAddressForm({
  vanityOptions,
  setVanityOptions,
  newAddress,
  setNewAddress,
  handleAddAddress,
  handleBackClick,
}: VanityAddressFormProps) {
  const isPasswordValid = newAddress.password
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (
      newAddress.label &&
      newAddress.password &&
      isPasswordValid &&
      (vanityOptions.starts_with || vanityOptions.ends_with)
    ) {
      handleAddAddress();
    }
  };

  return (
    <FormPage
      title="Vanity Address"
      description="Generate an address with custom patterns"
      onBack={handleBackClick}
      onSubmit={handleSubmit}
      formId="vanity-address-form"
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

      <div className="grid grid-cols-2 gap-2">
        <FormField>
          <FormLabel>Start With</FormLabel>
          <Input
            placeholder="e.g. c0de"
            value={vanityOptions.starts_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({
                ...vanityOptions,
                starts_with: e.target.value,
              })
            }
          />
        </FormField>

        <FormField>
          <FormLabel>End With</FormLabel>
          <Input
            placeholder="e.g. dead"
            value={vanityOptions.ends_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({ ...vanityOptions, ends_with: e.target.value })
            }
          />
        </FormField>
      </div>

      <FormField>
        <FormLabel>Secure Password</FormLabel>
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
