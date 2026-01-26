#!/usr/bin/env bash
set -euo pipefail

# ForgeKey Installer
# Usage: curl -fsSL https://forgekey.dev/install.sh | bash
#
# Installs the ForgeKey menu bar app for managing Foundry keystores.
# Supports macOS (ARM64, x86_64) and Linux (x86_64, ARM64)

REPO="ForgeKey/ForgeKey"
INSTALL_DIR="${FORGEKEY_INSTALL_DIR:-}"
VERSION="${FORGEKEY_VERSION:-latest}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

info() { echo -e "${BLUE}==>${NC} $1"; }
success() { echo -e "${GREEN}==>${NC} $1"; }
warn() { echo -e "${YELLOW}==>${NC} $1"; }
error() { echo -e "${RED}error:${NC} $1" >&2; exit 1; }

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Darwin*) echo "macos" ;;
        Linux*)  echo "linux" ;;
        *)       error "Unsupported operating system: $(uname -s)" ;;
    esac
}

# Detect architecture
detect_arch() {
    case "$(uname -m)" in
        x86_64|amd64)  echo "x86_64" ;;
        arm64|aarch64) echo "aarch64" ;;
        *)             error "Unsupported architecture: $(uname -m)" ;;
    esac
}

# Get latest release version from GitHub
get_latest_version() {
    curl -fsSL "https://api.github.com/repos/${REPO}/releases/latest" |
        grep '"tag_name":' |
        sed -E 's/.*"([^"]+)".*/\1/'
}

# Download and install for macOS
install_macos() {
    local version="$1"
    local arch="$2"
    local install_dir="${INSTALL_DIR:-/Applications}"

    local filename="ForgeKey_${version#v}_${arch}.dmg"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    local tmpdir=$(mktemp -d)

    info "Downloading ForgeKey ${version} for macOS (${arch})..."
    curl -fsSL -o "${tmpdir}/ForgeKey.dmg" "$url" || error "Failed to download: $url"

    info "Mounting disk image..."
    local mount_point=$(hdiutil attach "${tmpdir}/ForgeKey.dmg" -nobrowse -quiet | tail -1 | awk '{print $3}')

    info "Installing to ${install_dir}..."
    # Remove existing installation
    if [ -d "${install_dir}/ForgeKey.app" ]; then
        warn "Removing existing installation..."
        rm -rf "${install_dir}/ForgeKey.app"
    fi

    cp -R "${mount_point}/ForgeKey.app" "${install_dir}/"

    info "Cleaning up..."
    hdiutil detach "$mount_point" -quiet
    rm -rf "$tmpdir"

    success "ForgeKey installed to ${install_dir}/ForgeKey.app"
    echo ""
    echo "To start ForgeKey, run:"
    echo "  open ${install_dir}/ForgeKey.app"
    echo ""
    echo "Or find it in your Applications folder."
}

# Download and install for Linux
install_linux() {
    local version="$1"
    local arch="$2"
    local install_dir="${INSTALL_DIR:-$HOME/.local/bin}"
    local app_dir="$HOME/.local/share/applications"
    local icon_dir="$HOME/.local/share/icons/hicolor/256x256/apps"

    # Map arch names for Linux packages
    local pkg_arch="$arch"
    if [ "$arch" = "x86_64" ]; then
        pkg_arch="amd64"
    elif [ "$arch" = "aarch64" ]; then
        pkg_arch="arm64"
    fi

    local filename="ForgeKey_${version#v}_${arch}.AppImage"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    local tmpdir=$(mktemp -d)

    info "Downloading ForgeKey ${version} for Linux (${arch})..."
    curl -fsSL -o "${tmpdir}/ForgeKey.AppImage" "$url" || error "Failed to download: $url"

    info "Installing to ${install_dir}..."
    mkdir -p "$install_dir"

    # Remove existing installation
    if [ -f "${install_dir}/ForgeKey" ]; then
        warn "Removing existing installation..."
        rm -f "${install_dir}/ForgeKey"
    fi

    mv "${tmpdir}/ForgeKey.AppImage" "${install_dir}/ForgeKey"
    chmod +x "${install_dir}/ForgeKey"

    # Create desktop entry
    info "Creating desktop entry..."
    mkdir -p "$app_dir"
    cat > "${app_dir}/forgekey.desktop" << EOF
[Desktop Entry]
Name=ForgeKey
Comment=Foundry Keystore Manager
Exec=${install_dir}/ForgeKey
Icon=forgekey
Type=Application
Categories=Development;Utility;
StartupWMClass=ForgeKey
EOF

    # Extract and install icon from AppImage (optional, skip if fails)
    if command -v "${install_dir}/ForgeKey" &> /dev/null; then
        mkdir -p "$icon_dir" 2>/dev/null || true
        # AppImage icons are typically at usr/share/icons inside
        "${install_dir}/ForgeKey" --appimage-extract usr/share/icons &>/dev/null || true
        if [ -f "squashfs-root/usr/share/icons/hicolor/256x256/apps/forgekey.png" ]; then
            cp "squashfs-root/usr/share/icons/hicolor/256x256/apps/forgekey.png" "$icon_dir/" 2>/dev/null || true
        fi
        rm -rf squashfs-root 2>/dev/null || true
    fi

    rm -rf "$tmpdir"

    success "ForgeKey installed to ${install_dir}/ForgeKey"
    echo ""

    # Check if install_dir is in PATH
    if [[ ":$PATH:" != *":${install_dir}:"* ]]; then
        warn "${install_dir} is not in your PATH"
        echo ""
        echo "Add it to your shell profile:"
        echo "  echo 'export PATH=\"\$PATH:${install_dir}\"' >> ~/.bashrc"
        echo ""
    fi

    echo "To start ForgeKey, run:"
    echo "  ForgeKey"
    echo ""
    echo "Or find it in your application menu."
}

main() {
    echo ""
    echo "  ╔═══════════════════════════════════════╗"
    echo "  ║         ForgeKey Installer            ║"
    echo "  ║   Foundry Keystore Manager            ║"
    echo "  ╚═══════════════════════════════════════╝"
    echo ""

    # Check for required tools
    command -v curl &> /dev/null || error "curl is required but not installed"

    local os=$(detect_os)
    local arch=$(detect_arch)

    info "Detected: ${os} (${arch})"

    # Get version
    local version="$VERSION"
    if [ "$version" = "latest" ]; then
        info "Fetching latest version..."
        version=$(get_latest_version)
        [ -z "$version" ] && error "Failed to fetch latest version"
    fi

    info "Installing version: ${version}"

    case "$os" in
        macos) install_macos "$version" "$arch" ;;
        linux) install_linux "$version" "$arch" ;;
    esac

    success "Installation complete!"
}

main "$@"
