export const constants = {
    API: {
        SERVER_URL: process.env.API_BASE_URL,
        BROWSER_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
        URL: typeof window === "undefined" 
            ? process.env.API_BASE_URL
            : process.env.NEXT_PUBLIC_API_BASE_URL
    }
}