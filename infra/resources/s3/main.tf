resource "aws_s3_bucket" "this" {
  bucket = var.s3_bucket_name
}

resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# resource "aws_s3_bucket_public_access_block" "photoshare_assets_block_public" {
#   bucket = aws_s3_bucket.photoshare-assets-s3-bucket.id

#   block_public_acls = true
#   ignore_public_acls = true
#   block_public_policy = true
#   restrict_public_buckets = true
# }