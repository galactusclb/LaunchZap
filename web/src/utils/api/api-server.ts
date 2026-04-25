import { cookies } from "next/headers";

import { constants } from "../constants/server";

export async function apiServer<T = unknown>(path: string, init?: RequestInit): Promise<T> {
    const cookeiStore = await cookies();

    const response = await fetch(`${constants.API.URL}${path}`, {
        cache: 'no-store',
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
            Cookie: cookeiStore.toString()
        }
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.error ?? 'Request failed');
    }

    return await response.json() as Promise<T>
}