variable "environment" {
  description = "Environment name"
  type = string
}

variable "enable_tags" {
  type    = bool
  default = false
}

variable "region" {
  description = "AWS region where resources will be created"
  type        = string
  default     = "us-east-1"
}
variable "common_tags" {
  description = "value"
  type = map(string)
}

variable "s3_bucket_name" {
  description = "S3 bucket name"
  type = string
}