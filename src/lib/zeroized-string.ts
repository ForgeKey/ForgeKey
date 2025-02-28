import { ZeroizedString as WasmZeroizedString } from 'wasm-zeroize';

/**
 * ZeroizedString provides a secure way to handle sensitive string data.
 * It allows for explicit memory clearing when the sensitive data is no longer needed,
 * reducing the risk of sensitive information remaining in memory.
 */
export class ZeroizedString {
  /**
   * The underlying WebAssembly implementation of the zeroized string.
   * Will be set to null when the string is zeroized.
   */
  private wasmString: WasmZeroizedString | null = null;

  /**
   * Creates a new ZeroizedString instance.
   * @param value The sensitive string value to be securely stored
   * @throws Error if the WebAssembly implementation fails to initialize
   */
  constructor(value: string) {
    try {
      // Use the ZeroizedString class from the NPM package
      this.wasmString = new WasmZeroizedString(value);
    } catch (error) {
      console.error('Failed to create zeroized string:', error);
      throw new Error('Failed to create zeroized string');
    }
  }

  /**
   * Retrieves the stored string value.
   * @returns The securely stored string value
   * @throws Error if the string has already been zeroized
   */
  getValue(): string {
    if (!this.wasmString) {
      throw new Error('String has been zeroized');
    }
    return this.wasmString.get_value();
  }

  /**
   * Provides a way to use the string value within a callback function.
   * This method is provided for backward compatibility with older code.
   *
   * @param callback A function that receives the string value and returns a result
   * @returns The result of the callback function
   * @throws Error if the string has already been zeroized
   */
  use<T>(callback: (value: string) => T): T {
    if (!this.wasmString) {
      throw new Error('String has been zeroized');
    }

    try {
      return callback(this.getValue());
    } finally {
      // Value is still in memory but at least we're not keeping additional references
    }
  }

  /**
   * Securely clears the string from memory.
   * After calling this method, any attempts to access the string value will throw an error.
   */
  zeroize(): void {
    if (this.wasmString) {
      this.wasmString.zeroize();
      this.wasmString = null;
    }
  }

  /**
   * Checks if the string has been zeroized.
   * @returns true if the string has been zeroized, false otherwise
   */
  isZeroized(): boolean {
    return this.wasmString === null;
  }
}

/**
 * Type definition for the WebAssembly implementation of ZeroizedString.
 * This is used for type checking and documentation purposes.
 */
export type ZeroizedStringType = {
  /**
   * Retrieves the stored string value
   */
  get_value(): string;

  /**
   * Securely clears the string from memory
   */
  zeroize(): void;
};
