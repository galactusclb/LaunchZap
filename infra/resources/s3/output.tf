output "S3_BUCKET_NAME" {
  value = aws_s3_bucket.this.bucket
}

output "S3_BUCKET_id" {
  value = aws_s3_bucket.this.id
}

output "S3_BUCKET_arn" {
  value = aws_s3_bucket.this.arn
}

output "s3_bucket_dns" {
  value = aws_s3_bucket.this.bucket_domain_name
}