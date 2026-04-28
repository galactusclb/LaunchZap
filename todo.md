## Client
* Cache components ✅
* SSG / ISR ✅
* restrict auth based pages ✅
* Standardize API response {success, data, message, meta, error?} ✅
* SEO / AEO
* Accessibility Standards
* push dynamic data to the smallest possible leaf, cache the static shell
* Run env zod validation on startup 
* set up sentry
* startTransition, useTransition
* fix the logged user's voted products on refresh

## API
* Standardize API response {success, data, message, meta, error?}
* autocannon
* redis
* micro

## DB
* Indexing
* offset
* rds cluster
* sharding

## CI/CD


## Infrastructure
* cloudfront
* alb
* ec2 => ecs
* API gateway
* Lambda
* S3 - add 24H ttl for /tmp
* Cloudfront ✅ 
    * viewer_certificate - replace own with an ACM certificate ARN and ssl_support_method: sni-only