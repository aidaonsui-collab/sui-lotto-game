#!/bin/bash

# This fixes the Next.js config if you still have module resolution errors

cd ~/Desktop/sui-lotto-game

cat > next.config.mjs << 'EOF'
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      root: process.cwd(),
    },
  },
};

export default nextConfig;
EOF

echo "Next.js config updated! Now run: npm run dev"
