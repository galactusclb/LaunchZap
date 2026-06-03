.PHONY: infra-apply infra-plan sync-env infra-refresh deploy analyze-bundle web-build


infra-apply:
	terraform -chdir=infra apply --var-file=environments/dev/terraform.tfvars -auto-approve

infra-plan:
	terraform -chdir=infra plan --var-file=environments/dev/terraform.tfvars

infra-refresh:
	terraform -chdir=infra refresh  --var-file=environments/dev/terraform.tfvars

sync-dev:
	./infra/scripts/sync-env.sh

deploy: infra-apply sync-dev

analyze-bundle:
	cd apps/web && \
	ANALYZE=true \
	NEXT_PUBLIC_API_BASE_URL=http://localhost:3001 \
	API_BASE_URL=http://localhost:3001 \
	AWS_REGION=us-east-1 \
	AWS_ACCESS_KEY_ID=dummy \
	AWS_SECRET_ACCESS_KEY=dummy \
	AWS_SECRET_MANAGER_SECRET_NAME=dummy \
	AWS_CLOUDFRONT_DOMAIN=dummy.cloudfront.net \
	AWS_S3_BUCKET_NAME=dummy-bucket \
	npx next build --webpack

web-build:
	cd apps/web && \
	NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api \
	API_BASE_URL=http://localhost:4000/api \
	AWS_REGION=us-east-1 \
	AWS_ACCESS_KEY_ID=dummy \
	AWS_SECRET_ACCESS_KEY=dummy \
	AWS_SECRET_MANAGER_SECRET_NAME=dummy \
	AWS_CLOUDFRONT_DOMAIN=dummy.cloudfront.net \
	AWS_S3_BUCKET_NAME=dummy-bucket \
	npx next build