variable "environment" {
  description = "Deployment environment (e.g. dev, staging, prod)"
  type        = string
}

variable "region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}

variable "common_tags" {
  description = "Common tags applied to all resources"
  type        = map(string)
  default     = {}
}

variable "s3_bucket_name" {
  description = "Globally unique name for the S3 bucket"
  type        = string
}

variable "secret_manager_name" {
  description = "Name of the Secrets Manager secret"
  type        = string
}