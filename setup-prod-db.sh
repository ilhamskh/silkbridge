#!/bin/bash

# Production Database Setup Script
# This script initializes your production database with tables and seed data

set -e  # Exit on any error

echo "🚀 Setting up production database..."
echo ""

# Check if PROD_DATABASE_URL is set
if [ -z "$PROD_DATABASE_URL" ]; then
    echo "❌ Error: PROD_DATABASE_URL environment variable is not set"
    echo ""
    echo "Usage:"
    echo "  PROD_DATABASE_URL='your-production-connection-string' ./setup-prod-db.sh"
    echo ""
    exit 1
fi

echo "📊 Running Prisma migrations..."
DATABASE_URL="$PROD_DATABASE_URL" npx prisma migrate deploy

echo ""
echo "🌱 Seeding database with initial data..."
DATABASE_URL="$PROD_DATABASE_URL" npx tsx prisma/seed.ts
DATABASE_URL="$PROD_DATABASE_URL" npx tsx prisma/seed-faqs.ts

echo ""
echo "✅ Production database setup complete!"
echo ""
echo "Next steps:"
echo "  1. Verify your Vercel deployment now works"
echo "  2. Check that all pages load correctly"
echo ""
