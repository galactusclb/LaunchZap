import z from "zod"

export const serverEnvSchema = z.object({
    API_BASE_URL: z.string().min(1, "API_BASE_URL is required"),
    AWS_REGION: z.string().min(1, "AWS_REGION is required"),
    AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
    AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
    AWS_SECRET_MANAGER_SECRET_NAME: z.string().min(1, 'SECRET_MANAGER_SECRET_NAME  is required'),
    AWS_CLOUDFRONT_DOMAIN: z.string().min(1, "AWS_CLOUDFRONT_DOMAIN is required"),
    AWS_S3_BUCKET_NAME: z.string().min(1, "AWS_S3_BUCKET_NAME is required"),
})
