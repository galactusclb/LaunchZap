import "server-only"

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z from "zod";

import { constants } from "../constants/server";

import { ApiError, toFetchApiError } from "./api-error";

async function baseFetch(path: string, init?: RequestInit): Promise<Response> {
    const cookieStore = await cookies();

    const doFetch = ()=> 
        fetch(`${constants.API.URL}${path}`, {
            cache: 'no-store',
            ...init,
            headers: {
                'Content-Type': 'application/json',
                ...init?.headers,
                Cookie: cookieStore.toString()
            }
    });

    let response = await doFetch();

    if (response.status === 401) {
        const refreshed = await tokenRotation();
        if (refreshed) {
            response = await doFetch();
        }
    }

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
        if (error instanceof ApiError && error.status === 401) redirect('/login');
        if (error instanceof DOMException && error.name === 'AbortError') throw error;
        logError(init?.method, path, error);
        throw toFetchApiError(error);
    }
}

export async function apiServerVoid(path: string, init?: RequestInit): Promise<void> {
    try {
        await baseFetch(path, init);
    } catch (error) {
        if (error instanceof ApiError && error.status === 401) redirect('/login');
        if (error instanceof DOMException && error.name === 'AbortError') throw error;
        logError(init?.method, path, error);
        throw toFetchApiError(error);
    }
}

async function tokenRotation(): Promise<boolean>{
    const cookieStore = await cookies();
    const response = await fetch(`${constants.API.URL}/auth/refresh`, {
        method: 'POST',
        cache: 'no-store',
        headers: {
            Cookie: cookieStore.toString()
        }
    })

    if(!response.ok) return false;

    for (const raw of response.headers.getSetCookie()) {
        const [nameValue, ...parts] = raw.split(';');
        const eqIdx = nameValue.indexOf('=');
        const name = nameValue.slice(0, eqIdx).trim();
        const value = nameValue.slice(eqIdx+1).trim();

        // Preserve the original attributes (HttpOnly, Path, SameSite, etc.)
        const attrs = Object.fromEntries(
            parts.map(p => p.trim().split('=')).map(([k, v]) => [k.toLowerCase(), v ?? true])
        );

        cookieStore.set(name, value, {
            httpOnly: !!attrs['httponly'],
            secure: !!attrs['secure'],
            path: typeof attrs['path'] === 'string' ? attrs['path'] : '/',
            sameSite: attrs['samesite'] as 'lax' | 'strict' | 'none' | undefined,
        })
    }

    return true;
}

function logError(method: string | undefined, path: string, error: unknown): void {
    const ctx = { method: method ?? 'GET', path };

    if (error instanceof ApiError) {
        console.error('[apiServer]', { ...ctx, status: error.status, code: error.code, message: error.message, details: error.details });
    } else if (error instanceof z.ZodError) {
        console.error('[apiServer]', { ...ctx, type: 'ZodError', issues: z.treeifyError(error) });
    } else if (error instanceof Error) {
        console.error('[apiServer]', { ...ctx, message: error.message, stack: error.stack });
    } else {
        console.error('[apiServer]', { ...ctx, error });
    }
};