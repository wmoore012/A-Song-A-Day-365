#!/bin/bash
set -e

echo "Testing commit: $(git rev-parse HEAD)"
echo "Commit message: $(git log -1 --pretty=format:'%s')"

# Change to perday-music directory
cd perday-music

# Clean install dependencies
echo "Installing dependencies..."
npm ci

# Run tests
echo "Running tests..."
npm test -- --silent

# Run build
echo "Running build..."
npm run build

echo "✅ Commit is GOOD"
exit 0
