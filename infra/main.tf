provider "aws" {
  profile = "bit"
  region  = var.region

  default_tags {
    tags = var.common_tags
  }
}

module "vpc" {
  source = "./resources/vpc"

  vpc_name           = var.vpc_name
  availability_zones = var.availability_zones
  vpc_cidr           = var.vpc_cidr
  subnets            = var.subnets
}

module "security_groups" {
  source = "./resources/security-groups"

  vpc_id      = module.vpc.vpc_id
  name_prefix = var.name_prefix
  api_port    = var.api_port
  web_port    = var.web_port
}

module "s3" {
  source = "./resources/s3"

  s3_bucket_name = var.s3_bucket_name
}

module "cloudfront" {
  source = "./resources/cloudfront"

  bucket_regional_domain_name = module.s3.s3_bucket_regional_domain_name
  bucket_id                   = module.s3.s3_bucket_id
  bucket_arn                  = module.s3.s3_bucket_arn
}

# module "secret-manager" {
#   source = "./resources/secret-manager"

#   secret_manager_name = var.secret_manager_name
#   secrets_object = {
#     S3_BUCKET_NAME = module.s3.s3_bucket_name
#   }
# }