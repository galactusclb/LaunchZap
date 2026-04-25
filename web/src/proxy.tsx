import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { AUTH_ROUTES, PROTECTED_ROUTES, ROUTES } from '@/config/routes'

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('refresh_token')
  const access = request.cookies.has('access_token')
  console.log('isAuthenticated', isAuthenticated, access)
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))
  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL(ROUTES.login, request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL(ROUTES.home, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/submit', '/login'],
}
