environment = "dev"
region = "us-east-1"

common_tags = {
    ManagedBy = "Terraform"
    Project = "LaunchZap"
    Environment = "dev"
}


#S3
s3_bucket_name="launchzap-bucket-dev-1"

#Secret Manager
secret_manager_name="launchzap/app-config/dev"
