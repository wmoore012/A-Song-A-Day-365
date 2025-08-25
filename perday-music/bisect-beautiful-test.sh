#!/bin/bash
set -e

echo "Testing commit: $(git rev-parse HEAD)"
echo "Commit message: $(git log -1 --pretty=format:'%s')"

# Change to perday-music directory
cd perday-music

# Check if key beautiful components exist
echo "Checking for beautiful website components..."

# Check for ShaderBackground component
if grep -q "ShaderBackground" src/App.tsx; then
    echo "✅ ShaderBackground found in App.tsx"
else
    echo "❌ ShaderBackground missing from App.tsx"
    exit 1
fi

# Check for sophisticated shader effects
if grep -q "ShaderShowcase\|ShaderBackground\|PulsingCircle" src/App.tsx; then
    echo "✅ Sophisticated shader components found"
else
    echo "❌ Sophisticated shader components missing"
    exit 1
fi

# Check for beautiful styling
if grep -q "bg-gradient\|from-cyan\|to-purple\|glow\|neon" src/styles/index.css; then
    echo "✅ Beautiful gradient/glow styling found"
else
    echo "❌ Beautiful gradient/glow styling missing"
    exit 1
fi

# Check for GSAP animations
if grep -q "gsap\|GSAP" src/components/*.tsx 2>/dev/null; then
    echo "✅ GSAP animations found"
else
    echo "❌ GSAP animations missing"
    exit 1
fi

# Check if the app builds and runs
echo "Installing dependencies..."
npm ci

echo "Running build..."
npm run build

echo "✅ Beautiful website features found!"
exit 0
