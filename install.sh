#!/usr/bin/env bash
set -euo pipefail

# ForgeKey Installer
# Usage: curl -fsSL https://forgekey.dev/install.sh | bash
#
# Installs the ForgeKey menu bar app for managing Foundry keystores.
# Supports macOS (ARM64, x86_64) and Linux (x86_64, ARM64)
#
# Linux package selection:
#   - Debian/Ubuntu: .deb package (installed via apt/dpkg)
#   - Fedora/RHEL/CentOS: .rpm package (installed via dnf/yum)
#   - Other distros: AppImage (universal, no root required)

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

# Detect Linux distribution family
detect_linux_distro() {
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        case "$ID" in
            debian|ubuntu|linuxmint|pop|elementary|zorin|kali)
                echo "debian"
                ;;
            fedora|rhel|centos|rocky|alma|ol)
                echo "redhat"
                ;;
            opensuse*|sles)
                echo "redhat"  # Also uses RPM
                ;;
            *)
                # Check ID_LIKE for derivatives
                case "$ID_LIKE" in
                    *debian*|*ubuntu*) echo "debian" ;;
                    *fedora*|*rhel*)   echo "redhat" ;;
                    *)                  echo "unknown" ;;
                esac
                ;;
        esac
    elif [ -f /etc/debian_version ]; then
        echo "debian"
    elif [ -f /etc/redhat-release ]; then
        echo "redhat"
    else
        echo "unknown"
    fi
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

    # Tauri uses base semver (without prerelease suffix) for filenames
    local base_version="${version#v}"
    base_version="${base_version%%-*}"
    # Map arch names for macOS DMG files (x86_64 -> x64, aarch64 stays aarch64)
    local file_arch="$arch"
    if [ "$arch" = "x86_64" ]; then
        file_arch="x64"
    fi
    local filename="ForgeKey_${base_version}_${file_arch}.dmg"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    local tmpdir=$(mktemp -d)

    info "Downloading ForgeKey ${version} for macOS (${arch})..."
    curl -fsSL -o "${tmpdir}/ForgeKey.dmg" "$url" || error "Failed to download: $url"

    info "Mounting disk image..."
    local mount_output=$(hdiutil attach "${tmpdir}/ForgeKey.dmg" -nobrowse 2>/dev/null)
    local mount_point=$(echo "$mount_output" | grep -o '/Volumes/[^"]*' | head -1)
    [ -z "$mount_point" ] && error "Failed to mount disk image"

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

# Download and install .deb package (Debian/Ubuntu)
install_deb() {
    local version="$1"
    local arch="$2"

    # Tauri uses base semver (without prerelease suffix) for filenames
    local base_version="${version#v}"
    base_version="${base_version%%-*}"
    # deb uses amd64 for x86_64
    local file_arch="$arch"
    if [ "$arch" = "x86_64" ]; then
        file_arch="amd64"
    fi
    local filename="ForgeKey_${base_version}_${file_arch}.deb"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    local tmpdir=$(mktemp -d)

    info "Downloading ForgeKey ${version} (.deb) for Linux (${arch})..."
    curl -fsSL -o "${tmpdir}/forgekey.deb" "$url" || error "Failed to download: $url"

    info "Installing package (requires sudo)..."
    if command -v apt &> /dev/null; then
        sudo apt install -y "${tmpdir}/forgekey.deb"
    elif command -v dpkg &> /dev/null; then
        sudo dpkg -i "${tmpdir}/forgekey.deb"
        sudo apt-get install -f -y 2>/dev/null || true  # Fix dependencies
    else
        error "Neither apt nor dpkg found"
    fi

    rm -rf "$tmpdir"

    success "ForgeKey installed via package manager"
    echo ""
    echo "To start ForgeKey, run:"
    echo "  forgekey"
    echo ""
    echo "Or find it in your application menu."
    echo ""
    echo "To uninstall: sudo apt remove forgekey"
}

# Download and install .rpm package (Fedora/RHEL)
install_rpm() {
    local version="$1"
    local arch="$2"

    # Tauri uses base semver (without prerelease suffix) for filenames
    local base_version="${version#v}"
    base_version="${base_version%%-*}"
    # rpm uses x86_64 (not amd64)
    local file_arch="$arch"
    # RPM filename format: ForgeKey-1.0.0-1.x86_64.rpm
    local filename="ForgeKey-${base_version}-1.${file_arch}.rpm"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    local tmpdir=$(mktemp -d)

    info "Downloading ForgeKey ${version} (.rpm) for Linux (${arch})..."
    curl -fsSL -o "${tmpdir}/forgekey.rpm" "$url" || error "Failed to download: $url"

    info "Installing package (requires sudo)..."
    if command -v dnf &> /dev/null; then
        sudo dnf install -y "${tmpdir}/forgekey.rpm"
    elif command -v yum &> /dev/null; then
        sudo yum install -y "${tmpdir}/forgekey.rpm"
    elif command -v zypper &> /dev/null; then
        sudo zypper install -y "${tmpdir}/forgekey.rpm"
    elif command -v rpm &> /dev/null; then
        sudo rpm -i "${tmpdir}/forgekey.rpm"
    else
        error "No RPM package manager found (dnf, yum, zypper, rpm)"
    fi

    rm -rf "$tmpdir"

    success "ForgeKey installed via package manager"
    echo ""
    echo "To start ForgeKey, run:"
    echo "  forgekey"
    echo ""
    echo "Or find it in your application menu."
    echo ""
    echo "To uninstall: sudo dnf remove forgekey (or yum/zypper)"
}

# Download and install AppImage (fallback for other distros)
install_appimage() {
    local version="$1"
    local arch="$2"
    local install_dir="${INSTALL_DIR:-$HOME/.local/bin}"
    local app_dir="$HOME/.local/share/applications"
    local icon_dir="$HOME/.local/share/icons/hicolor/256x256/apps"

    # Tauri uses base semver (without prerelease suffix) for filenames
    local base_version="${version#v}"
    base_version="${base_version%%-*}"
    # AppImage uses amd64 for x86_64
    local file_arch="$arch"
    if [ "$arch" = "x86_64" ]; then
        file_arch="amd64"
    fi
    local filename="ForgeKey_${base_version}_${file_arch}.AppImage"
    local url="https://github.com/${REPO}/releases/download/${version}/${filename}"
    local tmpdir=$(mktemp -d)

    info "Downloading ForgeKey ${version} (AppImage) for Linux (${arch})..."
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
    echo ""
    echo "To uninstall: rm ${install_dir}/ForgeKey ${app_dir}/forgekey.desktop"
}

# Download and install for Linux (auto-detect best format)
install_linux() {
    local version="$1"
    local arch="$2"
    local distro=$(detect_linux_distro)

    info "Detected distribution family: ${distro}"

    case "$distro" in
        debian)
            install_deb "$version" "$arch"
            ;;
        redhat)
            install_rpm "$version" "$arch"
            ;;
        *)
            warn "Unknown distribution, using AppImage (universal format)"
            install_appimage "$version" "$arch"
            ;;
    esac
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
