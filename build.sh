#!/usr/bin/env bash
# Exit on error
set -o errexit

# Build Frontend
echo "Building Frontend..."
cd Webapp/frontend
npm install
npm run build
cd ../..

# Install Backend Dependencies
echo "Installing Backend Dependencies..."
pip install -r Project/requirments.txt
