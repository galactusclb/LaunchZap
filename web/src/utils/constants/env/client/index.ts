import { clientEnvSchema } from "./schema"

const env = clientEnvSchema.parse({
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
})

export const constants = {
    API: {
        URL: env.NEXT_PUBLIC_API_BASE_URL,
    },
}
