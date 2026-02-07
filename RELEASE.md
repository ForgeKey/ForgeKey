# Release Process for ForgeKey

This document outlines the process for creating and publishing new releases of ForgeKey.

## Release Workflow

ForgeKey uses GitHub Actions (`release.yml`) to automate the build and release process. The workflow builds for:

- **macOS** — Apple Silicon (aarch64) and Intel (x86_64)
- **Linux** — x86_64 (AppImage and .deb)

The release workflow is triggered by pushing a tag matching `v*`, or manually via `workflow_dispatch`.

### Prerequisites

- Push access to the repository
- GitHub permissions to create releases
- The following repository secrets must be configured:
  - `TAURI_SIGNING_PRIVATE_KEY` — Used to sign updater artifacts so the auto-updater can verify updates
  - `TAURI_SIGNING_PRIVATE_KEY_PASSWORD` — Password for the signing key

## Creating a New Release

1. **Update Version Numbers**

   Update the version number in **all three** files (they must match):

   - `src-tauri/tauri.conf.json` — the `version` field
   - `src-tauri/Cargo.toml` — the `version` field
   - `package.json` — the `version` field

2. **Commit Changes**

   ```bash
   git add src-tauri/tauri.conf.json src-tauri/Cargo.toml package.json
   git commit -m "chore: bump version to x.y.z"
   ```

3. **Create and Push a Tag**

   ```bash
   git tag vx.y.z
   git push origin main
   git push origin vx.y.z
   ```

   Replace `x.y.z` with the actual version number (e.g., `v1.0.0-beta.2`).

4. **Monitor the Build**

   The GitHub Actions workflow will automatically start when you push the tag. Monitor progress in the **Actions** tab of the GitHub repository. The workflow runs three parallel jobs (macOS ARM, macOS Intel, Linux).

5. **Publish the Release**

   Once the workflow completes:

   - Go to the **Releases** section in the GitHub repository
   - Find the draft release created by the workflow
   - Review the release notes and attached assets
   - Click **Publish release** when ready

   Publishing the release makes the updater artifacts (`latest.json`) available, which triggers in-app update notifications for existing users.

## Release Assets

The workflow creates the following assets:

### macOS
- DMG installer for Apple Silicon (`ForgeKey_x.y.z_aarch64.dmg`)
- DMG installer for Intel (`ForgeKey_x.y.z_x86_64.dmg`)

### Linux
- AppImage (`ForgeKey_x.y.z_amd64.AppImage`)
- Debian package (`ForgeKey_x.y.z_amd64.deb`)

### Auto-Updater
- `latest.json` — Manifest used by the in-app auto-updater to detect and download new versions

## Install Script

Users can install ForgeKey via the install script:

```bash
curl -fsSL https://raw.githubusercontent.com/ForgeKey/ForgeKey/main/install.sh | bash
```

## Auto-Updater

ForgeKey includes a built-in auto-updater (`@tauri-apps/plugin-updater`). When a new release is published, existing users receive an in-app notification to update. The updater verifies signatures using the public key configured in `src-tauri/tauri.conf.json` under `plugins.updater.pubkey`.
