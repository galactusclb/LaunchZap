import { cookies } from "next/headers";

import { meFullResponseSchema } from "@/models/user.schema"
import { apiServer } from "@/utils/api/api-server"

export const fetchMeServer = async ()=>{
    const cookieStore = await cookies();
    if (!cookieStore.has('refresh_token')) return null;

    const response = await apiServer('/auth/me', meFullResponseSchema);
    return response.success ? response.data : null;
};