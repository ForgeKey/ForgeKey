import { ZeroizedString } from '@/utils/zeroize';

export type Address = {
  label: string;
  address: string;
  privateKey?: ZeroizedString;
  password?: ZeroizedString;
};

export type Keystore = {
  name: string;
  addresses: Address[];
};

export type VanityOpts = {
  address_label: string;
  password?: ZeroizedString;
  starts_with?: string;
  ends_with?: string;
};
