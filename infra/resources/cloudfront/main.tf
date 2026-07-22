locals {
  private_routes = [
    "/api/auth/*",
    "/api/users/*",
    "/api/health",
  ]
}

data "aws_cloudfront_cache_policy" "caching_optimized" {
  name = "Managed-CachingOptimized"
}

data "aws_cloudfront_cache_policy" "caching_disabled" {
  name = "Managed-CachingDisabled"
}

data "aws_cloudfront_origin_request_policy" "all_viewer" {
  name = "Managed-AllViewer"
}

resource "aws_cloudfront_cache_policy" "api_cacheable" {
  name = "api-cacheable-respect-origin"
  min_ttl = 0
  default_ttl = 30
  max_ttl = 300

  parameters_in_cache_key_and_forwarded_to_origin {
    cookies_config {
      cookie_behavior = "none"
    }
    headers_config {
      header_behavior = "none"
    }
    query_strings_config {
      query_string_behavior = "all"
    }
    enable_accept_encoding_gzip   = true
    enable_accept_encoding_brotli = true
  }
}
resource "aws_cloudfront_origin_access_control" "s3_oac" {
  name = "s3-oac"
  origin_access_control_origin_type = "s3"
  signing_behavior = "always"
  signing_protocol = "sigv4"
}

resource "aws_cloudfront_distribution" "this" {
  enabled = true

  origin {
    domain_name = var.bucket_regional_domain_name
    origin_id = "s3-origin"
    origin_access_control_id = aws_cloudfront_origin_access_control.s3_oac.id
  }

  origin {
    domain_name = var.alb_dns_name
    origin_id = "alb-origin"

    custom_origin_config {
      origin_protocol_policy = "http-only"
      http_port = 80
      https_port = 443
      origin_ssl_protocols = ["TLSv1.2"]
    }
  }

  default_cache_behavior {
    target_origin_id = "s3-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods = ["GET", "HEAD"]
    cached_methods = ["GET", "HEAD"]
    cache_policy_id = data.aws_cloudfront_cache_policy.caching_optimized.id
    response_headers_policy_id = aws_cloudfront_response_headers_policy.broswer_cache_headers.id
  }

  //skip caching private endoints
  dynamic "ordered_cache_behavior" {
    for_each = local.private_routes

    content {
      path_pattern = ordered_cache_behavior.value

      target_origin_id = "alb-origin"
      viewer_protocol_policy = "redirect-to-https"
      cache_policy_id = data.aws_cloudfront_cache_policy.caching_disabled.id
      origin_request_policy_id  = data.aws_cloudfront_origin_request_policy.all_viewer.id
      allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
      cached_methods         = ["GET", "HEAD"]
    }
  }

  //! enabled caching for public routes | Private routes should add before this block
  ordered_cache_behavior {
    path_pattern = "/api/*"
    target_origin_id       = "alb-origin"
    viewer_protocol_policy = "redirect-to-https"
    cache_policy_id  = aws_cloudfront_cache_policy.api_cacheable.id
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods         = ["GET", "HEAD"]
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
 
  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

resource "aws_cloudfront_response_headers_policy" "broswer_cache_headers" {
  name = "browser-cache-policy"

  custom_headers_config {
    items {
      header = "Cache-Control"
      value = "public, max-age=31536000, immutable"
      override = false
    }
  }
}

resource "aws_s3_bucket_policy" "cloudfront_aoc" {
  bucket = var.bucket_id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
        Effect = "Allow"
        Principal = { Service = "cloudfront.amazonaws.com" }
        Action = "s3:GetObject"
        Resource = "${var.bucket_arn}/*"
        Condition = {
            StringEquals = {
                "AWS:SourceArn" = aws_cloudfront_distribution.this.arn
            }
        }
    }]
  })
}