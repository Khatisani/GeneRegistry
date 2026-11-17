#!/usr/bin/env bash
set -e

echo "Setting up GeneRegistry project..."

# 0. Check macOS libusb dependency for Foundry
if [[ "$OSTYPE" == "darwin"* ]]; then
  if command -v brew &> /dev/null && ! brew list libusb &> /dev/null; then
    echo "Installing libusb via Homebrew (required by Foundry on macOS)..."
    brew install libusb
  fi
fi

# 1. Verify Foundry is installed
if ! command -v forge &> /dev/null; then
  echo "Error: 'forge' command not found."
  echo "Please install Foundry: curl -L https://foundry.paradigm.xyz | bash && foundryup"
  exit 1
fi

# 2. Detect Node package manager
PKG_MANAGER=""
if command -v npm &> /dev/null; then
  PKG_MANAGER="npm"
elif command -v pnpm &> /dev/null; then
  PKG_MANAGER="pnpm"
elif command -v yarn &> /dev/null; then
  PKG_MANAGER="yarn"
fi

# 3. Install Smart Contract Dependencies
if [ ! -d "lib/forge-std" ]; then
  echo "Installing Foundry dependencies (forge-std)..."
  forge install foundry-rs/forge-std
else
  echo "forge-std already installed."
fi

echo "Generating Solidity remappings..."
forge remappings > remappings.txt

# 4. Install Frontend Dependencies (inside frontend/)
if [ -f "frontend/package.json" ]; then
  if [ -n "$PKG_MANAGER" ]; then
    echo "Installing frontend dependencies using $PKG_MANAGER..."
    (cd frontend && $PKG_MANAGER install)
  else
    echo "Warning: frontend/package.json found, but no package manager (npm/pnpm/yarn) is available."
  fi
fi

# 5. Create frontend/.env.local if not present
if [ -d "frontend" ] && [ ! -f "frontend/.env.local" ] && [ ! -f "frontend/.env" ]; then
  if [ -f "frontend/.env.example" ]; then
    echo "Creating frontend/.env.local from frontend/.env.example..."
    cp frontend/.env.example frontend/.env.local
  else
    echo "Generating default frontend/.env.local template..."
    cat << 'EOF' > frontend/.env.local
# Sepolia RPC Configuration
NEXT_PUBLIC_SEPOLIA_RPC_URL="https://rpc.sepolia.org"

# Deployed Smart Contract Address
NEXT_PUBLIC_GENE_REGISTRY_ADDRESS=""

# Default Network (Sepolia: 11155111)
NEXT_PUBLIC_DEFAULT_CHAIN_ID=11155111
EOF
  fi
fi

echo "Setup complete."