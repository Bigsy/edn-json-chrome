#!/bin/bash

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Remove old zip if it exists
rm -f edn-json-converter.zip

# Create new zip with required files
echo "Creating zip file..."
zip -r edn-json-converter.zip \
    manifest.json \
    popup.html \
    popup.js \
    styles.css \
    edn-parser.js \
    icons/ \
    lib/

echo "Done! Created edn-json-converter.zip"
