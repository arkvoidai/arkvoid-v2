import { createClient } from '../../../lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const error = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') ?? 'https://app.arkvoid.com'

  if (error) {
    return NextResponse.redirect(`${requestUrl.origin}/login?error=oauth_failed`)
  }

  if (code) {
    const supabase = createClient()
    const { error: sessionError } = await supabase.auth.exchangeCodeForSession(code)
    if (!sessionError) {
      return NextResponse.redirect(next)
    }
    return NextResponse.redirect(`${requestUrl.origin}/login?error=session_failed`)
  }

  return NextResponse.redirect(`${requestUrl.origin}/login`)
}
