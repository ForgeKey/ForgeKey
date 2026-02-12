import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { Button } from '@/components/ui/button';
import { FormPage } from '@/components/layout/form-page';
import { FormField, FormLabel, FormHint, FormError } from '@/components/ui/form-field';
import { Address, VanityOpts } from '@/types/address';
import { validatePassword } from '@/lib/password-validation';
import { sanitizeHexInput, getVanityDifficulty } from '@/lib/vanity-validation';
import { PASSWORD_VALIDATION_ERROR } from '@/lib/constants';
import { useWalletStore } from '@/stores/wallet-store';
import { walletApi } from '@/api/wallet-api';

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
  const isGeneratingVanity = useWalletStore((state) => state.isGeneratingVanity);
  const setIsGeneratingVanity = useWalletStore((state) => state.setIsGeneratingVanity);

  const isPasswordValid = newAddress.password && !newAddress.password.isZeroized()
    ? validatePassword(newAddress.password.getValue()).isValid
    : false;

  const difficulty = getVanityDifficulty(
    (vanityOptions.starts_with ?? '').length,
    (vanityOptions.ends_with ?? '').length,
  );

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

  const handleCancel = async () => {
    try {
      await walletApi.cancelVanityWallet();
    } catch (e) {
      console.error('Failed to cancel vanity generation:', e);
    }
    // The password was zeroized by the API's finally block — clear it so the form
    // re-renders cleanly with an empty password field instead of crashing.
    setNewAddress({ ...newAddress, password: undefined });
    setIsGeneratingVanity(false);
  };

  if (isGeneratingVanity) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[320px] gap-4 px-6">
        <div className="relative h-10 w-10">
          <div className="absolute inset-0 rounded-full border-2 border-white/10" />
          <div className="absolute inset-0 rounded-full border-2 border-t-purple-400 animate-spin" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-medium text-neutral-200">Generating vanity address...</p>
          {difficulty && (
            <p className={`text-xs ${difficulty.color}`}>
              Estimated: {difficulty.label}
            </p>
          )}
        </div>
        <Button
          size="sm"
          onClick={handleCancel}
        >
          Cancel
        </Button>
      </div>
    );
  }

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
            placeholder="e.g. C0DE"
            maxLength={6}
            value={vanityOptions.starts_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({
                ...vanityOptions,
                starts_with: sanitizeHexInput(e.target.value),
              })
            }
          />
        </FormField>

        <FormField>
          <FormLabel>End With</FormLabel>
          <Input
            placeholder="e.g. DEAD"
            maxLength={6}
            value={vanityOptions.ends_with}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setVanityOptions({
                ...vanityOptions,
                ends_with: sanitizeHexInput(e.target.value),
              })
            }
          />
        </FormField>
      </div>

      {difficulty && (
        <FormHint className={difficulty.color}>
          Estimated time: {difficulty.label}
        </FormHint>
      )}

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
