"use client"

import { authHref } from '../../../lib/site-config';
import { useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { useToast } from '../../../components/ui/toast';
import { LogOut } from 'lucide-react';

export function SettingsClient({ profile, org }: { profile: any, org: any }) {
  const supabase = createClient();
  const { success, error } = useToast();

  // Workspace State
  const [wsName, setWsName] = useState(org.name || '');
  const [webhookUrl, setWebhookUrl] = useState(org.webhook_url || '');
  const [slackWebhookUrl, setSlackWebhookUrl] = useState(org.slack_webhook_url || '');
  const [savingWs, setSavingWs] = useState(false);

  // Profile State
  const [profName, setProfName] = useState(profile.full_name || '');
  const [emailAlerts, setEmailAlerts] = useState(profile.preferences?.email_alerts ?? true);
  const [weeklyDigest, setWeeklyDigest] = useState(profile.preferences?.weekly_digest ?? true);
  const [savingProf, setSavingProf] = useState(false);

  // Danger Zone State
  const [signingOut, setSigningOut] = useState(false);

  const saveWorkspace = async () => {
    setSavingWs(true);
    const { error: err } = await supabase
      .from('organizations')
      .update({
        name: wsName,
        webhook_url: webhookUrl,
        slack_webhook_url: slackWebhookUrl
      })
      .eq('id', org.id);

    if (err) {
      error('Failed to save workspace', err.message);
    } else {
      success('Workspace updated successfully');
    }
    setSavingWs(false);
  };

  const saveProfile = async () => {
    setSavingProf(true);
    const updatedPreferences = {
      ...profile.preferences,
      email_alerts: emailAlerts,
      weekly_digest: weeklyDigest
    };
    
    const { error: err } = await supabase
      .from('profiles')
      .update({
        full_name: profName,
        preferences: updatedPreferences
      })
      .eq('id', profile.id);

    if (err) {
      error('Failed to save profile', err.message);
    } else {
      success('Profile updated successfully');
    }
    setSavingProf(false);
  };

  const handleSignOutAll = async () => {
    if (!window.confirm('Are you sure you want to sign out of all devices? You will be logged out immediately.')) {
      return;
    }
    setSigningOut(true);
    // Delete session approach or auth signout
    await supabase.auth.signOut();
    window.location.href = authHref('/login');
  };

  // Usage Math
  const used = org.decisions_this_month || 0;
  const limit = org.decisions_limit || 10000;
  const usagePercent = Math.min(used / limit, 1);
  let barColor = 'bg-[#596235]';
  if (usagePercent > 0.6) barColor = 'bg-[#d96846]';
  if (usagePercent > 0.85) barColor = 'bg-[#912c2c]';

  return (
    <div className="max-w-3xl pb-12 flex flex-col gap-6">
      
      {/* SECTION 1 - WORKSPACE */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#1a1a1a]">
          <h2 className="text-xl text-white font-light">Workspace</h2>
          <p className="text-sm text-[#6e6c76] mt-0.5">Manage your workspace settings</p>
        </div>
        
        <div className="px-6 py-5 flex flex-col gap-5">
          <div>
            <label className="block text-xs text-[#6e6c76] mb-1.5 uppercase tracking-wider">Workspace Name</label>
            <input 
              type="text" 
              value={wsName}
              onChange={(e) => setWsName(e.target.value)}
              className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#d96846] transition-colors" 
            />
          </div>
          <div>
            <label className="block text-xs text-[#6e6c76] mb-1.5 uppercase tracking-wider">Webhook URL</label>
            <input 
              type="text" 
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/webhook"
              className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#d96846] transition-colors" 
            />
            <p className="text-xs text-[#3d3b45] mt-1">Receive webhook events for governance violations.</p>
          </div>
          <div>
            <label className="block text-xs text-[#6e6c76] mb-1.5 uppercase tracking-wider">Slack Webhook URL</label>
            <input 
              type="text" 
              value={slackWebhookUrl}
              onChange={(e) => setSlackWebhookUrl(e.target.value)}
              placeholder="https://hooks.slack.com/services/..."
              className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#d96846] transition-colors" 
            />
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#0f0f0f] bg-[#050505] flex justify-between items-center">
          <span className="text-sm text-[#3d3b45]">Changes save immediately.</span>
          <button 
            onClick={saveWorkspace}
            disabled={savingWs}
            className="bg-[#d96846] hover:bg-[#c25a3a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-[#d96846]"
          >
            {savingWs ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* SECTION 2 - PLAN AND USAGE */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#1a1a1a]">
          <h2 className="text-xl text-white font-light">Plan & Usage</h2>
          <p className="text-sm text-[#6e6c76] mt-0.5">Manage your billing and capacity</p>
        </div>
        
        <div className="px-6 py-5 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <span className="text-[15px] text-white">Current Plan</span>
            {org.plan === 'enterprise' ? (
               <span className="bg-[#050505] border border-[rgba(89,98,53,0.3)] text-[#596235] px-3 py-1 rounded-full text-xs uppercase tracking-wider">Enterprise</span>
            ) : org.plan === 'team' ? (
               <span className="bg-[rgba(217,104,70,0.06)] border border-[#d96846]/20 text-[#d96846] px-3 py-1 rounded-full text-xs uppercase tracking-wider">Team</span>
            ) : (
               <span className="bg-[#111] border border-[#222] text-[#6e6c76] px-3 py-1 rounded-full text-xs uppercase tracking-wider">Free</span>
            )}
          </div>

          <div className="mb-2 flex justify-between">
            <span className="text-sm text-[#6e6c76]">Decisions this month</span>
            <span className="text-sm text-[#cdcbd6]">{used.toLocaleString()} / {org.plan === 'free' ? limit.toLocaleString() : 'Unlimited'}</span>
          </div>
          
          <div className="w-full h-2 bg-[#1a1a1a] rounded-full overflow-hidden">
            <div 
              className={`h-full ${barColor}`} 
              style={{ width: `${usagePercent * 100}%` }} 
            />
          </div>

          {org.plan === 'free' && (
            <div className="mt-8 bg-[rgba(217,104,70,0.06)] border border-[#d96846]/20 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base text-white">Upgrade to Team</h3>
                <p className="text-sm text-[#6e6c76] mt-0.5">Get unlimited decisions, custom governance features, and premium support.</p>
              </div>
              <a 
                href="mailto:heyarkvoid@gmail.com?subject=Upgrade to Team" 
                className="bg-[#d96846] hover:bg-[#c25a3a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap ml-4 flex-shrink-0"
              >
                Upgrade &rarr;
              </a>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 3 - PROFILE */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-2xl overflow-hidden flex flex-col">
        <div className="px-6 py-5 border-b border-[#1a1a1a]">
          <h2 className="text-xl text-white font-light">Profile</h2>
          <p className="text-sm text-[#6e6c76] mt-0.5">Your personal account settings</p>
        </div>
        
        <div className="px-6 py-5 flex flex-col gap-6">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-xs text-[#6e6c76] mb-1.5 uppercase tracking-wider">Full Name</label>
              <input 
                type="text" 
                value={profName}
                onChange={(e) => setProfName(e.target.value)}
                className="w-full bg-[#000] border border-[#222222] rounded-lg px-3 py-2 text-[14px] text-white focus:outline-none focus:border-[#d96846] transition-colors" 
              />
            </div>
            <div>
              <label className="block text-xs text-[#6e6c76] mb-1.5 uppercase tracking-wider">Email Address</label>
              <input 
                type="email" 
                value={profile.email || ''}
                readOnly
                className="w-full bg-[#050505] border border-[#1a1a1a] rounded-lg px-3 py-2 text-[14px] text-[#6e6c76] focus:outline-none cursor-not-allowed" 
              />
            </div>
          </div>

          <div className="border-t border-[#1a1a1a] pt-6 flex flex-col gap-5">
            <h3 className="text-sm text-white">Notifications</h3>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] text-[#cdcbd6]">Email governance alerts</div>
                <div className="text-[12px] text-[#3d3b45]">Receive an email when a blocker rule is violated.</div>
              </div>
              <button 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                style={{ backgroundColor: emailAlerts ? '#d96846' : '#1a1a1a' }}
              >
                <div 
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: emailAlerts ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[14px] text-[#cdcbd6]">Weekly digest</div>
                <div className="text-[12px] text-[#3d3b45]">A summary of decisions and governance status every week.</div>
              </div>
              <button 
                onClick={() => setWeeklyDigest(!weeklyDigest)}
                className="relative w-10 h-5 rounded-full transition-colors flex-shrink-0"
                style={{ backgroundColor: weeklyDigest ? '#d96846' : '#1a1a1a' }}
              >
                <div 
                  className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform"
                  style={{ transform: weeklyDigest ? 'translateX(22px)' : 'translateX(2px)' }}
                />
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-[#0f0f0f] bg-[#050505] flex justify-between items-center">
          <span className="text-sm text-[#3d3b45]">Update personal preferences.</span>
          <button 
            onClick={saveProfile}
            disabled={savingProf}
            className="bg-[#d96846] hover:bg-[#c25a3a] text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:hover:bg-[#d96846]"
          >
            {savingProf ? 'Saving...' : 'Save changes'}
          </button>
        </div>
      </div>

      {/* SECTION 4 - DANGER ZONE */}
      <div className="bg-[#050505] border border-[rgba(145,44,44,0.2)] rounded-2xl overflow-hidden flex flex-col mb-12">
        <div className="px-6 py-5 border-b border-[rgba(145,44,44,0.1)]">
          <h2 className="text-xl text-white font-light">Danger Zone</h2>
        </div>
        
        <div className="px-6 py-5 flex flex-col gap-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="text-[14px] text-white">Sign out all devices</div>
              <div className="text-[12px] text-[#6e6c76] mt-0.5">Revoke all active sessions except the current one.</div>
            </div>
            <button 
              onClick={handleSignOutAll}
              disabled={signingOut}
              className="flex items-center gap-1.5 border border-[#912c2c] text-[#912c2c] hover:bg-[rgba(145,44,44,0.1)] px-4 py-2 rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <LogOut size={14} />
              {signingOut ? 'Signing out...' : 'Sign out all'}
            </button>
          </div>
          
          <div className="flex items-center justify-between flex-wrap gap-4 border-t border-[rgba(145,44,44,0.1)] pt-5">
            <div>
              <div className="text-[14px] text-white">Delete workspace</div>
              <div className="text-[12px] text-[#6e6c76] mt-0.5">Permanently delete all data, rules, and event logs.</div>
            </div>
            <a 
              href="mailto:heyarkvoid@gmail.com?subject=Delete Workspace Request"
              className="bg-[#912c2c] hover:bg-[#a63434] text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Contact Support
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
