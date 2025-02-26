/* tslint:disable */
/* eslint-disable */
export function start(): void;
/**
 * A utility function to securely use a password for an operation
 */
export function with_zeroized_password(password: string, callback: Function): any;
/**
 * A utility function to securely use a private key for an operation
 */
export function with_zeroized_private_key(private_key: string, callback: Function): any;
/**
 * A secure password container that automatically zeroizes memory when dropped
 */
export class ZeroizedPassword {
  free(): void;
  /**
   * Create a new secure password
   */
  constructor(password: string);
  /**
   * Get the password value (use with caution)
   */
  get_value(): string;
  /**
   * Explicitly zeroize the password
   */
  zeroize(): void;
}
/**
 * A secure private key container that automatically zeroizes memory when dropped
 */
export class ZeroizedPrivateKey {
  free(): void;
  /**
   * Create a new secure private key
   */
  constructor(private_key: string);
  /**
   * Get the private key value (use with caution)
   */
  get_value(): string;
  /**
   * Explicitly zeroize the private key
   */
  zeroize(): void;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly start: () => void;
  readonly __wbg_zeroizedpassword_free: (a: number, b: number) => void;
  readonly zeroizedpassword_new: (a: number, b: number) => number;
  readonly zeroizedpassword_get_value: (a: number, b: number) => void;
  readonly zeroizedpassword_zeroize: (a: number) => void;
  readonly __wbg_zeroizedprivatekey_free: (a: number, b: number) => void;
  readonly zeroizedprivatekey_new: (a: number, b: number) => number;
  readonly zeroizedprivatekey_get_value: (a: number, b: number) => void;
  readonly zeroizedprivatekey_zeroize: (a: number) => void;
  readonly with_zeroized_password: (a: number, b: number, c: number, d: number) => void;
  readonly with_zeroized_private_key: (a: number, b: number, c: number, d: number) => void;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_add_to_stack_pointer: (a: number) => number;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
