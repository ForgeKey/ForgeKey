# Security Policy

## How ForgeKey Protects Your Keys

**We don't touch your crypto.** ForgeKey is a GUI wrapper around Foundry's `cast wallet` commands. All key generation, encryption, and decryption happens through Foundry — we don't implement our own cryptography.

**Sensitive data is zeroed after use.** Passwords and private keys are held in secure memory and cleared immediately when no longer needed.

**No network transmission.** Your keystores and keys never leave your machine. The only network activity is optional update checks against GitHub releases.

## Reporting a Vulnerability

**Do not open public issues for security vulnerabilities.**

Email: [security@example.com](mailto:security@example.com)

Include:
- Description of the issue
- Steps to reproduce
- Potential impact

We'll acknowledge your report within 48 hours and keep you updated on our progress.

## Scope

**In scope:** Memory handling, keystore permissions, command injection, update integrity

**Out of scope:** Vulnerabilities in [Foundry](https://github.com/foundry-rs/foundry) or [Tauri](https://github.com/tauri-apps/tauri) — report those upstream
