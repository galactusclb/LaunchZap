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

variable "vpc_name" {
  type = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC"
  type        = string

  validation {
    condition     = can(cidrnetmask(var.vpc_cidr))
    error_message = "vpc_cidr must be a valid CIDR block."
  }
}

variable "availability_zones" {
  description = "List of availability zones to deploy subnets into"
  type        = list(string)
}

variable "subnets" {
  description = "Map of subnet tiers to lists of CIDR blocks"
  type        = map(list(string))
}

variable "s3_bucket_name" {
  description = "Globally unique name for the S3 bucket"
  type        = string
}

variable "secret_manager_name" {
  description = "Name of the Secrets Manager secret"
  type        = string
}

variable "name_prefix" {
  description = "Prefix applied to all resource names (e.g. launchwap-dev)"
  type        = string
}

variable "api_port" {
  type    = number
  default = 4000
}

variable "web_port" {
  type    = number
  default = 3000
}