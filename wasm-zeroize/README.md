# wasm-zeroize

A WebAssembly module for secure password and private key handling with automatic memory zeroization.

## Features

- Secure containers for passwords and private keys
- Automatic memory zeroization when containers are dropped
- Utility functions for securely using sensitive data
- WebAssembly implementation for use in web applications

## Usage

This module is designed to be used with the TypeScript wrapper in the ForgeKey application.

### Building

To build the WebAssembly module:

```bash
wasm-pack build --target web
```

This will generate the necessary JavaScript and TypeScript bindings in the `pkg` directory.

### Integration

The generated files should be copied to the `src/utils/zeroize/pkg` directory in the ForgeKey application.

## Security

This module uses the `zeroize` crate to ensure that sensitive data is properly cleared from memory when no longer needed. This helps prevent sensitive information from being leaked through memory dumps or other side-channel attacks.
