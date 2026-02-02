#!/bin/bash
# Dental Bids MVP - Complete Setup Script
# Run this after cloning the repository

set -e

echo "====================================="
echo "Dental Bids MVP Setup"
echo "====================================="
echo ""

# Create directory structure
echo "Creating project structure..."

mkdir -p backend/src/auth
mkdir -p backend/src/cases
mkdir -p backend/src/bids
mkdir -p backend/src/stripe
mkdir -p backend/src/common
mkdir -p backend/prisma
mkdir -p backend/scripts
mkdir -p frontend/src/app
mkdir -p frontend/src/components
mkdir -p frontend/src/lib
mkdir -p terraform

echo "Project structure created!"
echo ""
echo "NEXT STEPS:"
echo "1. Review the DEPLOYMENT.md file for complete code files"
echo "2. Copy all code files from DEPLOYMENT.md to their respective locations"
echo "3. Run: cd backend && npm install"
echo "4. Configure .env files in both backend and frontend"
echo "5. Run: npx prisma migrate dev"
echo "6. Follow deployment steps in DEPLOYMENT.md"
echo ""
echo "All code is documented in DEPLOYMENT.md - open it to get started!"
