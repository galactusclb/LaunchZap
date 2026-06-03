import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { AUTH_ROUTES, PROTECTED_ROUTES, ROUTES } from '@/config/routes';

import { parseReturnTo } from './utils';
import { callRefreshEndpoint } from './utils/api/api-server';
import { AUTH, PROXY_HEADERS } from './utils/constants/auth';

export async function proxy(request: NextRequest) {
    const { pathname, search } = request.nextUrl;

    const requestHeader = new Headers(request.headers);
    requestHeader.set(PROXY_HEADERS.PATHNAME, pathname);
    requestHeader.set(PROXY_HEADERS.SEARCH, search);

    let hasRefreshToken = request.cookies.has(AUTH.COOKIES.REFRESH_TOKEN);
    let hasAccessToken = request.cookies.has(AUTH.COOKIES.ACCESS_TOKEN);

    console.log('isAuthenticated', hasRefreshToken, hasAccessToken);

    let refreshedCookies: string[] = [];
    if (hasRefreshToken && !hasAccessToken) {
        const refreshRes = await callRefreshEndpoint(request.headers.get('cookie') ?? '');

        if (refreshRes.ok) {
            refreshedCookies = refreshRes.headers.getSetCookie();
            hasAccessToken = true;
        } else {
            hasRefreshToken = false;
        }
    }

    const isAuthenticated = hasRefreshToken;
    const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));
    const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));

    let response: NextResponse;

    if (isProtected && !isAuthenticated) {
        const loginUrl = new URL(ROUTES.login, request.url);
        loginUrl.searchParams.set(AUTH.QUERY_PARAMS.RETURN_TO, pathname);
        response = NextResponse.redirect(loginUrl);
    } else if (isAuthRoute && isAuthenticated) {
        const returnTo = request.nextUrl.searchParams.get(AUTH.QUERY_PARAMS.RETURN_TO);
        const destination = parseReturnTo(returnTo) ?? ROUTES.home;
        response = NextResponse.redirect(new URL(destination, request.url));
    } else {
        response = NextResponse.next({ request: { headers: requestHeader } });
    }

    for (const cookie of refreshedCookies) {
        response.headers.append('Set-Cookie', cookie);
    }

    return response;
}

export const config = {
    matcher: ['/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)'],
};
