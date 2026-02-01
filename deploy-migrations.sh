#!/bin/bash

# Safe Migration Deployment Script
# This script ONLY applies schema changes (migrations) to production.
# It does NOT delete or seed any data.

set -e

echo "🚀 Deploying database migrations to production..."
echo ""

# Check if PROD_DATABASE_URL is set
if [ -z "$PROD_DATABASE_URL" ]; then
    echo "❌ Error: PROD_DATABASE_URL environment variable is not set"
    echo ""
    echo "Usage:"
    echo "  PROD_DATABASE_URL='your-production-connection-string' ./deploy-migrations.sh"
    echo ""
    echo "Or if defined in .env.local:"
    echo "  source .env.local && ./deploy-migrations.sh"
    echo ""
    exit 1
fi

echo "📊 Running Prisma migrate deploy..."
# 'migrate deploy' applies pending migrations without resetting the DB
DATABASE_URL="$PROD_DATABASE_URL" npx prisma migrate deploy

echo ""
echo "✅ Migrations applied successfully!"
