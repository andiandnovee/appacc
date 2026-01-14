#!/bin/bash
# Create assets symlink for SPA
cd "$(dirname "$0")/public"
if [ ! -e assets ]; then
    ln -s spa/assets assets
    echo "✓ Created /public/assets -> /public/spa/assets symlink"
else
    echo "✓ /public/assets already exists"
fi
