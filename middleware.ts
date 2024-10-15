import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Check if the request is for an api/frame or api/imggen route
  if (request.nextUrl.pathname.startsWith('/api/frame') || request.nextUrl.pathname.startsWith('/api/frame/services')) {
    // Skip NextAuth for these routes
    return NextResponse.next()
  }

  // For all other routes, allow NextAuth to handle the request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/frame (our custom API routes that don't need auth)
     * - api/imggen (image generation API routes that don't need auth)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/frame|api/imggen|_next/static|_next/image|favicon.ico).*)',
  ],
}