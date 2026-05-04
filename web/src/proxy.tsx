import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { AUTH_ROUTES, PROTECTED_ROUTES, ROUTES } from '@/config/routes'

import { callRefreshEndpoint } from './utils/api/api-server';

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  const requestHeader = new Headers(request.headers);
  requestHeader.set('x-pathname', pathname);
  requestHeader.set('x-search', search);

  let hasRefreshToken = request.cookies.has('refresh_token');
  let hasAccessToken = request.cookies.has('access_token');

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
  };

  const isAuthenticated = hasRefreshToken;
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  let response: NextResponse;

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.login, request.url);
    loginUrl.searchParams.set('returnTo', pathname);
    response = NextResponse.redirect(loginUrl);
  } else if (isAuthRoute && isAuthenticated) {
    const returnTo = request.nextUrl.searchParams.get('returnTo');
    const destination = isSafeReturnTo(returnTo) ? returnTo : ROUTES.home;
    response = NextResponse.redirect(new URL(destination, request.url));
  } else {
    response = NextResponse.next({ request: { headers: requestHeader } });
  }

  for (const cookie of refreshedCookies) {
    response.headers.append('Set-Cookie', cookie);
  }

  return response;
}

function isSafeReturnTo(returnTo: string | null): returnTo is string {
  if (!returnTo) return false;

  // Must be a same-origin path: starts with "/" but not "//" (which is a protocol-relative URL).
  // Also reject backslashes which some browsers normalize to "/".
  return returnTo.startsWith('/') && !returnTo.startsWith('//') && !returnTo.startsWith('/\\');
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico).*)'],
  // matcher: [
  //   '/((?!_next/static|_next/image|_next/webpack-hmr|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  // ],
}
