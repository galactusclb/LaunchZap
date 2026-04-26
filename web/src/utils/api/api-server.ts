import { cookies } from "next/headers";
import z from "zod";

import { constants } from "../constants/server";

import { ApiError, toFetchApiError } from "./api-error";

async function baseFetch(path: string, init?: RequestInit): Promise<Response> {
    const cookieStore = await cookies();

    const response = await fetch(`${constants.API.URL}${path}`, {
        cache: 'no-store',
        ...init,
        headers: {
            'Content-Type': 'application/json',
            ...init?.headers,
            Cookie: cookieStore.toString()
        }
    });

    if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = typeof data?.error === 'string' ? data.error : 'Request failed';
        throw new ApiError(message, { status: response.status });
    }

    return response;
}

export async function apiServer<T extends z.ZodTypeAny>(
    path: string,
    schema: T,
    init?: RequestInit
): Promise<z.infer<T>> {
    try {
        const response = await baseFetch(path, init);
        const json = await response.json();
        return schema.parse(json);
    } catch (error) {
        throw toFetchApiError(error);
    }
}

export async function apiServerVoid(path: string, init?: RequestInit): Promise<void> {
    try {
        await baseFetch(path, init);
    } catch (error) {
        throw toFetchApiError(error);
    }
}