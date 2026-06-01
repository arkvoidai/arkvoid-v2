"use client"

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { createClient } from '../../../lib/supabase/client';
import { useApp } from '../../../components/providers/app-provider';
import { 
  Download, Search, X, MoreHorizontal, ChevronLeft, ChevronRight, Copy
} from 'lucide-react';

type GovernanceStatus = 'passed' | 'flagged' | 'blocked' | 'pending' | 'reviewing';
type TrustGrade = 'A' | 'B' | 'C' | 'D' | 'F';

interface DecisionEvent {
  id: string;
  created_at: string;
  model_name: string;
  domain: string;
  trust_score: number;
  trust_grade: TrustGrade;
  governance_status: GovernanceStatus;
  input_context: any;
  latency_ms: number;
}

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function TrustBadge({ score, grade }: { score: number | null, grade: string | null }) {
  if (score === null || grade === null) {
    return <span className="text-[#3d3b45]">—</span>;
  }
  
  let colorClass = '';
  if (grade === 'A' || grade === 'B') {
    colorClass = 'bg-[rgba(89,98,53,0.1)] text-[#596235] border-[rgba(89,98,53,0.2)]';
  } else if (grade === 'C') {
    colorClass = 'bg-[rgba(217,104,70,0.08)] text-[#d96846] border-[rgba(217,104,70,0.2)]';
  } else {
    colorClass = 'bg-[rgba(145,44,44,0.08)] text-[#912c2c] border-[rgba(145,44,44,0.2)]';
  }
  
  return (
    <span className={`inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-[4px] border ${colorClass}`}>
      {grade} {score.toFixed(2)}
    </span>
  );
}

