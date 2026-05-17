provider "aws" {
  profile = "bit"
  region  = "us-east-1"
}

module "ecr" {
  source = "./ecr"
}