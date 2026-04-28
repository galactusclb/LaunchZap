.PHONY: infra-apply infra-plan sync-env infra-refresh deploy


infra-apply:
	terraform -chdir=infra apply --var-file=environments/dev/terraform.tfvars -auto-approve

infra-plan:
	terraform -chdir=infra plan --var-file=environments/dev/terraform.tfvars

infra-refresh:
	terraform -chdir=infra refresh  --var-file=environments/dev/terraform.tfvars

sync-dev:
	./infra/scripts/sync-env.sh

deploy: infra-apply sync-dev