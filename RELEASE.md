# Release Process for ForgeKey

This document outlines the process for creating and publishing new releases of ForgeKey.

## Release Workflow

ForgeKey uses GitHub Actions to automate the build and release process. The workflow builds macOS versions for both Apple Silicon (M1/M2/M3) and Intel processors. Linux and Windows are not yet supported.

### Prerequisites

- Push access to the repository
- GitHub permissions to create releases

## Creating a New Release

1. **Update Version Numbers**

   Update the version number in the following files:

   - `src-tauri/tauri.conf.json`
   - `package.json`

2. **Commit Changes**

   ```bash
   git add src-tauri/tauri.conf.json package.json
   git commit -m "Bump version to x.y.z"
   ```

3. **Create and Push a Tag**

   ```bash
   git tag vx.y.z
   git push origin main
   git push origin vx.y.z
   ```

   Replace `x.y.z` with the actual version number (e.g., `v1.0.1`).

4. **Monitor the Build**

   The GitHub Actions workflow will automatically start when you push the tag. You can monitor the progress in the "Actions" tab of the GitHub repository.

5. **Publish the Release**

   Once the workflow completes:

   - Go to the "Releases" section in your GitHub repository
   - Find the draft release created by the workflow
   - Review the release notes and attached assets
   - Click "Publish release" when ready

## Release Assets

The workflow creates the following assets:

- DMG installer for Apple Silicon Macs (`ForgeKey_x.y.z_aarch64.dmg`)
- DMG installer for Intel Macs (`ForgeKey_x.y.z_x86_64.dmg`)
