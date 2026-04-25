import "server-only"

import { serverEnvSchema } from "./schema"

const env = serverEnvSchema.parse({
    API_BASE_URL: process.env.API_BASE_URL,
    AWS_REGION: process.env.AWS_REGION,
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID,
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY,
    AWS_SECRET_MANAGER_SECRET_NAME: process.env.AWS_SECRET_MANAGER_SECRET_NAME,
})

export const constants = {
    API: {
        URL: env.API_BASE_URL,
    },
    AWS: {
        REGION: env.AWS_REGION,
        ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID,
        SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY,
        SECRET_MANAGER_SECRET_NAME: env.AWS_SECRET_MANAGER_SECRET_NAME,
    },
}
