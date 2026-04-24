import "server-only"

import { serverEnvSchema } from "./schema"

const env = serverEnvSchema.parse(process.env)

export const constants = {
    API: {
        URL: env.API_BASE_URL,
    },
    AWS: {
        REGION: env.AWS_REGION,
        ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
        S3_BUCKET_NAME: env.S3_BUCKET_NAME,
    },
}
