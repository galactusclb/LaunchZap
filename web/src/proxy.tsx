import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED_ROUTES = ['/dashboard', '/submit']

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isAuthenticated = request.cookies.has('refresh_token')
  const access = request.cookies.has('access_token')
  console.log('isAuthenticated', isAuthenticated, access)
  const isProtected = PROTECTED_ROUTES.some((route) => pathname.startsWith(route))

  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('returnTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname === '/login' && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/submit', '/login'],
}
