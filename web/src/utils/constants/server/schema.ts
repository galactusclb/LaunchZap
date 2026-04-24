import z from "zod"

export const serverEnvSchema = z.object({
    API_BASE_URL: z.string().min(1, "API_BASE_URL is required"),
    AWS_REGION: z.string().min(1, "AWS_REGION is required"),
    AWS_ACCESS_KEY_ID: z.string().min(1, "AWS_ACCESS_KEY_ID is required"),
    AWS_SECRET_ACCESS_KEY: z.string().min(1, "AWS_SECRET_ACCESS_KEY is required"),
    S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required"),
})
