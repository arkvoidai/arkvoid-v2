import { redirect } from 'next/navigation'
import { createClient } from '../../lib/supabase/server'
import { Sidebar } from '../../components/layout/sidebar'
import { Topbar } from '../../components/layout/topbar'
import { AppProvider } from '../../components/providers/app-provider'
import { authHref } from '../../lib/site-config'

export const metadata = {
  title: 'Dashboard — Arkvoid',
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  
  const { data: { user } } = await supabase.auth.getUser().catch(() => ({ data: { user: null } }))
  if (!user) {
    redirect(authHref('/login'))
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/onboarding')
  }

  if (!profile.onboarding_done) {
    redirect('/onboarding')
  }

  // Ensure organization exists and is the correct shape
  const orgs = profile.organizations;
  const org = Array.isArray(orgs) ? orgs[0] : orgs;

  if (!org) {
    redirect('/onboarding');
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-[#000]">
      <Sidebar org={org} profile={profile} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar profile={profile} org={org} />
        <main className="flex-1 overflow-y-auto">
          <AppProvider org={org} profile={profile}>
            <div className="max-w-[1400px] mx-auto px-6 py-6">
              {children}
            </div>
          </AppProvider>
        </main>
      </div>
    </div>
  )
}
