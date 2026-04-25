provider "aws" {
  profile = "bit"
  region  = var.region

  default_tags {
    tags = var.common_tags
  }
}

module "s3" {
  source = "./resources/s3"

  s3_bucket_name = var.s3_bucket_name
}

module "secret-manager" {
  source = "./resources/secret-manager"

  secret_manager_name = var.secret_manager_name
  secrets_object = {
    S3_BUCKET_NAME = module.s3.s3_bucket_name
  }
}