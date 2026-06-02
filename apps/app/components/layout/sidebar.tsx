"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '../../lib/supabase/client'
import { authHref, siteConfig } from '../../lib/site-config'
import { 
  LayoutDashboard, Zap, Globe, ShieldCheck, 
  AlertTriangle, Link as LinkIcon, Key, Webhook, ScrollText, 
  Settings, Users, LogOut, BookOpen, ExternalLink, ChevronsUpDown 
} from 'lucide-react'

export interface Organization {
  id: string;
  name: string;
  slug: string;
  plan: 'free' | 'team' | 'enterprise';
  decisions_this_month: number;
  api_key?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  role: string;
}

interface SidebarProps {
  org: Organization;
  profile: Profile;
}

const NAV_GROUPS = [
  {
    label: 'ANALYSIS',
    items: [
      { label: 'Dashboard', href: '/', icon: LayoutDashboard, exact: true },
      { label: 'Decisions', href: '/decisions', icon: Zap },
    ]
  },
  {
    label: 'GOVERNANCE', 
    items: [
      { label: 'Rules', href: '/governance', icon: ShieldCheck },
      { label: 'Violations', href: '/violations', icon: AlertTriangle },
    ]
  },
  {
    label: 'INTELLIGENCE',
    items: [
      { label: 'World State', href: '/world', icon: Globe },
      { label: 'Commitments', href: '/commitments', icon: LinkIcon },
    ]
  },
  {
    label: 'DEVELOPER',
    items: [
      { label: 'API Keys', href: '/api-keys', icon: Key },
      { label: 'Webhooks', href: '/webhooks', icon: Webhook },
      { label: 'Audit Log', href: '/audit', icon: ScrollText },
    ]
  },
  {
    label: 'ACCOUNT',
    items: [
      { label: 'Settings', href: '/settings', icon: Settings },
      { label: 'Team', href: '/team', icon: Users },
    ]
  }
];

function getInitials(name?: string) {
  if (!name) return 'U';
  return name.slice(0, 1).toUpperCase();
}

export function Sidebar({ org, profile }: SidebarProps) {
  const pathname = usePathname();

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = authHref('/login');
  };

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col h-full bg-[#080808] border-r border-[#1a1a1a] no-scrollbar">
      <div className="px-4 py-4 border-b border-[#1a1a1a]">
        <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[#161616] transition-colors tap-target">
          <div className="w-6 h-6 rounded-sm bg-[#161616] border border-[#2e2e2e] flex items-center justify-center">
            <span className="text-[10px] text-[#6e6c76]">{getInitials(org?.name)}</span>
          </div>
          <span className="flex-1 text-left text-[14px] text-white truncate font-normal">
            {org?.name || 'Workspace'}
          </span>
          <ChevronsUpDown size={12} className="text-[#3d3b45] flex-shrink-0" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5 no-scrollbar">
        {NAV_GROUPS.map((group, i) => (
          <div key={i}>
            <div className="text-[9px] uppercase tracking-[0.14em] text-[#2e2e2e] px-2 mb-1.5 font-medium">
              {group.label}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item, j) => {
                const isActive = item.exact 
                  ? pathname === item.href
                  : pathname?.startsWith(item.href);
                
                const Icon = item.icon;

                return (
                  <Link 
                    key={j} 
                    href={item.href}
                    className={`flex items-center gap-2.5 px-2 py-2 rounded-md transition-colors duration-100 ${
                      isActive 
                        ? 'bg-[#161616] text-white' 
                        : 'text-[#6e6c76] hover:text-[#cdcbd6] hover:bg-[#0f0f0f]'
                    }`}
                  >
                    <Icon size={16} className={isActive ? 'text-[#d96846]' : 'text-[#3d3b45] group-hover:text-[#6e6c76]'} />
                    <span className="text-[13px] font-normal">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-[#1a1a1a] p-3">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-md hover:bg-[#161616] transition-colors group">
          <div className="w-6 h-6 rounded-full bg-[#1a1a1a] border border-[#222222] flex items-center justify-center">
            <span className="text-[10px] text-[#6e6c76]">{getInitials(profile?.full_name)}</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col justify-center">
            <span className="text-[13px] text-[#cdcbd6] truncate leading-tight">
              {profile?.full_name || 'User'}
            </span>
            <span className="text-[10px] text-[#3d3b45] capitalize leading-tight mt-0.5">
              {profile?.role || 'owner'}
            </span>
          </div>
          <button 
            onClick={handleSignOut}
            className="text-[#2e2e2e] hover:text-[#912c2c] transition-colors p-1 rounded-md"
            title="Log out"
          >
            <LogOut size={14} />
          </button>
        </div>

        <div className="mt-2 flex gap-1.5 px-2">
          <a 
            href={siteConfig.docsUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Docs"
            className="w-7 h-7 rounded-sm flex items-center justify-center text-[#2e2e2e] hover:text-[#6e6c76] hover:bg-[#161616] transition-all"
          >
            <BookOpen size={14} />
          </a>
          <a 
            href={siteConfig.marketingUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            title="Website"
            className="w-7 h-7 rounded-sm flex items-center justify-center text-[#2e2e2e] hover:text-[#6e6c76] hover:bg-[#161616] transition-all"
          >
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </aside>
  );
}
