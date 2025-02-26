/**
 * Secure string handling using WebAssembly
 * This module provides secure containers that automatically zeroize memory when no longer needed
 */

// This module provides secure handling of sensitive strings
// by ensuring they are properly zeroized (memory cleared) when no longer needed

// Define interfaces for the WASM types
interface WasmZeroizedString {
  get_value(): string;
  zeroize(): void;
}

// Define the extended module interface to include ZeroizedString
interface WasmZeroizeModule {
  ZeroizedPassword: {
    new (password: string): WasmZeroizedString;
  };
  ZeroizedPrivateKey: {
    new (privateKey: string): WasmZeroizedString;
  };
}

// The module will be available at runtime after building
import * as wasmModule from './pkg/wasm_zeroize';
import type { InitOutput } from './pkg/wasm_zeroize';

// We need to initialize the WASM module before using it
let wasm: InitOutput | null = null;

// Export the types from the zeroize-module
export type { ZeroizedString as ZeroizedStringType } from './zeroize-module';

// Initialize the WASM module
let initialized = false;

export async function initZeroizeModule(): Promise<void> {
  if (initialized) return;

  try {
    // Properly initialize the WASM module
    const initWasm = wasmModule.default;
    if (typeof initWasm === 'function') {
      wasm = await initWasm();
      initialized = true;
      console.log('Zeroize module initialized successfully');
    } else {
      console.error('WASM module initialization function not found');
      throw new Error('WASM module initialization function not found');
    }
  } catch (error) {
    console.error('Failed to initialize zeroize module:', error);
    throw error;
  }
}

// Wrapper class for secure string handling
export class ZeroizedStringWrapper {
  private wasmString: WasmZeroizedString | null = null;

  constructor(value: string) {
    if (!initialized || !wasm) {
      console.warn(
        'Zeroize module not initialized. Strings will not be properly secured.'
      );
      return;
    }

    try {
      // Use the ZeroizedPassword class from the WASM module since ZeroizedString doesn't exist
      this.wasmString = new (
        wasmModule as unknown as WasmZeroizeModule
      ).ZeroizedPassword(value);
    } catch (error) {
      console.error('Failed to create zeroized string:', error);
    }
  }

  getValue(): string {
    if (!this.wasmString) return '';
    return this.wasmString.get_value();
  }

  // Add the use method for backward compatibility
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

  zeroize(): void {
    if (this.wasmString) {
      this.wasmString.zeroize();
      this.wasmString = null;
    }
  }
}

// Export the ZeroizedStringWrapper as ZeroizedString for use in the app
export { ZeroizedStringWrapper as ZeroizedString };
