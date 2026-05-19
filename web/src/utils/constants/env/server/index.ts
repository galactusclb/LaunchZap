import "server-only"

import { apiBuildEnvSchema, awsRuntimeEnvSchema } from "./schema"

let _api: ReturnType<typeof apiBuildEnvSchema.parse> | undefined
let _aws: ReturnType<typeof awsRuntimeEnvSchema.parse> | undefined

function getApiEnv() {
    if (!_api) _api = apiBuildEnvSchema.parse({ API_BASE_URL: process.env.API_BASE_URL })
    return _api;
}

function getAwsEnv() {
    if (!_aws) {
        _aws = awsRuntimeEnvSchema.parse({
            API_BASE_URL: process.env.API_BASE_URL,
            AWS_REGION: process.env.AWS_REGION,
            AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
            AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
            AWS_SECRET_MANAGER_SECRET_NAME: process.env.AWS_SECRET_MANAGER_SECRET_NAME,
            AWS_CLOUDFRONT_DOMAIN: process.env.AWS_CLOUDFRONT_DOMAIN,
            AWS_S3_BUCKET_NAME: process.env.AWS_S3_BUCKET_NAME,
        })
    }
    return _aws
}

export const constants = {
    get API() {
        return { URL: getApiEnv().API_BASE_URL }
    },
    get AWS() {
        return {
            REGION: getAwsEnv().AWS_REGION,
            ACCESS_KEY_ID: getAwsEnv().AWS_ACCESS_KEY_ID,
            SECRET_ACCESS_KEY: getAwsEnv().AWS_SECRET_ACCESS_KEY,
            SECRET_MANAGER_SECRET_NAME: getAwsEnv().AWS_SECRET_MANAGER_SECRET_NAME,
            CLOUDFRONT_DOMAIN: getAwsEnv().AWS_CLOUDFRONT_DOMAIN,
            S3_BUCKET_NAME: getAwsEnv().AWS_S3_BUCKET_NAME,
        }
    },
}