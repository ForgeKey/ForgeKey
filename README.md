<div align="center">
  <img src="assets/icon.png" alt="ForgeKey" width="128" height="128">
  <h1>ForgeKey</h1>
  <p><strong>Manage your Foundry keystores from the menu bar.</strong></p>

  <p>
    <a href="#installation"><img src="https://img.shields.io/badge/macOS-000000?style=flat&logo=apple&logoColor=white" alt="macOS"></a>
    <a href="#installation"><img src="https://img.shields.io/badge/Linux-FCC624?style=flat&logo=linux&logoColor=black" alt="Linux"></a>
    <a href="LICENSE"><img src="https://img.shields.io/badge/license-GPL--3.0-blue.svg" alt="License"></a>
    <a href="https://github.com/ForgeKey/ForgeKey/releases"><img src="https://img.shields.io/github/v/release/caesareth/ForgeKey" alt="Release"></a>
  </p>

  <img src="assets/hero-demo.gif" alt="ForgeKey Demo" width="400">
</div>

## Features

<table>
  <tr>
    <td align="center" width="50%">
      <img src="assets/demo-create-wallet.gif" alt="Create Wallet" width="280"><br>
      <strong>Create New Wallets</strong><br>
      <sub>Generate new keypairs instantly</sub>
    </td>
    <td align="center" width="50%">
      <img src="assets/demo-vanity.gif" alt="Vanity Address" width="280"><br>
      <strong>Vanity Addresses</strong><br>
      <sub>Custom prefixes and suffixes</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="assets/demo-import.gif" alt="Import Keys" width="280"><br>
      <strong>Import Existing Keys</strong><br>
      <sub>Bring your private keys or keystores</sub>
    </td>
    <td align="center">
      <img src="assets/demo-copy.gif" alt="Quick Copy" width="280"><br>
      <strong>One-Click Copy</strong><br>
      <sub>Addresses and keys to clipboard</sub>
    </td>
  </tr>
</table>

- **Cross-Platform** — Native support for macOS and Linux
- **Auto-Updates** — Built-in updater keeps you current
- **Menu Bar Native** — Always one click away, never in your way
- **Foundry-Backed** — Your keys stay in Foundry's secure keystore format

## Installation

### Quick Install

```bash
curl -fsSL https://raw.githubusercontent.com/caesareth/ForgeKey/main/install.sh | bash
```

This will download the latest release for your platform and install it automatically.

### Manual Download

Download the latest release for your platform from the [Releases page](https://github.com/ForgeKey/ForgeKey/releases):

| Platform | Download |
|----------|----------|
| macOS (Apple Silicon) | `ForgeKey_x.x.x_aarch64.dmg` |
| macOS (Intel) | `ForgeKey_x.x.x_x64.dmg` |
| Linux (x64) | `ForgeKey_x.x.x_amd64.deb` / `.AppImage` |

### Prerequisites

ForgeKey requires [Foundry](https://book.getfoundry.sh/getting-started/installation) to be installed. If Foundry isn't detected on first launch, ForgeKey will offer to install it for you.

## Security

ForgeKey is a GUI wrapper around Foundry's `cast wallet` commands — your keys never leave Foundry's secure keystore. We don't implement our own crypto.

See [SECURITY.md](SECURITY.md) for details on our security model and how to report vulnerabilities.

## FAQ

<details>
<summary><strong>Where are my keystores stored?</strong></summary>

ForgeKey uses Foundry's default keystore location:
- macOS: `~/.foundry/keystores/`
- Linux: `~/.foundry/keystores/`

These are standard Foundry keystores — you can use them directly with `cast wallet` commands.
</details>

<details>
<summary><strong>Can I use keystores I created with Foundry CLI?</strong></summary>

Yes. ForgeKey reads from the same keystore directory that Foundry uses. Any keystores you've created with `cast wallet new` or `cast wallet import` will appear automatically.
</details>

<details>
<summary><strong>Is my private key ever exposed?</strong></summary>

Only when you explicitly request it. ForgeKey can decrypt and display your private key for copying, but this requires entering your keystore password. The decrypted key is held in secure memory and zeroed immediately after use.
</details>

<details>
<summary><strong>What happens if Foundry isn't installed?</strong></summary>

On first launch, ForgeKey checks for Foundry. If not found, it will offer to install it for you using Foundry's official installer (`foundryup`).
</details>

<details>
<summary><strong>Does ForgeKey support hardware wallets?</strong></summary>

Not currently. ForgeKey is focused on software keystores managed by Foundry. Hardware wallet support may be considered for future releases.
</details>

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](CONTRIBUTING.md) for development setup and guidelines.

## License

ForgeKey is licensed under the [GPL-3.0 License](LICENSE).