export default function DecisionsPage() {
  const { org } = useApp();
  const supabase = createClient();
  
  const [decisions, setDecisions] = useState<DecisionEvent[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  
  const [search, setSearch] = useState('');
  const [searchValue, setSearchValue] = useState(''); // actual input value
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterGrade, setFilterGrade] = useState<string>('all');
  const [dateRange, setDateRange] = useState<string>('7d');
  const [sortBy, setSortBy] = useState<string>('newest');
  
  const [page, setPage] = useState(1);
  const pageSize = 25;

  const searchTimer = useRef<NodeJS.Timeout | null>(null);

  const fetchDecisions = useCallback(async () => {
    if (!org) return;
    setLoading(true);
    try {
      let query = supabase
        .from('decision_events')
        .select('*', { count: 'exact' })
        .eq('org_id', org.id);

      if (search) {
        query = query.or(`model_name.ilike.%${search}%,domain.ilike.%${search}%`);
      }
      
      if (filterStatus !== 'all') query = query.eq('governance_status', filterStatus);
      if (filterDomain !== 'all') query = query.eq('domain', filterDomain);
      if (filterGrade !== 'all') query = query.eq('trust_grade', filterGrade);
      
      const now = new Date();
      if (dateRange === '24h') query = query.gte('created_at', new Date(now.getTime() - 24*3600000).toISOString());
      else if (dateRange === '7d') query = query.gte('created_at', new Date(now.getTime() - 7*24*3600000).toISOString());
      else if (dateRange === '30d') query = query.gte('created_at', new Date(now.getTime() - 30*24*3600000).toISOString());
      else if (dateRange === '90d') query = query.gte('created_at', new Date(now.getTime() - 90*24*3600000).toISOString());

      if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
      else if (sortBy === 'oldest') query = query.order('created_at', { ascending: true });
      else if (sortBy === 'trust_asc') query = query.order('trust_score', { ascending: true });
      else if (sortBy === 'trust_desc') query = query.order('trust_score', { ascending: false });

      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        setDecisions(data);
        if (count !== null) setTotal(count);
      }
    } catch(err) {
      console.error(err);
    }
    setLoading(false);
  }, [org, search, filterStatus, filterDomain, filterGrade, dateRange, sortBy, page, pageSize, supabase]);

  useEffect(() => {
    fetchDecisions();
  }, [fetchDecisions]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setSearch(e.target.value);
      setPage(1);
    }, 350);
  };

  const clearSearch = () => {
    setSearchValue('');
    setSearch('');
    setPage(1);
  };

  const resetFilters = () => {
    setSearchValue('');
    setSearch('');
    setFilterStatus('all');
    setFilterDomain('all');
    setFilterGrade('all');
    setDateRange('7d');
    setSortBy('newest');
    setPage(1);
  };

  const hasFilters = search || filterStatus !== 'all' || filterDomain !== 'all' || filterGrade !== 'all' || dateRange !== '7d' || sortBy !== 'newest';

  const exportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(decisions, null, 2));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", `decisions-export-${new Date().getTime()}.json`);
    dlAnchorElem.click();
  };

  // Pagination logic
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const pageNumbers = [];
  
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    if (page <= 4) {
      pageNumbers.push(1, 2, 3, 4, 5, '...', totalPages);
    } else if (page >= totalPages - 3) {
      pageNumbers.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pageNumbers.push(1, '...', page - 1, page, page + 1, '...', totalPages);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-light text-white">Decisions</h1>
        <button 
          onClick={exportData}
          className="flex items-center gap-2 px-3 py-1.5 border border-[#2e2e2e] hover:border-[#6e6c76] hover:bg-[#0f0f0f] rounded-md text-sm text-[#cdcbd6] transition-colors"
        >
          <Download size={14} />
          <span>Export</span>
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-3 flex flex-wrap gap-2 items-center">
        <div className="flex-1 min-w-[200px] relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#3d3b45]" />
          <input 
            type="text"
            value={searchValue}
            onChange={handleSearchChange}
            placeholder="Search by model, domain..."
            className="w-full bg-[#000] border border-[#1a1a1a] rounded-md pl-9 pr-8 py-2 text-[13px] text-white placeholder-[#3d3b45] focus:outline-none focus:border-[#d96846]/50 transition-colors"
          />
          {searchValue && (
            <button onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e6c76] hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>

        <select 
          value={filterStatus}
          onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
          className="bg-[#000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[13px] text-[#6e6c76] hover:border-[#2e2e2e] hover:text-[#cdcbd6] focus:outline-none focus:border-[#d96846]/50 transition-all cursor-pointer appearance-none min-w-[120px]"
        >
          <option value="all">All Status</option>
          <option value="passed">Passed</option>
          <option value="flagged">Flagged</option>
          <option value="blocked">Blocked</option>
          <option value="pending">Pending</option>
        </select>

        <select
          value={filterGrade}
          onChange={(e) => { setFilterGrade(e.target.value); setPage(1); }}
          className="bg-[#000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[13px] text-[#6e6c76] hover:border-[#2e2e2e] hover:text-[#cdcbd6] focus:outline-none transition-all cursor-pointer appearance-none min-w-[100px]"
        >
          <option value="all">All Grades</option>
          <option value="A">Grade A</option>
          <option value="B">Grade B</option>
          <option value="C">Grade C</option>
          <option value="D">Grade D</option>
          <option value="F">Grade F</option>
        </select>

        <select
          value={dateRange}
          onChange={(e) => { setDateRange(e.target.value); setPage(1); }}
          className="bg-[#000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[13px] text-[#6e6c76] hover:border-[#2e2e2e] hover:text-[#cdcbd6] focus:outline-none transition-all cursor-pointer appearance-none min-w-[100px]"
        >
          <option value="24h">Last 24h</option>
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
          <option value="all">All time</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
          className="bg-[#000] border border-[#1a1a1a] rounded-md px-3 py-2 text-[13px] text-[#6e6c76] hover:border-[#2e2e2e] hover:text-[#cdcbd6] focus:outline-none transition-all cursor-pointer appearance-none min-w-[120px]"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="trust_desc">Highest trust</option>
          <option value="trust_asc">Lowest trust</option>
        </select>

        {hasFilters && (
          <button onClick={resetFilters} className="text-xs text-[#d96846] hover:text-[#e0896d] px-2 transition-colors">
            Clear all
          </button>
        )}

        <div className="ml-auto text-xs text-[#3d3b45] hidden lg:block">
          {total.toLocaleString()} decisions
        </div>
      </div>

      {/* DECISIONS TABLE */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden w-full relative min-h-[400px]">
        {loading && (
          <div className="absolute inset-0 z-10 bg-[#000]/50 backdrop-blur-[2px] flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#d96846] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
        
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Time</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium hidden md:table-cell">Model</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium hidden md:table-cell">Domain</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium hidden lg:table-cell">Input Preview</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Trust</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">Status</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium hidden lg:table-cell">Latency</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium hidden md:table-cell">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] bg-[#050505]">
              {decisions.length === 0 && !loading ? (
                <tr>
                  <td colSpan={8} className="px-5 py-24 text-center">
                    <span className="text-sm text-[#6e6c76]">No decisions match your filters</span>
                  </td>
                </tr>
              ) : (
                decisions.map((d) => (
                  <tr key={d.id} className="hover:bg-[#0a0a0a] transition-colors duration-100 group">
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="block text-[12px] text-[#cdcbd6]">
                        {formatRelativeTime(d.created_at)}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <Link href={`/decisions/${d.id}`} className="block font-mono text-[11px] text-[#6e6c76] max-w-[120px] truncate">
                        {d.model_name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <Link href={`/decisions/${d.id}`} className="block">
                        {d.domain ? (
                          <span className="inline-block border border-[#222222] rounded-[4px] px-2 py-0.5 text-[11px] text-[#6e6c76] capitalize">
                            {d.domain}
                          </span>
                        ) : (
                          <span className="text-[#3d3b45]">—</span>
                        )}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <Link href={`/decisions/${d.id}`} className="block">
                        <span className="font-mono text-[10px] text-[#3d3b45] max-w-[200px] truncate block">
                          {JSON.stringify(d.input_context).substring(0, 40)}{d.input_context && JSON.stringify(d.input_context).length > 40 ? '...' : ''}
                        </span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="block">
                        <TrustBadge score={d.trust_score} grade={d.trust_grade} />
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="flex items-center gap-1.5">
                        <div className={`w-1.5 h-1.5 rounded-full ${
                          d.governance_status === 'passed' ? 'bg-[#596235]' :
                          d.governance_status === 'flagged' ? 'bg-[#d96846]' :
                          d.governance_status === 'blocked' ? 'bg-[#912c2c]' :
                          'bg-[#6e6c76]'
                        }`} />
                        <span className="text-[12px] text-[#cdcbd6] capitalize">{d.governance_status}</span>
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell">
                      <Link href={`/decisions/${d.id}`} className="block text-[11px] text-[#6e6c76]">
                        {d.latency_ms ? `${d.latency_ms}ms` : '—'}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <div className="flex items-center gap-2 group-hover:text-white text-[#3d3b45]">
                        <span className="font-mono text-[11px]">{d.id.substring(0, 8)}</span>
                        <button 
                          onClick={(e) => { e.preventDefault(); navigator.clipboard.writeText(d.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6e6c76] hover:text-white"
                        >
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PAGINATION */}
      {total > 0 && (
        <div className="flex items-center justify-between mt-1">
          <div className="text-xs text-[#6e6c76]">
            Showing {(page - 1) * pageSize + 1}–{Math.min(page * pageSize, total)} of {total}
          </div>
          
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-sm border border-transparent text-[#6e6c76] hover:bg-[#0f0f0f] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {pageNumbers.map((p, i) => (
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="w-7 text-center text-[#3d3b45] text-xs">...</span>
              ) : (
                <button
                  key={p}
                  onClick={() => setPage(p as number)}
                  className={`w-7 h-7 flex items-center justify-center rounded-[4px] text-xs font-mono transition-colors ${
                    page === p 
                      ? 'bg-[rgba(217,104,70,0.15)] text-[#d96846] border border-[#d96846]/20' 
                      : 'text-[#6e6c76] hover:bg-[#0f0f0f] border border-transparent'
                  }`}
                >
                  {p}
                </button>
              )
            ))}

            <button 
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-sm border border-transparent text-[#6e6c76] hover:bg-[#0f0f0f] disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
