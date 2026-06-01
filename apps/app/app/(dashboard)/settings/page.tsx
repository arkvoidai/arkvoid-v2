import { createClient } from '../../../lib/supabase/server';
import { redirect } from 'next/navigation';
import { SettingsClient } from './settings-client';

export const metadata = {
  title: 'Settings',
};

export default async function SettingsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('https://auth.arkvoid.com/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();

  if (!profile) redirect('/onboarding');
  
  const orgs = profile.organizations;
  const org = Array.isArray(orgs) ? orgs[0] : orgs;
  if (!org) redirect('/onboarding');

  return <SettingsClient profile={profile} org={org} />;
}
