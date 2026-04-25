import z from "zod";

export const secretManagerResponseSchema = z.object({
    S3_BUCKET_NAME: z.string().min(1, "S3_BUCKET_NAME is required")
})

export type secretManagerResponse = z.infer<typeof secretManagerResponseSchema>;