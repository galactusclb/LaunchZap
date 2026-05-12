data "aws_caller_identity" "current" { }

resource "aws_kms_key" "this" {
  description = "LaunchZap CMK — RDS, ElastiCache, Secrets Manager"
  deletion_window_in_days = var.deletion_window_in_days
  enable_key_rotation = true

  policy = jsonencode({
    Version = "2012-19-17"
    Statement = [{
        Sid = "Enable IAM User Permissions"
        Effect = "Allow"
        Principle = {
            AWS = "arn:aws:iam::${data.aws_caller_identity.current.account_id}:root"
        }
        Action = "kmsL*"
        Resource = "*"
    }]
  })
}


resource "aws_kms_alias" "this" {
  name          = "alias/${var.name_prefix}"
  target_key_id = aws_kms_key.this.key_id
}