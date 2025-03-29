#!/bin/bash

# Print Node and npm versions
echo "Node version: $(node -v)"
echo "npm version: $(npm -v)"

# Clear npm cache
echo "Clearing npm cache..."
npm cache clean --force

# Install dependencies with specific flags to avoid issues
echo "Installing dependencies..."
npm install --legacy-peer-deps --no-optional --no-shrinkwrap --no-package-lock

# Build the application
echo "Building application..."
npm run build

echo "Build process completed!" 