import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'

const JAVNE_RUTE = ['/login', '/register', '/registracija', '/auth'] as const
const ADMIN_PREFIX = '/admin'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request)
  const { pathname } = request.nextUrl

  const jeJavnaRuta = JAVNE_RUTE.some(
    (ruta) => pathname === ruta || pathname.startsWith(ruta + '/')
  )

  if (!user && !jeJavnaRuta) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (user && pathname.startsWith(ADMIN_PREFIX)) {
    const uloga = user.user_metadata?.uloga as string | undefined
    const jeAdministrator = uloga === 'Administrator'
    if (!jeAdministrator) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
