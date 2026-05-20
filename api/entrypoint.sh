#!/bin/sh

set -e

echo "Generating RDS IAM auth token for migrations..."
TOKEN=$(node -e "
const { Signer } = require('@aws-sdk/rds-signer');
const signer = new Signer({
  hostname: process.env.RDS_PROXY_ENDPOINT,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  region: process.env.AWS_DEFAULT_REGION
});
signer.getAuthToken().then(t => process.stdout.write(encodeURIComponent(t)));
")

export DATABASE_URL="postgresql://${DB_USER}:${TOKEN}@${RDS_PROXY_ENDPOINT}:${DB_PORT}/${DB_NAME}?sslmode=require"

echo "DATABASE_URL = ${DATABASE_URL}"
echo "Applying Prisma migrations..."
npx prisma migrate deploy

unset DATABASE_URL

exec "$@"
