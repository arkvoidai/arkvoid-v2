import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'
import { appHref } from '../../../lib/site-config'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') ?? appHref()

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth_failed`)
  }

  if (code) {
    try {
      const supabase = createClient()
      const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
      if (!sessionError) {
        return NextResponse.redirect(next)
      }
    } catch {}
    return NextResponse.redirect(`${requestUrl.origin}/login?error=session_failed`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
