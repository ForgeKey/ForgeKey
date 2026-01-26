# Contributing to ForgeKey

Thanks for your interest in contributing to ForgeKey! Whether it's bug reports, feature requests, or code contributions, we appreciate your help.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [pnpm](https://pnpm.io/)
- [Rust](https://rustup.rs/)
- [Foundry](https://book.getfoundry.sh/getting-started/installation)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/ForgeKey/ForgeKey.git
cd ForgeKey

# Install dependencies
pnpm install

# Run in development mode
pnpm tauri-dev
```

## Project Structure

```
ForgeKey/
├── src/                  # Next.js frontend
│   ├── api/              # Tauri command wrappers
│   ├── components/       # React components
│   ├── hooks/            # Custom hooks (wallet operations, routing)
│   ├── stores/           # Zustand state management
│   └── router/           # Custom router implementation
├── src-tauri/            # Rust backend
│   └── src/commands/     # Tauri commands (Foundry CLI wrappers)
└── docs/                 # Documentation
```

## Architecture Overview

ForgeKey is a Tauri app with a Next.js frontend and Rust backend:

- **Frontend**: React with Zustand for state management. Custom router (not file-based). UI built with Radix primitives and Tailwind CSS.
- **Backend**: Rust commands that wrap Foundry's `cast wallet` CLI. No direct cryptographic operations — all key management goes through Foundry.
- **Security**: Passwords and private keys use `ZeroizedString` wrappers that clear memory after use.

## Development Commands

| Command | Description |
|---------|-------------|
| `pnpm tauri-dev` | Run app in development mode |
| `pnpm dev` | Run Next.js only (UI development) |
| `pnpm lint` | Run ESLint |
| `pnpm tauri-build` | Production build |
| `pnpm tauri-build-universal` | Universal macOS binary |

## Making Changes

### Code Style

- Run `pnpm lint` before submitting
- Follow existing patterns in the codebase
- Use TypeScript strictly — avoid `any` types

### Security Guidelines

This is critical. ForgeKey handles sensitive data:

- **Never log passwords or private keys**
- **Always use `ZeroizedString`** for sensitive data
- **Call `zeroize()` in `finally` blocks** to ensure cleanup
- **Don't store decrypted keys** longer than necessary

### Commit Messages

Use clear, descriptive messages:

```
feat: add vanity address generation
fix: prevent password from persisting after dialog close
refactor: extract FormField component
docs: update installation instructions
```

### Pull Requests

- Keep changes focused — one feature or fix per PR
- Include a clear description of what and why
- Update documentation if needed
- Ensure `pnpm lint` passes

## Reporting Bugs

Open an issue with:

- Steps to reproduce
- Expected vs actual behavior
- Platform and version info
- Screenshots if applicable

## Feature Requests

Open an issue describing:

- The problem you're trying to solve
- Your proposed solution
- Any alternatives you've considered

## Security Vulnerabilities

**Do not open public issues for security vulnerabilities.**

See [SECURITY.md](SECURITY.md) for how to report security issues.

## License

By contributing, you agree that your contributions will be licensed under the [GPL-3.0 License](LICENSE).
