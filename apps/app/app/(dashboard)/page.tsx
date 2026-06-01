import Link from 'next/link';
import { createClient } from '../../lib/supabase/server';
import { 
  Zap, BarChart2, ShieldCheck, AlertTriangle, 
  TrendingUp, TrendingDown, AlertOctagon, Info, ArrowRight,
  Copy
} from 'lucide-react';
import { TrustScoreChart } from '../../components/dashboard/trust-score-chart';

export const metadata = { title: 'Dashboard' };

// Utility to format relative time
function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

function StatCard({ label, value, icon: Icon, delta, iconColor, sub }: any) {
  return (
    <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl p-5 flex flex-col">
      <div className="flex justify-between items-start">
        <span className="text-[11px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium">
          {label}
        </span>
        <div className="w-7 h-7 rounded-md bg-[#161616] border border-[#222222] flex items-center justify-center">
          <Icon size={14} className={iconColor || 'text-[#6e6c76]'} />
        </div>
      </div>
      <div className="text-[36px] font-light text-white mt-3 leading-none">
        {value}
      </div>
      {delta !== undefined && (
        <div className="text-[11px] mt-3 flex items-center gap-1.5">
          {delta > 0 ? (
            <TrendingUp size={12} className="text-[#596235]" />
          ) : delta < 0 ? (
            <TrendingDown size={12} className="text-[#912c2c]" />
          ) : null}
          <span className={delta > 0 ? 'text-[#596235]' : delta < 0 ? 'text-[#912c2c]' : 'text-[#6e6c76]'}>
            {delta > 0 ? '↑' : delta < 0 ? '↓' : ''} {Math.abs(delta)}%
          </span>
          <span className="text-[#3d3b45] ml-0.5">vs yesterday</span>
        </div>
      )}
      {sub && (
        <div className="text-[10px] text-[#3d3b45] mt-3 uppercase tracking-wider">{sub}</div>
      )}
    </div>
  );
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

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*, organizations(*)')
    .eq('id', user.id)
    .single();
    
  if (!profile) return null;
  const orgs: any = profile.organizations;
  const org = Array.isArray(orgs) ? orgs[0] : orgs;
  if (!org) return null;

  // Fetch data
  const [
    { data: statsData },
    { data: timeseriesData },
    { data: decisionsData },
    { data: violationsData }
  ] = await Promise.all([
    supabase.rpc('get_dashboard_stats', { p_org_id: org.id }),
    supabase.rpc('get_trust_timeseries', { p_org_id: org.id, p_days: 30 }),
    supabase.from('decision_events')
      .select('*')
      .eq('org_id', org.id)
      .order('created_at', { ascending: false })
      .limit(8),
    supabase.from('decision_events')
      .select('*')
      .eq('org_id', org.id)
      .in('governance_status', ['flagged', 'blocked'])
      .order('created_at', { ascending: false })
      .limit(5)
  ]);

  const stats = statsData || {
    decisions_today: 0,
    decisions_yesterday: 0,
    decisions_this_month: 0,
    avg_trust_score_7d: null,
    avg_trust_score_prev_7d: null,
    violations_this_week: 0,
    active_rules: 0
  };

  const chartData = (timeseriesData || []).map((d: any) => ({
    date: d.bucket,
    value: d.avg_trust
  }));

  const decisions = decisionsData || [];
  const violations = violationsData || [];

  // Calculate delta for decisions
  const decYesterday = stats.decisions_yesterday || 0;
  const decToday = stats.decisions_today || 0;
  const decisionsDelta = decYesterday === 0 ? (decToday > 0 ? 100 : 0) : Math.round(((decToday - decYesterday) / decYesterday) * 100);

  // Trust score color
  const trustValue = stats.avg_trust_score_7d;
  let trustColor = 'text-[#6e6c76]';
  if (trustValue !== null) {
    if (trustValue >= 0.8) trustColor = 'text-[#596235]';
    else if (trustValue >= 0.6) trustColor = 'text-[#d96846]';
    else trustColor = 'text-[#912c2c]';
  }

  return (
    <div className="flex flex-col gap-5">
      {/* STATS ROW */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard 
          label="Decisions Today" 
          value={stats.decisions_today} 
          icon={Zap} 
          iconColor="text-[#d96846]"
          delta={decisionsDelta}
        />
        <StatCard 
          label="This Month" 
          value={stats.decisions_this_month} 
          icon={BarChart2} 
          sub={org.plan === 'free' ? `Limit: 10,000` : 'Unlimited'}
        />
        <StatCard 
          label="Avg Trust (7d)" 
          value={trustValue !== null ? trustValue.toFixed(2) : '—'} 
          icon={ShieldCheck} 
          iconColor={trustColor}
        />
        <StatCard 
          label="Violations (7d)" 
          value={stats.violations_this_week} 
          icon={AlertTriangle} 
          iconColor={stats.violations_this_week > 0 ? 'text-[#d96846]' : 'text-[#6e6c76]'}
          sub={`${stats.active_rules} rules active`}
        />
      </div>

      {/* MAIN CONTENT ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
        <div className="lg:col-span-2 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#1a1a1a] flex justify-between items-center">
            <span className="text-[15px] text-white font-normal">Trust Score (30d)</span>
            <Link href="/decisions" className="text-sm text-[#d96846] hover:text-white transition-colors">
              View all →
            </Link>
          </div>
          <div className="p-5 flex-1 w-full overflow-hidden">
            <TrustScoreChart data={chartData} />
          </div>
        </div>

        <div className="lg:col-span-1 bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden flex flex-col">
          <div className="px-5 py-4 border-b border-[#1a1a1a] flex justify-between items-center bg-[#050505]">
            <span className="text-[15px] text-white font-normal">Alerts</span>
            {violations.length > 0 && (
              <span className="bg-[rgba(217,104,70,0.12)] text-[#d96846] text-[10px] uppercase font-medium rounded-full px-2 py-0.5">
                {violations.length} New
              </span>
            )}
          </div>
          <div className="flex-1 overflow-y-auto no-scrollbar max-h-[290px] bg-[#0a0a0a]">
            {violations.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center text-center">
                <ShieldCheck size={24} className="text-[#596235] mb-2" />
                <span className="text-sm text-[#6e6c76]">No violations this week</span>
                <span className="text-xs text-[#3d3b45] mt-1">Your governance rules are passing.</span>
              </div>
            ) : (
              <div className="flex flex-col">
                {violations.map((v: any) => {
                  const isBlocked = v.governance_status === 'blocked';
                  return (
                    <Link key={v.id} href={`/decisions/${v.id}`} className="flex items-start gap-3 px-5 py-4 border-b border-[#1a1a1a] last:border-0 hover:bg-[#121212] transition-colors cursor-pointer group">
                      <div className={`w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 ${isBlocked ? 'bg-[rgba(145,44,44,0.1)]' : 'bg-[rgba(217,104,70,0.1)]'}`}>
                        {isBlocked ? (
                          <AlertOctagon size={14} className="text-[#912c2c]" />
                        ) : (
                          <AlertTriangle size={14} className="text-[#d96846]" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] text-white truncate capitalize">
                          {v.governance_status} Alert
                        </div>
                        <div className="text-[11px] font-mono text-[#6e6c76] mt-0.5 truncate">
                          {v.id.split('-')[0]}
                        </div>
                        <div className="text-[11px] text-[#3d3b45] mt-0.5">
                          {formatRelativeTime(v.created_at)}
                        </div>
                      </div>
                      <ArrowRight size={12} className="text-[#2e2e2e] group-hover:text-[#6e6c76] mt-1 transition-colors" />
                    </Link>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* RECENT DECISIONS TABLE */}
      <div className="bg-[#0f0f0f] border border-[#1a1a1a] rounded-xl overflow-hidden w-full">
        <div className="px-5 py-4 border-b border-[#1a1a1a] flex justify-between items-center bg-[#050505]">
          <span className="text-[15px] text-white font-normal">Recent Decisions</span>
          <Link href="/decisions" className="text-sm text-[#d96846] hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
              <tr>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium font-sans">Time</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium font-sans">Model</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium font-sans">Domain</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium font-sans">Trust</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium font-sans">Status</th>
                <th className="px-5 py-3 text-[10px] uppercase tracking-[0.08em] text-[#3d3b45] font-medium font-sans">ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#161616] bg-[#050505]">
              {decisions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <span className="text-sm text-[#6e6c76]">No decisions recorded yet</span>
                  </td>
                </tr>
              ) : (
                decisions.map((d: any) => (
                  <tr key={d.id} className="hover:bg-[#0a0a0a] transition-colors duration-100 group">
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="block text-[12px] text-[#6e6c76]">
                        {formatRelativeTime(d.created_at)}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="block font-mono text-[11px] text-[#cdcbd6] max-w-[120px] truncate">
                        {d.model_name}
                      </Link>
                    </td>
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="block">
                        {d.domain ? (
                          <span className="inline-block bg-[#161616] border border-[#222222] rounded-[4px] px-2 py-0.5 text-[11px] text-[#6e6c76] capitalize">
                            {d.domain}
                          </span>
                        ) : (
                          <span className="text-[#3d3b45]">—</span>
                        )}
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
                    <td className="px-5 py-3.5">
                      <Link href={`/decisions/${d.id}`} className="flex items-center gap-2 group-hover:text-white text-[#3d3b45]">
                        <span className="font-mono text-[11px]">{d.id.substring(0, 8)}...</span>
                        <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#6e6c76] hover:text-white" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
