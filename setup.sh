#!/bin/bash

# ============================================
# TikTok Creator Dashboard — Quick Setup
# ============================================

echo ""
echo "=========================================="
echo "  TikTok Creator Dashboard — Setup"
echo "=========================================="
echo ""

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo "Node.js is not installed."
    echo ""
    echo "Install it from: https://nodejs.org (download the LTS version)"
    echo "Or if you have Homebrew: brew install node"
    echo ""
    echo "After installing Node.js, run this script again."
    exit 1
fi

NODE_VERSION=$(node -v)
echo "Node.js found: $NODE_VERSION"

# Check for npm
if ! command -v npm &> /dev/null; then
    echo "npm is not installed. It usually comes with Node.js."
    echo "Try reinstalling Node.js from https://nodejs.org"
    exit 1
fi

echo "npm found: $(npm -v)"
echo ""

# Create .env if it doesn't exist
if [ -f .env ]; then
    echo ".env file already exists. Skipping creation."
    echo ""
else
    echo "Let's set up your configuration."
    echo ""

    # Apify token
    echo "You need an Apify API token to scrape TikTok."
    echo "Get yours at: https://console.apify.com/account/integrations"
    echo ""
    read -p "Paste your Apify API token: " APIFY_TOKEN
    echo ""

    # TikTok username
    echo "Enter the TikTok username you want to analyze."
    echo "Just the username, no @ symbol."
    echo "Example: charlidamelio"
    echo ""
    read -p "TikTok username: " TIKTOK_USER
    echo ""

    # How many videos
    read -p "How many recent videos to pull? (default: 20): " VIDEO_COUNT
    VIDEO_COUNT=${VIDEO_COUNT:-20}

    # Write .env
    cat > .env << EOF
APIFY_API_TOKEN=$APIFY_TOKEN
TIKTOK_PROFILES=$TIKTOK_USER
VIDEOS_PER_PROFILE=$VIDEO_COUNT
EOF

    echo ""
    echo ".env file created!"
fi

# Install dependencies
echo "Installing dependencies..."
echo ""
npm install

echo ""
echo "=========================================="
echo "  Setup complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo ""
echo "  1. Run the scraper:"
echo "     npm run pipeline"
echo ""
echo "  2. In Claude Code, run the analysis:"
echo "     > classify the hooks"
echo "     > generate content ideas"
echo "     > suggest signature series"
echo ""
echo "  3. View your dashboard:"
echo "     npm start"
echo "     Open http://localhost:3456"
echo ""
