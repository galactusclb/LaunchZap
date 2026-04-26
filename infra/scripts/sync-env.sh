#!/bin/bash
set -e

CLOUDFRONT_DOMAIN=$(terraform -chdir=infra output -raw cloudfront_domain_name)
S3_BUCKET_NAME=$(terraform -chdir=infra output -raw s3_bucket_name)

cat > web/.env.infra <<EOF
NEXT_PUBLIC_CLOUDFRONT_DOMAIN=$CLOUDFRONT_DOMAIN
AWS_S3_BUCKET_NAME=$S3_BUCKET_NAME
EOF

echo "✓ web/.env.local updated ✅"