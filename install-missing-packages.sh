#!/bin/bash

echo "Installing missing Radix UI packages..."

npm install @radix-ui/react-avatar@1.1.2 \
  @radix-ui/react-label@2.1.1 \
  @radix-ui/react-tabs@1.1.2 \
  @radix-ui/react-tooltip@1.1.6 \
  @radix-ui/react-dialog@1.1.4 \
  @radix-ui/react-dropdown-menu@2.1.4 \
  @radix-ui/react-progress@1.1.1 \
  @radix-ui/react-select@2.1.4 \
  @radix-ui/react-slider@1.2.1 \
  @radix-ui/react-switch@1.1.2

echo "Installation complete! Now run: npm run dev"
