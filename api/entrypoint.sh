#!/bin/sh

set -e

echo "Applying Prisma migrations..."
npx prisma migrate deploy

echo "Generating Prisma client..."
npx prisma generate

exec "$@"
