variable "name_prefix" {
  description = "Prefix applied to all IAM role and policy names"
  type        = string
}

variable "kms_key_arn" {
  description = "ARN of the KMS key the roles are allowed to decrypt with"
  type        = string
}