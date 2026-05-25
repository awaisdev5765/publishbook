import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PROTECTED = ['/dashboard', '/admin']
const AUTH_ONLY = ['/login', '/register']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasSession   = request.cookies.has('refresh_token')

  const isProtected = PROTECTED.some(p => pathname.startsWith(p))
  const isAuthOnly  = AUTH_ONLY.some(p => pathname === p)

  if (isProtected && !hasSession) {
    const url = new URL('/login', request.url)
    url.searchParams.set('from', pathname)
    return NextResponse.redirect(url)
  }

  // Only redirect away from login/register if session exists — never loop to a missing page
  if (isAuthOnly && hasSession) {
    const from = request.nextUrl.searchParams.get('from')
    const dest = from && (from.startsWith('/dashboard') || from.startsWith('/admin'))
      ? from
      : '/dashboard'
    return NextResponse.redirect(new URL(dest, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/login', '/register'],
}
