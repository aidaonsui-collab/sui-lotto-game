#!/bin/bash

echo "Installing missing Radix UI packages..."

npm install --save \
  @radix-ui/react-avatar \
  @radix-ui/react-label \
  @radix-ui/react-tabs \
  @radix-ui/react-tooltip \
  @radix-ui/react-slot \
  @radix-ui/react-dialog \
  @radix-ui/react-dropdown-menu \
  --legacy-peer-deps

echo "Done! Now run: npm run dev"
