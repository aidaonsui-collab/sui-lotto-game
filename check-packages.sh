#!/bin/bash

echo "Checking if Radix UI packages exist in node_modules..."
echo ""

packages=(
  "@radix-ui/react-avatar"
  "@radix-ui/react-label"
  "@radix-ui/react-tabs"
  "@radix-ui/react-tooltip"
)

for package in "${packages[@]}"; do
  if [ -d "node_modules/$package" ]; then
    echo "✓ $package - FOUND"
  else
    echo "✗ $package - MISSING"
  fi
done

echo ""
echo "Attempting to manually install missing packages..."
npm install @radix-ui/react-avatar@1.1.2 @radix-ui/react-label@2.1.1 @radix-ui/react-tabs@1.1.2 @radix-ui/react-tooltip@1.1.6 --force
