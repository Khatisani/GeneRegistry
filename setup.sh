#!/usr/bin/env bash

echo "Setting up GeneRegistry project..."

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
echo "Installing Foundry dependencies (forge-std)..."
forge install foundry-rs/forge-std --no-commit

echo "Generating Solidity remappings..."
forge remappings > remappings.txt

# 4. Install Frontend Dependencies
if [ -f "package.json" ]; then
  if [ -n "$PKG_MANAGER" ]; then
    echo "Installing frontend dependencies using $PKG_MANAGER..."
    $PKG_MANAGER install
  else
    echo "Warning: package.json found, but no package manager (npm/pnpm/yarn) is available."
  fi
fi

# 5. .env file if not present
if [ ! -f ".env.local" ] && [ ! -f ".env" ]; then
  if [ -f ".env.example" ]; then
    echo "Creating .env.local from .env.example..."
    cp .env.example .env.local
  else
    echo "Generating default .env.local template..."
    cat << 'EOF' > .env.local

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