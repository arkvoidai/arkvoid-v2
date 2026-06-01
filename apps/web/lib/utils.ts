import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  
  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears}y ago`;
}

export function formatNumber(n: number): string {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace(/\.0$/, '')}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1).replace(/\.0$/, '')}K`;
  return n.toString();
}

export function formatTrustScore(score: number | null): string {
  if (score === null || isNaN(score)) return '—';
  return score.toFixed(2);
}

export function getTrustGrade(score: number | null): 'A' | 'B' | 'C' | 'D' | 'F' | null {
  if (score === null || isNaN(score)) return null;
  if (score >= 0.90) return 'A';
  if (score >= 0.80) return 'B';
  if (score >= 0.70) return 'C';
  if (score >= 0.60) return 'D';
  return 'F';
}

export function getTrustColor(score: number | null): string {
  if (score === null || isNaN(score)) return 'text-status-pending';
  if (score >= 0.90) return 'text-status-passed';
  if (score >= 0.80) return 'text-status-passed/80';
  if (score >= 0.60) return 'text-status-review';
  if (score >= 0.40) return 'text-status-flagged';
  return 'text-status-blocked';
}

export function getStatusColor(status: string): string {
  const s = status.toLowerCase();
  switch (s) {
    case 'passed':
    case 'approved':
    case 'verified':
      return 'text-status-passed';
    case 'flagged':
    case 'warning':
    case 'review':
      return 'text-status-flagged';
    case 'blocked':
    case 'failed':
    case 'rejected':
      return 'text-status-blocked';
    case 'pending':
    case 'processing':
    case 'running':
      return 'text-status-pending';
    default:
      return 'text-status-review';
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (error) {
    console.error('Failed to copy text', error);
    return false;
  }
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + '…';
}

export function truncateMiddle(str: string, front: number, back: number): string {
  if (str.length <= front + back) return str;
  return `${str.slice(0, front)}...${str.slice(str.length - back)}`;
}

export function getInitials(name: string | null): string {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return '';
  if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
