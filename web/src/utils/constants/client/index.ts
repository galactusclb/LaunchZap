import { clientEnvSchema } from "./schema"

const env = clientEnvSchema.parse(process.env)

export const constants = {
    API: {
        URL: env.NEXT_PUBLIC_API_BASE_URL,
    },
}
