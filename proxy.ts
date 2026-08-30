import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function proxy(request: NextRequest) {
  const url = request.nextUrl
  const host = request.headers.get('host') || url.host

  // Only redirect Vercel preview deployments to the custom domain.
  // Localhost and the production domain are allowed through for testing.
  if (!host.toLowerCase().endsWith('.vercel.app')) {
    return NextResponse.next()
  }

  const canonicalUrl = new URL(url.pathname + url.search, 'https://www.ganishkhasricrackers.in')
  const response = NextResponse.redirect(canonicalUrl, { status: 301 })
  response.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return response
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|manifest.json).*)'],
}
