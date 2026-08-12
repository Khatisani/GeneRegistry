#!/usr/bin/env bash

echo "Setting up GeneRegistry project..."

forge install foundry-rs/forge-std --no-commit

forge remappings > remappings.txt

echo "Setup complete!"