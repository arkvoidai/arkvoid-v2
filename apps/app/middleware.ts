import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

const fallbackSupabaseUrl = 'https://placeholder.supabase.co'
const fallbackSupabaseAnonKey = 'placeholder'

function publicUrl(key: string, fallback: string) {
  return (process.env[key] || fallback).replace(/\/+$/, '')
}

function redirectToLogin(request: NextRequest) {
  const loginUrl = new URL('/login', publicUrl('NEXT_PUBLIC_AUTH_URL', 'https://auth.arkvoid.com'))
  loginUrl.searchParams.set('redirect', request.url)
  return NextResponse.redirect(loginUrl)
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const pathname = request.nextUrl.pathname
  const isPublicPath = pathname.startsWith('/onboarding') || pathname.startsWith('/api')
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || fallbackSupabaseUrl
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || fallbackSupabaseAnonKey
  const supabaseConfigured = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!supabaseConfigured) {
    return isPublicPath ? response : redirectToLogin(request)
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({ name, value, ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value, ...options })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({ name, value: '', ...options })
          response = NextResponse.next({ request: { headers: request.headers } })
          response.cookies.set({ name, value: '', ...options })
        },
      },
    })

    const { data: { user }, error } = await supabase.auth.getUser()

    if ((!user || error) && !isPublicPath) {
      return redirectToLogin(request)
    }
  } catch {
    if (!isPublicPath) {
      return redirectToLogin(request)
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
