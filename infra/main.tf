provider "aws" {
  profile = "bit"
  region  = var.region

  default_tags {
    tags = var.enable_tags ? merge(
      var.common_tags,
      {
        Environment = var.environment
      }
    ) : {}
  }
}

module "s3" {
  source = "./resources/s3"

  s3_bucket_name = var.s3_bucket_name
}