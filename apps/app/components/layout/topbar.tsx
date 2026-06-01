"use client"

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Menu, BookOpen } from 'lucide-react'
import type { Organization, Profile } from './sidebar'

interface TopbarProps {
  org: Organization;
  profile: Profile;
}

const PAGE_TITLE_MAP: Record<string, string> = {
  '/': 'Dashboard',
  '/decisions': 'Decisions',
  '/governance': 'Governance Rules',
  '/violations': 'Violations',
  '/world': 'World State',
  '/commitments': 'Commitments',
  '/api-keys': 'API Keys',
  '/webhooks': 'Webhooks',
  '/audit': 'Audit Log',
  '/settings': 'Settings',
  '/team': 'Team'
};

function getInitials(name?: string) {
  if (!name) return 'U';
  return name.slice(0, 1).toUpperCase();
}

function getPageTitle(pathname: string | null) {
  if (!pathname) return '';
  if (PAGE_TITLE_MAP[pathname]) {
    return PAGE_TITLE_MAP[pathname];
  }
  if (pathname.startsWith('/decisions/')) {
    return 'Decisions';
  }
  return '';
}

export function Topbar({ org, profile }: TopbarProps) {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  const usagePercent = Math.min((org?.decisions_this_month || 0) / 10000, 1);
  let barColor = 'bg-[#596235]'; // green
  if (usagePercent > 0.6) barColor = 'bg-[#d96846]'; // orange
  if (usagePercent > 0.85) barColor = 'bg-[#912c2c]'; // red

  return (
    <header className="h-14 border-b border-[#1a1a1a] bg-[#000]/80 backdrop-blur-sm flex items-center justify-between px-6 gap-4 sticky top-0 z-20">
      <div className="flex items-center">
        <button className="md:hidden text-[#6e6c76] mr-2" aria-label="Menu">
          <Menu size={20} />
        </button>
        <h1 className="text-[15px] text-white font-normal">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        {org?.plan === 'free' && (
          <Link href="/settings#plan" className="hidden sm:flex items-center gap-2 bg-[#0a0a0a] border border-[#1a1a1a] rounded-full px-2.5 py-1.5 text-xs group" title={`${org.decisions_this_month} decisions used this month`}>
            <div>
              <span className="text-[#cdcbd6] font-mono">{org.decisions_this_month}</span>
              <span className="text-[#3d3b45] mx-0.5">/</span>
              <span className="text-[#6e6c76]">10K</span>
            </div>
            <div className="w-12 h-[2px] bg-[#1a1a1a] rounded-full overflow-hidden">
              <div className={`h-full ${barColor}`} style={{ width: `${usagePercent * 100}%` }} />
            </div>
          </Link>
        )}

        <a 
          href="https://docs.arkvoid.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="hidden md:flex p-1"
        >
          <BookOpen size={16} className="text-[#3d3b45] hover:text-[#6e6c76] transition-colors" />
        </a>

        <a 
          href="https://trust.arkvoid.com"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden md:flex items-center justify-center p-1"
          title="All systems operational"
        >
          <div className="w-2 h-2 rounded-full bg-[#596235] animate-pulse" />
        </a>

        <div className="hidden md:block w-px h-5 bg-[#1a1a1a] mx-1" />

        <button className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-[#222222] flex items-center justify-center text-xs text-[#6e6c76] hover:border-[#2e2e2e] hover:bg-[#222222] transition-all cursor-pointer">
          {getInitials(profile?.full_name)}
        </button>
      </div>
    </header>
  );
}
