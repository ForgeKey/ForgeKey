export type Address = {
  label: string;
  address: string;
  privateKey?: string;
  password: string;
};

export type Keystore = {
  name: string;
  addresses: Address[];
};

export type VanityOpts = {
  address_label: string;
  password: string;
  starts_with?: string;
  ends_with?: string;
};
