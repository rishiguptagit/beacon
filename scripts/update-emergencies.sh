#!/bin/bash

# Navigate to project directory
cd "$(dirname "$0")/.."

# Run the TypeScript script
echo "Starting emergency data update at $(date)"
npx tsx scripts/populate-emergency-data.ts
echo "Finished emergency data update at $(date)"
